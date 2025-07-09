import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStoolRecord } from '@/services/requests';
import { StoolRecord } from '@/types';

interface UpdateStoolRecordVariables {
  id: number;
  description: string;
}

export function useUpdateStoolRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation<StoolRecord, Error, UpdateStoolRecordVariables>({
    mutationFn: ({ id, description }) => updateStoolRecord(id, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stool-records'] });
    },
  });
} 