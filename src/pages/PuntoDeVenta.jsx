import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button, ErrorBanner } from '../components/ui.jsx';

export function PuntoDeVenta() {
  const { sesion } = useAuth();
  const [productos, setProductos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null); // producto elegido para vender
  const [cantidad, setCantidad] = useState(1);
  const [medioPago, setMedioPago] = useState('efectivo');
  const [evidencia, setEvidencia] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [registradasHoy, setRegistradasHoy] = useState([]); // solo de esta sesión, el cajero no tiene permiso de ver el historial

  useEffect(() => {
    api.productos.listar(sesion.token).then((d) => setProductos(d.productos));
  }, []);

  function elegirProducto(producto) {
    setSeleccionado(producto);
    setCantidad(1);
    setMedioPago('efectivo');
    setEvidencia(null);
    setError(null);
  }

  async function confirmarVenta() {
    if (medioPago === 'yape' && !evidencia) {
      setError('Falta la foto del comprobante de Yape');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('producto_id', seleccionado.id);
      formData.append('cantidad', cantidad);
      formData.append('medio_pago', medioPago);
      if (evidencia) formData.append('evidencia', evidencia);

      await api.ventas.registrar(sesion.token, formData);
      setRegistradasHoy([{ producto: seleccionado.nombre, cantidad, medioPago }, ...registradasHoy]);
      setSeleccionado(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-lg">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold mb-md">Punto de Venta</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-sm">
          {productos.map((p) => (
            <button
              key={p.id}
              onClick={() => elegirProducto(p)}
              className={`text-left p-md rounded-lg border-2 min-h-[100px] ${
                seleccionado?.id === p.id ? 'border-secondary bg-secondary/10' : 'border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <p className="font-semibold">{p.nombre}</p>
              <p className="text-secondary font-mono text-lg">S/ {Number(p.precio).toFixed(2)}</p>
            </button>
          ))}
        </div>

        {registradasHoy.length > 0 && (
          <div className="mt-lg">
            <h2 className="font-semibold mb-sm">Registradas en esta sesión</h2>
            <ul className="flex flex-col gap-xs text-sm">
              {registradasHoy.map((v, i) => (
                <li key={i} className="flex justify-between text-on-surface-variant">
                  <span>{v.cantidad} × {v.producto}</span>
                  <span className="uppercase font-mono text-xs">{v.medioPago}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {seleccionado && (
        <Card className="w-full lg:w-80 shrink-0 flex flex-col gap-md h-fit">
          <h2 className="font-semibold">{seleccionado.nombre}</h2>

          <label className="flex flex-col gap-xs text-sm">
            <span className="font-medium text-primary">Cantidad</span>
            <input type="number" min="1" value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="min-h-[48px] rounded border-2 border-surface-dim bg-surface px-md text-2xl text-center" />
          </label>

          <div className="flex gap-sm">
            <button
              onClick={() => setMedioPago('efectivo')}
              className={`flex-1 min-h-[56px] rounded border-2 font-semibold ${medioPago === 'efectivo' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setMedioPago('yape')}
              className={`flex-1 min-h-[56px] rounded border-2 font-semibold ${medioPago === 'yape' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}`}
            >
              Yape
            </button>
          </div>

          {medioPago === 'yape' && (
            <label className="flex flex-col gap-xs text-sm">
              <span className="font-medium text-primary">Foto del comprobante</span>
              <input type="file" accept="image/*" capture="environment"
                onChange={(e) => setEvidencia(e.target.files[0])} />
            </label>
          )}

          <p className="text-2xl font-bold text-right">
            Total: S/ {(Number(seleccionado.precio) * Number(cantidad || 0)).toFixed(2)}
          </p>

          <ErrorBanner error={error} />

          <Button onClick={confirmarVenta} disabled={cargando}>
            {cargando ? 'Confirmando…' : 'Confirmar venta'}
          </Button>
        </Card>
      )}
    </div>
  );
}
