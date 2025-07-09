import { useQuery } from '@tanstack/react-query';

import { getStoolRecords } from '@/services/requests';
import { GetStoolRecordsParams } from '@/types';
import { STALE_TIME } from '@/utils/constants';

export function useStoolRecords(params?: GetStoolRecordsParams) {
  return useQuery({
    queryKey: ['stool-records', params],
    queryFn: () => getStoolRecords(params),
    staleTime: STALE_TIME,
  });
}
