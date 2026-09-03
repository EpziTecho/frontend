import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button, Input, Select, ErrorBanner } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';

const INSUMO_VACIO = { nombre: '', unidad_medida: 'kg', cantidad_stock: 0 };
const UNIDADES = ['kg', 'g', 'L', 'mL', 'unidad', 'docena', 'saco', 'barra'];

export function Inventario() {
  const [tab, setTab] = useState('materia_prima');

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-2xl font-bold">Inventario</h1>

      <div className="flex gap-sm border-b border-outline-variant overflow-x-auto">
        <button
          onClick={() => setTab('materia_prima')}
          className={`px-md py-sm font-semibold border-b-2 -mb-px whitespace-nowrap shrink-0 ${tab === 'materia_prima' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'}`}
        >
          Materia Prima
        </button>
        <button
          onClick={() => setTab('producto_terminado')}
          className={`px-md py-sm font-semibold border-b-2 -mb-px whitespace-nowrap shrink-0 ${tab === 'producto_terminado' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'}`}
        >
          Producto Terminado
        </button>
      </div>

      {tab === 'materia_prima' ? <MateriaPrima /> : <ProductoTerminado />}
    </div>
  );
}

function MateriaPrima() {
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

const hoy = () => new Date().toISOString().slice(0, 10);

function sumarDias(fecha, delta) {
  const d = new Date(fecha + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function ProductoTerminado() {
  const { sesion } = useAuth();
  const [fecha, setFecha] = useState(hoy());
  const [filas, setFilas] = useState([]); // [{ producto, stock, producido_ese_dia, vendido_ese_dia }]
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);
    (async () => {
      try {
        const { productos } = await api.productos.listar(sesion.token);
        const datos = await Promise.all(
          productos.map((p) => api.productos.stock(sesion.token, p.id, fecha).then((r) => ({ producto: p, ...r })))
        );
        if (!cancelado) setFilas(datos);
      } catch (err) {
        if (!cancelado) setError(err.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => { cancelado = true; };
  }, [fecha]);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant max-w-96">
          Se calcula automáticamente: lo producido menos lo vendido. No se edita a mano.
        </p>
        <div className="flex items-center gap-xs shrink-0">
          <button onClick={() => setFecha(sumarDias(fecha, -1))} className="p-sm" aria-label="Día anterior">
            <Icon name="chevron_left" />
          </button>
          <span className="font-mono text-sm whitespace-nowrap">{fecha === hoy() ? `Hoy, ${fecha}` : fecha}</span>
          <button onClick={() => setFecha(sumarDias(fecha, 1))} className="p-sm" aria-label="Día siguiente">
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>

      <ErrorBanner error={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {filas.map(({ producto, stock, producido_ese_dia, vendido_ese_dia }) => (
          <Card key={producto.id}>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{producto.nombre}</h3>
              {stock <= 0 && (
                <span className="text-xs font-semibold uppercase bg-error-container text-on-error-container px-sm py-xs rounded-full">
                  Agotado
                </span>
              )}
            </div>

            <div className="flex gap-md mt-sm text-sm text-on-surface-variant">
              <span>Producido: <b className="text-on-surface">{producido_ese_dia}</b></span>
              <span>Vendido: <b className="text-on-surface">{vendido_ese_dia}</b></span>
            </div>

            <div className="mt-md pt-md border-t border-outline-variant">
              <p className="text-xs text-on-surface-variant uppercase font-mono">En stock</p>
              <p className="font-mono text-3xl font-bold">{stock}</p>
            </div>
          </Card>
        ))}
        {!cargando && filas.length === 0 && <p className="text-on-surface-variant">Todavía no hay productos en el catálogo.</p>}
      </div>
    </div>
  );
}
