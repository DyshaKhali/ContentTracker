const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8080/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getErrorMessage(response) {
  try {
    const data = await response.json();
    return data.error ?? 'Не удалось выполнить запрос';
  } catch {
    return 'Не удалось выполнить запрос';
  }
}
