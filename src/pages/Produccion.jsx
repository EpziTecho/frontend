import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button, Input, Select, ErrorBanner } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';

const hoy = () => new Date().toISOString().slice(0, 10);

export function Produccion() {
  const { sesion } = useAuth();
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [produccionHoy, setProduccionHoy] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '' });
  const [form, setForm] = useState({ producto_id: '', cantidad_producida: '' });
  const [insumosUsados, setInsumosUsados] = useState([{ insumo_id: '', cantidad: '' }]);
  const [error, setError] = useState(null);

  async function cargarTodo() {
    const [p, i, prod] = await Promise.all([
      api.productos.listar(sesion.token),
      api.insumos.listar(sesion.token),
      api.produccion.listar(sesion.token, hoy()),
    ]);
    setProductos(p.productos);
    setInsumos(i.insumos);
    setProduccionHoy(prod.produccion);
  }

  useEffect(() => { cargarTodo(); }, []);

  async function crearProducto(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.productos.crear(sesion.token, { nombre: nuevoProducto.nombre, precio: Number(nuevoProducto.precio) });
      setNuevoProducto({ nombre: '', precio: '' });
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  function actualizarInsumoUsado(idx, campo, valor) {
    const copia = [...insumosUsados];
    copia[idx] = { ...copia[idx], [campo]: valor };
    setInsumosUsados(copia);
  }

  async function registrarProduccion(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.produccion.registrar(sesion.token, {
        producto_id: form.producto_id,
        cantidad_producida: Number(form.cantidad_producida),
        insumos_usados: insumosUsados
          .filter((i) => i.insumo_id && i.cantidad)
          .map((i) => ({ insumo_id: i.insumo_id, cantidad: Number(i.cantidad) })),
      });
      setForm({ producto_id: '', cantidad_producida: '' });
      setInsumosUsados([{ insumo_id: '', cantidad: '' }]);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-2xl font-bold">Producción</h1>
      <ErrorBanner error={error} />

      <Card>
        <h2 className="font-semibold mb-md">Catálogo de productos</h2>
        <form onSubmit={crearProducto} className="grid grid-cols-1 sm:grid-cols-3 gap-sm sm:items-end mb-md">
          <Input label="Nombre del producto" value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} required />
          <Input label="Precio (S/)" type="number" step="0.01" value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} required />
          <Button type="submit">Agregar</Button>
        </form>
        <ul className="flex flex-wrap gap-sm">
          {productos.map((p) => (
            <li key={p.id} className="bg-surface-container px-sm py-xs rounded text-sm">
              {p.nombre} — S/ {Number(p.precio).toFixed(2)}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold mb-md">Registrar producción de hoy</h2>
        <form onSubmit={registrarProduccion} className="flex flex-col gap-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <Select label="Producto" value={form.producto_id}
              onChange={(e) => setForm({ ...form, producto_id: e.target.value })} required>
              <option value="">Elegir…</option>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </Select>
            <Input label="Cantidad producida" type="number" value={form.cantidad_producida}
              onChange={(e) => setForm({ ...form, cantidad_producida: e.target.value })} required />
          </div>

          <div>
            <p className="font-medium text-primary text-sm mb-xs">Insumos usados</p>
            <div className="flex flex-col gap-sm">
              {insumosUsados.map((fila, idx) => (
                <div key={idx} className="flex gap-sm items-center">
                  <select
                    className="min-h-[48px] w-full min-w-0 rounded border-2 border-surface-dim bg-surface px-sm sm:px-md flex-1"
                    value={fila.insumo_id}
                    onChange={(e) => actualizarInsumoUsado(idx, 'insumo_id', e.target.value)}
                  >
                    <option value="">Elegir insumo…</option>
                    {insumos.map((i) => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>)}
                  </select>
                  <input type="number" step="0.01" placeholder="Cant."
                    className="min-h-[48px] rounded border-2 border-surface-dim bg-surface px-sm w-16 sm:w-24 shrink-0"
                    value={fila.cantidad}
                    onChange={(e) => actualizarInsumoUsado(idx, 'cantidad', e.target.value)} />
                  <button type="button" className="text-error shrink-0"
                    onClick={() => setInsumosUsados(insumosUsados.filter((_, i) => i !== idx))}>
                    <Icon name="close" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="text-secondary text-sm mt-sm flex items-center gap-xs"
              onClick={() => setInsumosUsados([...insumosUsados, { insumo_id: '', cantidad: '' }])}>
              <Icon name="add" /> Agregar insumo
            </button>
          </div>

          <Button type="submit" className="self-start">Confirmar producción</Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-md">Producción de hoy</h2>
        <ul className="flex flex-col gap-xs">
          {produccionHoy.map((p) => (
            <li key={p.id} className="flex justify-between border-b border-outline-variant py-xs last:border-0">
              <span>{p.productos?.nombre}</span>
              <span className="font-mono">{p.cantidad_producida}</span>
            </li>
          ))}
          {produccionHoy.length === 0 && <p className="text-on-surface-variant text-sm">Sin producción registrada hoy.</p>}
        </ul>
      </Card>
    </div>
  );
}
