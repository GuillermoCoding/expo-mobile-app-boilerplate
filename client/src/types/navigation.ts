import { StoolRecord } from '@/types';

export type RootStackParamList = {
  Main: undefined;
  StoolRecordDetails: {
    record: StoolRecord;
    id: number;
  };
}; 