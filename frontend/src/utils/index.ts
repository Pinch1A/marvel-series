import axios, { AxiosError } from 'axios';

export const isAxiosError = (error: any): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const getAxiosErrorMessage = (error: AxiosError): string => {
  if (error.response && error.response.data && error.response.data.status) {
    return error.response.data.status;
  }
  return error.message;
};
