import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/requests';

interface Streak {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastRecordDate: string;
}

export const useUpdateStreakMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/streak/update');
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['streak'], data);
    }
  });
}; 