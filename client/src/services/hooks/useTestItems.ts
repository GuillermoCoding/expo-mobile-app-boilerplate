import { useQuery } from '@tanstack/react-query';
import { api, TestResponse } from '../requests';

export const useTestItems = () => {
  return useQuery<TestResponse, Error>({
    queryKey: ['testItems'],
    queryFn: api.test.getItems
  });
}; 