import { useMutation } from '@tanstack/react-query';

import { analyzeStoolImage } from '@/services/requests';

export function useAnalyzeStoolImage() {
  return useMutation({
    mutationFn: (imageUrl: string) => analyzeStoolImage(imageUrl),
  });
} 