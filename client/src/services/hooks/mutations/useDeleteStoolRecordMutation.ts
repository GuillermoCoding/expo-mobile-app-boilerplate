import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteStoolRecord } from '@/services/requests';

export const useDeleteStoolRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStoolRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stool-records'] });
    },
  });
}; 