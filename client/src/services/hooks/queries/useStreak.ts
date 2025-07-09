import { useQuery } from '@tanstack/react-query';

import { getStreak } from '@/services/requests';
import { Streak } from '@/types/streak';
import { STALE_TIME } from '@/utils/constants';

export const useStreak = () => {
  return useQuery<Streak[]>({
    queryKey: ['streak'],
    queryFn: getStreak,
    staleTime: STALE_TIME,
  });
}; 