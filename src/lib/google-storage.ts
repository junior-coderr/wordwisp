import { Storage, Bucket } from '@google-cloud/storage';
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

const storage = new Storage({
  credentials,
  projectId: credentials.project_id,
});

const BUCKET_NAME = 'wordwisp';

// Initialize bucket with creation if it doesn't exist
async function initializeBucket(): Promise<Bucket> {
  try {
    const [exists] = await storage.bucket(BUCKET_NAME).exists();
    if (!exists) {
      const [bucket] = await storage.createBucket(BUCKET_NAME, {
        location: 'US',
        storageClass: 'STANDARD',
        publicAccessPrevention: 'inherited',
      });
      console.log(`Bucket ${BUCKET_NAME} created.`);
      return bucket;
    }
    return storage.bucket(BUCKET_NAME);
  } catch (error) {
    console.error('Error initializing bucket:', error);
    throw new Error('Failed to initialize storage bucket');
  }
}

// Initialize bucket and export for use
let bucket: Bucket | null = null;

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
    return `https://storage.googleapis.com/${BUCKET_NAME}/audios/${uniqueName}`;
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
