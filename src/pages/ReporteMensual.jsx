import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card } from '../components/ui.jsx';

const mesActual = () => new Date().toISOString().slice(0, 7);

export function ReporteMensual() {
  const { sesion } = useAuth();
  const [mes, setMes] = useState(mesActual());
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    api.reportes.contrasteMensual(sesion.token, mes).then(setReporte);
  }, [mes]);

  const datos = reporte
    ? [{ nombre: mes, Venta: reporte.venta_total, Insumos: reporte.gasto_insumos }]
    : [];

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
        <h1 className="text-2xl font-bold">Reporte Mensual</h1>
        <input type="month" value={mes} onChange={(e) => setMes(e.target.value)}
          className="min-h-[48px] rounded border-2 border-surface-dim bg-surface px-md w-full sm:w-auto" />
      </div>

      {reporte && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <Card>
              <p className="text-sm text-on-surface-variant uppercase font-mono">Venta del mes</p>
              <p className="text-3xl font-bold mt-xs">S/ {reporte.venta_total.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-sm text-on-surface-variant uppercase font-mono">Gasto en insumos</p>
              <p className="text-3xl font-bold mt-xs text-error">S/ {reporte.gasto_insumos.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-sm text-on-surface-variant uppercase font-mono">Contraste (ganancia)</p>
              <p className={`text-3xl font-bold mt-xs ${reporte.contraste >= 0 ? 'text-secondary' : 'text-error'}`}>
                S/ {reporte.contraste.toFixed(2)}
              </p>
            </Card>
          </div>

          <Card>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Venta" fill="var(--color-tertiary)" />
                <Bar dataKey="Insumos" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
