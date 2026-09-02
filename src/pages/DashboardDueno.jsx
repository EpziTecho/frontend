import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../api/index.js';
import { Card, Button } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';

const hoy = () => new Date().toISOString().slice(0, 10);

export function DashboardDueno() {
  const { sesion } = useAuth();
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    api.ventas.listar(sesion.token, hoy()).then((d) => setVentas(d.ventas));
  }, []);

  const totalHoy = ventas.reduce((acc, v) => acc + Number(v.precio) * Number(v.cantidad), 0);

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-on-surface-variant">Resumen de hoy, {hoy()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card>
          <p className="text-sm text-on-surface-variant uppercase font-mono">Vendido hoy</p>
          <p className="text-4xl font-bold mt-xs">S/ {totalHoy.toFixed(2)}</p>
        </Card>
        <Card className="flex flex-col justify-center gap-sm">
          <Link to="/cierre-caja">
            <Button className="w-full">
              <Icon name="lock" /> Cerrar caja del día
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
