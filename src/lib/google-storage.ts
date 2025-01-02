import { Storage } from '@google-cloud/storage';

// Validate required environment variables
function validateEnvironment() {
  const required = ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_PROJECT_ID'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnvironment();

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
    private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID || ''
  }
});
console.log('Google Cloud Storage initialized');
console.log('Client email:', process.env.GOOGLE_CLIENT_EMAIL,
  'Private key:', process.env.GOOGLE_PRIVATE_KEY
);

console.log('private with new lines:', process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'))

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET || 'wordwisp';
const BASE_URL = `https://storage.googleapis.com/${BUCKET_NAME}`;

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
    if (!bucket) {
      bucket = await initializeBucket();
    }

    if (!fileName) {
      throw new Error('Invalid file name provided');
    }

    // Sanitize filename - remove special characters and spaces
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/\s+/g, '-');
    
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    const filePath = `audios/${uniqueName}`;
    const file = bucket.file(filePath);

    const options = {
      resumable: false,
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };

    await file.save(buffer, options);
    await file.makePublic();

    // Construct safe URL
    const safeFilePath = encodeURIComponent(filePath).replace(/%2F/g, '/');
    const publicUrl = `${BASE_URL}/${safeFilePath}`;

    // Validate URL before returning
    if (!publicUrl.startsWith('https://')) {
      throw new Error('Invalid URL generated');
    }

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }
}
