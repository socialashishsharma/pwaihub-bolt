import { useState } from 'react';
import { uploadFile, DocumentProcessingError } from '../services/upload';
import { ProcessedDocument } from '../services/document/types';

interface UseFileUploadOptions {
  onSuccess?: (result: ProcessedDocument) => void;
  onError?: (error: Error) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File): Promise<ProcessedDocument | null> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadFile(file, {
        onProgress: setProgress,
        onSuccess: options.onSuccess,
        onError: (error) => {
          setError(error);
          options.onError?.(error);
        }
      });

      return result;
    } catch (error) {
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    progress,
    error,
    reset: () => {
      setIsUploading(false);
      setProgress(0);
      setError(null);
    }
  };
}

export type { UseFileUploadOptions };
export { DocumentProcessingError };