import { Storage } from '@google-cloud/storage';

// Validate required environment variables
const requiredEnvVars = ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_PROJECT_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Fix potential private key formatting issues
const privateKey = process.env.GOOGLE_PRIVATE_KEY!
  .replace(/\\n/g, '\n')
  .replace(/^"(.*)"$/, '$1'); // Remove any wrapping quotes

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
    project_id: process.env.GOOGLE_PROJECT_ID
  },
  projectId: process.env.GOOGLE_PROJECT_ID
});

const BUCKET_NAME = 'wordwisp';

// Initialize bucket with better error handling
async function initializeBucket() {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      const [newBucket] = await storage.createBucket(BUCKET_NAME, {
        location: 'US',
        storageClass: 'STANDARD',
        publicAccessPrevention: 'inherited',
      });
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
      return newBucket;
    }
    
    return bucket;
  } catch (error) {
    console.error('Detailed bucket initialization error:', error);
    if (error instanceof Error) {
      throw new Error(`Bucket initialization failed: ${error.message}`);
    }
    throw error;
  }
}

// Initialize bucket with retry mechanism
let bucket: any;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;

async function ensureBucket() {
  while (!bucket && initializationAttempts < MAX_ATTEMPTS) {
    try {
      initializationAttempts++;
      bucket = await initializeBucket();
    } catch (error) {
      console.error(`Bucket initialization attempt ${initializationAttempts} failed:`, error);
      if (initializationAttempts === MAX_ATTEMPTS) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * initializationAttempts));
    }
  }
  return bucket;
}

export async function uploadToGoogleCloud(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    // Ensure bucket is initialized
    if (!bucket) {
      bucket = await ensureBucket();
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
