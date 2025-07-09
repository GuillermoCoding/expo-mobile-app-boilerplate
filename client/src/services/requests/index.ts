import axios, {InternalAxiosRequestConfig } from 'axios';

import { getAuthenticatedHeaders } from '@/config/supabase';
import { StoolRecord, CreateStoolRecordParams, GetStoolRecordsParams } from '@/types';
import { Streak, ApiResponse } from '@/types/streak';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
});

// Add auth token to requests
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const headers = await getAuthenticatedHeaders();
  config.headers.set('Authorization', headers.Authorization);
  return config;
});

export const getStreak = async () => {
  const response = await api.get<ApiResponse<Streak[]>>('/streak');
  if ('error' in response.data) {
    throw new Error(response.data.error);
  }
  return response.data;
};

export const getStoolRecords = async (params?: GetStoolRecordsParams) => {
  const response = await api.get<StoolRecord[]>('/stool-records', {
    params,
  });

  return response.data;
};

export const createStoolRecord = async (data: CreateStoolRecordParams) => {
  const response = await api.post<StoolRecord>('/stool-records', data);

  return response.data;
};

export const updateStoolRecord = async (id: number, description: string): Promise<StoolRecord> => {
  const { data } = await api.put<StoolRecord>(`/stool-records/${id}`, { description });

  return data;
};

export const deleteStoolRecord = async (id: number) => {
  const response = await api.delete(`/stool-records/${id}`);
  return response.data;
};

interface AnalyzeStoolImageResponse {
  bristolCategoryId: number;
  description: string;
  observations: string;
  recommendations: string;
}

export const analyzeStoolImage = async (imageUrl: string): Promise<AnalyzeStoolImageResponse> => {
  const response = await api.post('/ai/analyze-stool', { imageUrl });
  return response.data;
}; 