import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/index.js';

const AuthContext = createContext(null);

function cargarSesion() {
  try {
    const raw = localStorage.getItem('sesion');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(cargarSesion);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    const nuevaSesion = { token: data.token, usuario: data.usuario };
    localStorage.setItem('sesion', JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
    return nuevaSesion;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sesion');
    setSesion(null);
  }, []);

  return (
    <AuthContext.Provider value={{ sesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
