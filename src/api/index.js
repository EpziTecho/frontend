import { apiFetch } from './client.js';

// Rutas por módulo -- ver 07. Contexto de Integracion.md §2
export const api = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: { email, password } }),

  locales: {
    listar: (token) => apiFetch('/locales', { token }),
    crear: (token, body) => apiFetch('/locales', { method: 'POST', body, token }),
  },

  usuarios: {
    listar: (token, localId) => apiFetch('/usuarios', { token, params: { local_id: localId } }),
    crear: (token, body) => apiFetch('/usuarios', { method: 'POST', body, token }),
    editar: (token, id, body) => apiFetch(`/usuarios/${id}`, { method: 'PATCH', body, token }),
  },

  insumos: {
    listar: (token, localId) => apiFetch('/insumos', { token, params: { local_id: localId } }),
    crear: (token, body, localId) => apiFetch('/insumos', { method: 'POST', body, token, params: { local_id: localId } }),
    editar: (token, id, body, localId) =>
      apiFetch(`/insumos/${id}`, { method: 'PATCH', body, token, params: { local_id: localId } }),
    registrarCompra: (token, id, body, localId) =>
      apiFetch(`/insumos/${id}/compras`, { method: 'POST', body, token, params: { local_id: localId } }),
  },

  productos: {
    listar: (token, localId) => apiFetch('/productos', { token, params: { local_id: localId } }),
    crear: (token, body, localId) => apiFetch('/productos', { method: 'POST', body, token, params: { local_id: localId } }),
    editar: (token, id, body, localId) =>
      apiFetch(`/productos/${id}`, { method: 'PATCH', body, token, params: { local_id: localId } }),
    stock: (token, id, fecha, localId) =>
      apiFetch(`/productos/${id}/stock`, { token, params: { fecha, local_id: localId } }),
  },

  produccion: {
    listar: (token, fecha, localId) => apiFetch('/produccion', { token, params: { fecha, local_id: localId } }),
    registrar: (token, body) => apiFetch('/produccion', { method: 'POST', body, token }),
  },

  ventas: {
    listar: (token, fecha, localId) => apiFetch('/ventas', { token, params: { fecha, local_id: localId } }),
    registrar: (token, formData) => apiFetch('/ventas', { method: 'POST', body: formData, token, isFormData: true }),
  },

  cierres: {
    obtener: (token, fecha) => apiFetch('/cierres', { token, params: { fecha } }),
    crear: (token, body) => apiFetch('/cierres', { method: 'POST', body, token }),
  },

  reportes: {
    contrasteMensual: (token, mes) => apiFetch('/reportes/contraste-mensual', { token, params: { mes } }),
  },
};
