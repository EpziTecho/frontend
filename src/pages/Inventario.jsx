import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button, Input, Select, ErrorBanner } from '../components/ui.jsx';

const INSUMO_VACIO = { nombre: '', unidad_medida: 'kg', cantidad_stock: 0 };
const UNIDADES = ['kg', 'g', 'L', 'mL', 'unidad', 'docena', 'saco', 'barra'];

export function Inventario() {
  const { sesion } = useAuth();
  const [insumos, setInsumos] = useState([]);
  const [nuevo, setNuevo] = useState(INSUMO_VACIO);
  const [compra, setCompra] = useState({}); // { [insumoId]: { cantidad, costo } }
  const [error, setError] = useState(null);

  async function cargar() {
    const { insumos } = await api.insumos.listar(sesion.token);
    setInsumos(insumos);
  }

  useEffect(() => { cargar(); }, []);

  async function crearInsumo(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.insumos.crear(sesion.token, nuevo);
      setNuevo(INSUMO_VACIO);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function registrarCompra(insumoId) {
    setError(null);
    const datos = compra[insumoId];
    if (!datos?.cantidad || !datos?.costo) return;
    try {
      await api.insumos.registrarCompra(sesion.token, insumoId, datos);
      setCompra({ ...compra, [insumoId]: {} });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function corregirStock(insumoId, cantidad_stock) {
    setError(null);
    try {
      await api.insumos.editar(sesion.token, insumoId, { cantidad_stock });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-2xl font-bold">Inventario de materia prima</h1>
      <ErrorBanner error={error} />

      <Card>
        <h2 className="font-semibold mb-md">Nuevo insumo</h2>
        <form onSubmit={crearInsumo} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm md:items-end">
          <Input label="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} required />
          <Select label="Unidad" value={nuevo.unidad_medida} onChange={(e) => setNuevo({ ...nuevo, unidad_medida: e.target.value })}>
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </Select>
          <Input label="Stock inicial" type="number" step="0.01" value={nuevo.cantidad_stock}
            onChange={(e) => setNuevo({ ...nuevo, cantidad_stock: e.target.value })} />
          <Button type="submit">Agregar</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {insumos.map((i) => (
          <Card key={i.id}>
            <div className="flex justify-between items-baseline">
              <h3 className="font-semibold text-lg">{i.nombre}</h3>
              <span className="font-mono text-xl">{Number(i.cantidad_stock)} {i.unidad_medida}</span>
            </div>

            <div className="mt-md flex flex-col gap-sm">
              <p className="text-xs text-on-surface-variant uppercase font-mono">Registrar compra</p>
              <div className="flex gap-sm">
                <input type="number" step="0.01" placeholder="Cant."
                  className="min-h-[40px] min-w-0 flex-1 rounded border-2 border-surface-dim bg-surface px-sm"
                  value={compra[i.id]?.cantidad ?? ''}
                  onChange={(e) => setCompra({ ...compra, [i.id]: { ...compra[i.id], cantidad: e.target.value } })} />
                <input type="number" step="0.01" placeholder="S/"
                  className="min-h-[40px] min-w-0 flex-1 rounded border-2 border-surface-dim bg-surface px-sm"
                  value={compra[i.id]?.costo ?? ''}
                  onChange={(e) => setCompra({ ...compra, [i.id]: { ...compra[i.id], costo: e.target.value } })} />
                <Button variant="secondary" className="shrink-0 px-sm" onClick={() => registrarCompra(i.id)}>+</Button>
              </div>

              <button
                className="text-left text-xs text-secondary hover:underline mt-xs"
                onClick={() => {
                  const valor = prompt(`Corregir stock de ${i.nombre} (recuento manual):`, i.cantidad_stock);
                  if (valor !== null) corregirStock(i.id, Number(valor));
                }}
              >
                Corregir stock (recuento)
              </button>
            </div>
          </Card>
        ))}
        {insumos.length === 0 && <p className="text-on-surface-variant">Todavía no hay insumos cargados.</p>}
      </div>
    </div>
  );
}
