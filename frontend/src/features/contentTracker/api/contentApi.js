import { apiRequest } from '../../../shared/api/httpClient.js';

export function listItems(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/items${suffix}`);
}

export function getItem(id) {
  return apiRequest(`/items/${id}`);
}

export function createItem(payload) {
  return apiRequest('/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateItem(id, payload) {
  return apiRequest(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteItem(id) {
  return apiRequest(`/items/${id}`, {
    method: 'DELETE',
  });
}
