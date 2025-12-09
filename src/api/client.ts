const API_BASE_URL = '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = API_BASE_URL + path;

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || res.statusText || 'Unknown API error';
    throw new ApiError(res.status, msg);
  }

  // you could add runtime validation here if you want
  return res.json() as Promise<T>;
}