import { api } from '@/services/requests';

export interface UploadImageResult {
  signedUrl: string;
  key: string;
}

interface SignedUrlResponse {
  signedUrl: string;
  key: string;
  expiresIn: number;
}

interface TempIdResponse {
  tempId: number;
}

export const generateTempLogId = async (): Promise<number> => {
  try {
    const response = await api.post<TempIdResponse>('/upload/temp-id');
    return response.data.tempId;
  } catch (error) {
    console.error('Error generating temp log ID:', error);
    throw error;
  }
};

export const getSignedUploadUrl = async (logId: number): Promise<SignedUrlResponse> => {
  try {
    const response = await api.post<SignedUrlResponse>('/upload/signed-url', {
      logId,
      contentType: 'image/jpeg',
      expiresIn: 300, // 5 minutes
    });
    return response.data;
  } catch (error) {
    console.error('Error getting signed upload URL:', error);
    throw error;
  }
};

export const uploadImageToS3 = async (
  imageUri: string, 
  logId: number
): Promise<UploadImageResult> => {
  try {
    // Step 1: Get signed URL from our server
    const { signedUrl, key } = await getSignedUploadUrl(logId);
    
    // Step 2: Convert the local image URI to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Step 3: Upload directly to S3 using the signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    // Step 4: Get a download signed URL from our server
    const downloadUrlResponse = await api.post<{ signedUrl: string }>('/upload/download-url', {
      key,
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    });
    
    return {
      signedUrl: downloadUrlResponse.data.signedUrl,
      key,
    };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

export const deleteImageFromS3 = async (key: string): Promise<void> => {
  try {
    await api.delete(`/upload/file/${encodeURIComponent(key)}`);
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};

export const getSignedDownloadUrl = async (key: string, expiresIn: number = 60 * 60 * 24 * 7): Promise<string> => {
  try {
    const response = await api.post<{ signedUrl: string }>('/upload/download-url', {
      key,
      expiresIn,
    });
    return response.data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}; 