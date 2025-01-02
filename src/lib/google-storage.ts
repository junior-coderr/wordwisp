import { Storage } from '@google-cloud/storage';


const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID
  }
});
console.log('Google Cloud Storage initialized');
console.log('Client email:', process.env.GOOGLE_CLIENT_EMAIL,
  'Private key:', process.env.GOOGLE_PRIVATE_KEY
);

console.log('private with new lines:', process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'))

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
    if (!bucket) {
      bucket = await initializeBucket();
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

    // Construct URL using encodeURIComponent for the path components
    const encodedBucket = encodeURIComponent(bucket.name);
    const encodedFilePath = encodeURIComponent(filePath);
    const publicUrl = `https://storage.googleapis.com/${encodedBucket}/${encodedFilePath}`;

    // Validate the URL
    try {
      new URL(publicUrl);
      return publicUrl;
    } catch (urlError) {
      throw new Error(`Invalid URL generated: ${urlError.message}`);
    }
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw new Error(`Google Cloud Storage upload failed: ${error.message}`);
  }
}
