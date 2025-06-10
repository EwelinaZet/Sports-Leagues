import axios, { AxiosError } from 'axios';
import { ApiResult, ApiError, ApiResponse } from '../types/api';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

const createApiError = (error: unknown, endpoint: string): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    return {
      message: axiosError.response?.data?.error?.message || 'An unknown error occurred',
      code: axiosError.response?.status || 500,
      endpoint,
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    code: 500,
    endpoint,
  };
};

export const apiRequest = async <T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<ApiResult<T[]>> => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get<ApiResponse<T>>(url);
    
    // Check if the API returned an error
    if (response.data.error) {
      return {
        data: null,
        error: {
          message: response.data.error.message,
          code: response.data.error.code,
          endpoint,
        },
      };
    }

    // Check if we have the expected data structure
    const data = response.data.leagues || response.data.seasons;
    if (!data) {
      return {
        data: null,
        error: {
          message: 'Invalid API response format',
          code: 500,
          endpoint,
        },
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: createApiError(error, endpoint),
    };
  }
};

export const retryApiRequest = async <T>(
  endpoint: string,
  params: Record<string, string> = {},
  retries = 3,
  delay = 1000
): Promise<ApiResult<T[]>> => {
  for (let i = 0; i < retries; i++) {
    const result = await apiRequest<T>(endpoint, params);
    
    if (result.data || (result.error && result.error.code !== 429)) {
      return result;
    }

    // If we get a rate limit error (429), wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
  }

  return {
    data: null,
    error: {
      message: `Failed after ${retries} retries`,
      code: 500,
      endpoint,
    },
  };
}; 