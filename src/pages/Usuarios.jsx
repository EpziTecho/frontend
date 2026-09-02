import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button, Input, Select, ErrorBanner } from '../components/ui.jsx';

const VACIO = { nombre: '', email: '', telefono: '', password: '', rol: 'panadero' };

export function Usuarios() {
  const { sesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function cargar() {
    const { usuarios } = await api.usuarios.listar(sesion.token, sesion.usuario.local_id);
    setUsuarios(usuarios.filter((u) => u.rol !== 'dueno'));
  }

  useEffect(() => { cargar(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await api.usuarios.crear(sesion.token, form);
      setForm(VACIO);
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col gap-lg max-w-3xl">
      <h1 className="text-2xl font-bold">Personal</h1>

      <Card>
        <h2 className="font-semibold mb-md">Dar de alta</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Select label="Rol" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="panadero">Panadero</option>
            <option value="cajero">Cajero</option>
          </Select>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Teléfono/WhatsApp" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} required />
          <Input label="Contraseña inicial" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div className="md:col-span-2 flex flex-col gap-sm">
            <ErrorBanner error={error} />
            <Button type="submit" disabled={cargando}>{cargando ? 'Creando…' : 'Crear usuario'}</Button>
            <p className="text-xs text-on-surface-variant">
              La contraseña se le comunica por WhatsApp, fuera del sistema (F1 §6).
            </p>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-md">Equipo</h2>
        <ul className="flex flex-col gap-sm">
          {usuarios.map((u) => (
            <li key={u.id} className="flex justify-between border-b border-outline-variant py-sm last:border-0">
              <span>{u.nombre}</span>
              <span className="text-on-surface-variant text-sm capitalize">{u.rol}</span>
            </li>
          ))}
          {usuarios.length === 0 && <p className="text-on-surface-variant text-sm">Todavía no hay personal cargado.</p>}
        </ul>
      </Card>
    </div>
  );
}
