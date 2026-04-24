const BASE_URL = import.meta.env.VITE_API_URL;

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_CLIENT_KEY}`,
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  schema: { parse: (data: unknown) => T },
  options: RequestInit = {},
): Promise<T> {
  const url = BASE_URL + endpoint;

  const headers = new Headers(defaultHeaders);

  if (options.headers) {
    const customHeaders = new Headers(options.headers);

    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const status = response.status;

    let message = "Request failed";

    if (status === 400) {
      message = json?.error || "Bad Request";
    } else if (status === 401 || status === 403) {
      message = json?.message || "Unauthorized";
    } else if (status >= 500) {
      message = "Internal Server Error";
    }

    throw new ApiError(message, status, json);
  }

  return schema.parse(json);
}
