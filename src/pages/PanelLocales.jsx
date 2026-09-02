import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Button, Card, Input, ErrorBanner } from '../components/ui.jsx';

const VACIO = { nombre_local: '', nombre_dueno: '', email_dueno: '', telefono_dueno: '', password_dueno: '' };

export function PanelLocales() {
  const { sesion } = useAuth();
  const [locales, setLocales] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function cargar() {
    const { locales } = await api.locales.listar(sesion.token);
    setLocales(locales);
  }

  useEffect(() => { cargar(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await api.locales.crear(sesion.token, form);
      setForm(VACIO);
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col gap-lg max-w-4xl">
      <h1 className="text-2xl font-bold">Panel de Locales</h1>

      <Card>
        <h2 className="font-semibold mb-md">Nueva panadería</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <Input label="Nombre del local" value={form.nombre_local} onChange={(e) => setForm({ ...form, nombre_local: e.target.value })} required />
          <Input label="Nombre del dueño" value={form.nombre_dueno} onChange={(e) => setForm({ ...form, nombre_dueno: e.target.value })} required />
          <Input label="Email del dueño" type="email" value={form.email_dueno} onChange={(e) => setForm({ ...form, email_dueno: e.target.value })} required />
          <Input label="Teléfono/WhatsApp del dueño" value={form.telefono_dueno} onChange={(e) => setForm({ ...form, telefono_dueno: e.target.value })} required />
          <Input label="Contraseña inicial" type="text" value={form.password_dueno} onChange={(e) => setForm({ ...form, password_dueno: e.target.value })} required />
          <div className="md:col-span-2 flex flex-col gap-sm">
            <ErrorBanner error={error} />
            <Button type="submit" disabled={cargando}>{cargando ? 'Creando…' : 'Crear local'}</Button>
            <p className="text-xs text-on-surface-variant">
              La contraseña se le comunica al dueño por WhatsApp, fuera del sistema (F1 §6).
            </p>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-md">Locales dados de alta</h2>
        <ul className="flex flex-col gap-sm">
          {locales.map((l) => (
            <li key={l.id} className="flex justify-between border-b border-outline-variant py-sm last:border-0">
              <span>{l.nombre}</span>
              <span className="text-on-surface-variant text-sm">{l.usuarios?.[0]?.nombre}</span>
            </li>
          ))}
          {locales.length === 0 && <p className="text-on-surface-variant text-sm">Todavía no hay locales.</p>}
        </ul>
      </Card>
    </div>
  );
}
