export interface StoolRecord {
  id: number;
  imageUrl: string;
  description: string;
  notes?: string;
  recommendations?: string;
  bristolCategoryId?: number;
  bristolCategory?: BristolCategory;
  createdAt: string;
  updatedAt: string;
  userId: number;
  isAnalyzing?: boolean;
  progress?: number;
}

export interface CreateStoolRecordParams {
  imageUrl: string;
  description: string;
  notes?: string;
  recommendations?: string;
  bristolCategoryId?: number;
  createdAt?: string;
}

export interface GetStoolRecordsParams {
  startDate?: string;
  endDate?: string;
}

export interface BristolCategory {
  id: number;
  type: string;
  key: string;
  color: string;
  description: string;
}