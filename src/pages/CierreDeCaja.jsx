import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { ApiError } from '../api/client.js';
import { Card, Button, Input, ErrorBanner } from '../components/ui.jsx';

const hoy = () => new Date().toISOString().slice(0, 10);

export function CierreDeCaja() {
  const { sesion } = useAuth();
  const [fecha] = useState(hoy());
  const [totalSistema, setTotalSistema] = useState(0);
  const [cierreExistente, setCierreExistente] = useState(null);
  const [form, setForm] = useState({ total_yape_contado: '', total_efectivo_contado: '', comentario: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function cargar() {
    const { ventas } = await api.ventas.listar(sesion.token, fecha);
    setTotalSistema(ventas.reduce((acc, v) => acc + Number(v.precio) * Number(v.cantidad), 0));
    try {
      const { cierre } = await api.cierres.obtener(sesion.token, fecha);
      setCierreExistente(cierre);
    } catch (err) {
      if (!(err instanceof ApiError && err.codigo === 'CIERRE_NO_ENCONTRADO')) throw err;
      setCierreExistente(null);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const { cierre } = await api.cierres.crear(sesion.token, {
        fecha,
        total_yape_contado: Number(form.total_yape_contado),
        total_efectivo_contado: Number(form.total_efectivo_contado),
        comentario: form.comentario || undefined,
      });
      setCierreExistente(cierre);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  if (cierreExistente) {
    const c = cierreExistente;
    return (
      <div className="flex flex-col gap-lg max-w-2xl">
        <h1 className="text-2xl font-bold">Cierre de Caja — {fecha}</h1>
        <Card>
          <p className="text-on-surface-variant text-sm">Este día ya está cerrado.</p>
          <div className="grid grid-cols-2 gap-md mt-md font-mono">
            <p>Sistema: <b>S/ {Number(c.total_sistema).toFixed(2)}</b></p>
            <p>Diferencia: <b className={Number(c.diferencia) === 0 ? '' : 'text-error'}>S/ {Number(c.diferencia).toFixed(2)}</b></p>
            <p>Yape contado: S/ {Number(c.total_yape_contado).toFixed(2)}</p>
            <p>Efectivo contado: S/ {Number(c.total_efectivo_contado).toFixed(2)}</p>
          </div>
          {c.comentario && <p className="mt-md text-sm italic">"{c.comentario}"</p>}
        </Card>
      </div>
    );
  }

  const diferenciaPreview = totalSistema - (Number(form.total_yape_contado || 0) + Number(form.total_efectivo_contado || 0));

  return (
    <div className="flex flex-col gap-lg max-w-2xl">
      <h1 className="text-2xl font-bold">Cierre de Caja — {fecha}</h1>

      <Card>
        <p className="text-sm text-on-surface-variant uppercase font-mono">Según el sistema</p>
        <p className="text-3xl font-bold mt-xs">S/ {totalSistema.toFixed(2)}</p>
      </Card>

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <Input label="Efectivo contado (S/)" type="number" step="0.01"
              value={form.total_efectivo_contado}
              onChange={(e) => setForm({ ...form, total_efectivo_contado: e.target.value })} required />
            <Input label="Yape contado (S/)" type="number" step="0.01"
              value={form.total_yape_contado}
              onChange={(e) => setForm({ ...form, total_yape_contado: e.target.value })} required />
          </div>

          <p className="font-mono">
            Diferencia: <b className={diferenciaPreview === 0 ? '' : 'text-error'}>S/ {diferenciaPreview.toFixed(2)}</b>
          </p>

          <label className="flex flex-col gap-xs text-sm">
            <span className="font-medium text-primary">Comentario (opcional)</span>
            <textarea
              className="rounded border-2 border-surface-dim bg-surface px-md py-sm"
              rows={2}
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            />
          </label>

          <ErrorBanner error={error} />
          <Button type="submit" disabled={cargando}>{cargando ? 'Cerrando…' : 'Cerrar día'}</Button>
        </form>
      </Card>
    </div>
  );
}
