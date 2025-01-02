import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');

// Helper function to determine content type
function getContentType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const contentTypes = {
    // Image types
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    // Audio types
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'ogg': 'audio/ogg'
  };
  
  return contentTypes[extension as keyof typeof contentTypes] || 'application/octet-stream';
}

export async function uploadToBlob(containerName: string, blobName: string, data: Buffer, originalFileName: string): Promise<string> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(data, data.length, {
    blobHTTPHeaders: {
      blobContentType: getContentType(originalFileName),
    }
  });
  
  return blockBlobClient.url;
}

export function generateBlobName(fileName: string): string {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}
