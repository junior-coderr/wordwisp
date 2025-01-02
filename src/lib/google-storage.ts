import { Storage } from '@google-cloud/storage';

let credentials;
try {
  let credentialsString = process.env.GOOGLE_CREDENTIALS_JSON || '';
  
  // Remove any wrapping single quotes if present
  credentialsString = credentialsString.replace(/^'(.*)'$/, '$1');
  
  // Clean up any escaped characters and normalize whitespace
  credentialsString = credentialsString
    .replace(/\\n/g, '')
    .replace(/\\"/g, '"')
    .replace(/[\n\r\t]/g, '')
    .trim();

  if (!credentialsString) {
    throw new Error('GOOGLE_CREDENTIALS_JSON environment variable is not set');
  }

  try {
    credentials = JSON.parse(credentialsString);
  } catch (parseError) {
    console.error('Raw credentials string:', credentialsString.substring(0, 50) + '...');
    throw new Error(`JSON parsing failed: ${parseError.message}`);
  }
  
  if (!credentials.project_id) {
    throw new Error('Invalid credentials: project_id is missing');
  }
} catch (error) {
  console.error('Error parsing Google Cloud credentials:', error);
  throw new Error('Failed to initialize Google Cloud credentials. Check your GOOGLE_CREDENTIALS_JSON format.');
}

const storage = new Storage({
  credentials,
  projectId: credentials.project_id,
});

const BUCKET_NAME = 'wordwisp';

// Initialize bucket with creation if it doesn't exist
async function initializeBucket() {
  try {
    const [exists] = await storage.bucket(BUCKET_NAME).exists();
    if (!exists) {
      await storage.createBucket(BUCKET_NAME, {
        location: 'US', // or your preferred location
        storageClass: 'STANDARD',
        publicAccessPrevention: 'inherited',
      });
      console.log(`Bucket ${BUCKET_NAME} created.`);
    }
    return storage.bucket(BUCKET_NAME);
  } catch (error) {
    console.error('Error initializing bucket:', error);
    throw new Error('Failed to initialize storage bucket');
  }
}

// Initialize bucket and export for use
let bucket: any;
initializeBucket()
  .then((b) => { bucket = b; })
  .catch(console.error);

export async function uploadToGoogleCloud(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    // Ensure bucket is initialized
    if (!bucket) {
      bucket = await initializeBucket();
    }

    const uniqueName = `${Date.now()}-${fileName}`;
    const file = bucket.file(`audios/${uniqueName}`);

    const options = {
      resumable: false,
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };

    // Upload the file
    await file.save(buffer, options);

    // Make the file public
    await file.makePublic();

    // Return the public URL
    return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
  } catch (error) {
    console.error('Detailed upload error:', error);
    if (error instanceof Error) {
      throw new Error(`Google Cloud Storage upload failed: ${error.message}`);
    }
    throw error;
  }
}

// Helper function to check if bucket exists and is accessible
export async function checkBucketAccess(): Promise<boolean> {
  try {
    const [exists] = await storage.bucket(BUCKET_NAME).exists();
    return exists;
  } catch (error) {
    console.error('Error checking bucket access:', error);
    return false;
  }
}
