import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createStoolRecord } from '@/services/requests';
import { CreateStoolRecordParams } from '@/types';

export const useCreateStoolRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoolRecordParams) => createStoolRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stool-records'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
};
