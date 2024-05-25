import axiosInstance from './index';
import { Character } from '@/types';
import { isAxiosError, getAxiosErrorMessage } from '@/utils';

interface FetchCharactersParams {
  name?: string;
  series?: string;
  story?: string;
}

interface ResponseData {
  data: {
    count: number;
    limit: number;
    offset: number;
    results: Character[];
    total: number;
  }
}

export const fetchCharacters = async (params: FetchCharactersParams): Promise<ResponseData> => {
  try {
    const response = await axiosInstance.get('/characters', { params });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = getAxiosErrorMessage(error);
      console.error('Error fetching characters:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error fetching characters:', error);
      throw new Error('Unexpected error fetching characters');
    }
  }
};
