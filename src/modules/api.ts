// apiClient.ts
import axios, { AxiosRequestConfig } from 'axios';
import { API_TOKEN } from './token';

export interface ApiResponse<R = any> {
  status: boolean;
  data?: R;
  error?: string;
}

/**
 * Универсальная функция для API запросов
 * @template R - тип ожидаемого результата
 */
export async function ApiRequest<R = any>(
  method: 'GET' | 'POST',
  path: string,
  params: Record<string, any> = {}
): Promise<R> {
  
  // Добавляем /api/ если его нет
  const url = path.startsWith('/api/')
    ? path
    : `/api/${path.replace(/^\/+/, '')}`;

  if(url.includes('private')){
    params.token = API_TOKEN
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'GET' && params) {
    config.params = params;
  }

  if (method === 'POST' && params) {
    config.data = params;
  }

  try {
    const res = await axios.request<ApiResponse<R>>(config);
    const data = res.data;

    if (!data.status) {
      throw new Error(data.error || 'Unknown API error');
    }

    return data.data as R;
  } catch (err: any) {
    // axios кидает ошибку при timeout / 4xx / 5xx
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }

    if (err.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    }

    throw err;
  }
}
