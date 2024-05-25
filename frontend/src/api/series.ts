import axiosInstance from './index';
import { FetchSeriesParams, ResponseData, Series, Character } from '@/types';
import { isAxiosError, getAxiosErrorMessage } from '../utils';

export const fetchSeries = async (params: FetchSeriesParams): Promise<ResponseData<Series>> => {
  try {
    const response = await axiosInstance.get('/series', { params });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = getAxiosErrorMessage(error);
      console.error('Error fetching series:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error fetching series:', error);
      throw new Error('Unexpected error fetching series');
    }
  }
};

export const fetchCharactersBySeries = async (seriesId: number): Promise<ResponseData<Character>> => {
  try {
    const response = await axiosInstance.get(`/series/${seriesId}/characters`);
    return response.data.data; // Assuming the structure of your API response
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
