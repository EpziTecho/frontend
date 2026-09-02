// Cliente HTTP simple sobre fetch -- ver 06. Arquitectura Tecnica.md §7
// (sin React Query/SWR, no hace falta para el volumen de datos de V1).
const BASE_URL = '/api';

export class ApiError extends Error {
  constructor(codigo, mensaje, status) {
    super(mensaje);
    this.codigo = codigo;
    this.status = status;
  }
}

export async function apiFetch(path, { method = 'GET', body, token, isFormData = false, params } = {}) {
  const url = new URL(BASE_URL + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
  }

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = body;
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(url.pathname + url.search, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data?.error?.codigo ?? 'ERROR_DESCONOCIDO',
      data?.error?.mensaje ?? 'Ocurrió un error inesperado',
      res.status
    );
  }
  return data;
}
