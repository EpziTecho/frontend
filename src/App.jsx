import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';

import { Login } from './pages/Login.jsx';
import { PanelLocales } from './pages/PanelLocales.jsx';
import { DashboardDueno } from './pages/DashboardDueno.jsx';
import { Inventario } from './pages/Inventario.jsx';
import { Produccion } from './pages/Produccion.jsx';
import { PuntoDeVenta } from './pages/PuntoDeVenta.jsx';
import { CierreDeCaja } from './pages/CierreDeCaja.jsx';
import { Usuarios } from './pages/Usuarios.jsx';
import { ReporteMensual } from './pages/ReporteMensual.jsx';
import { Contacto } from './pages/Contacto.jsx';

// La pantalla de inicio ("/") depende del rol -- cada uno tiene su propia
// vista principal (02. Analisis del Negocio.md §7).
function Inicio() {
  const { sesion } = useAuth();
  switch (sesion.usuario.rol) {
    case 'superadmin': return <Navigate to="/locales" replace />;
    case 'dueno': return <DashboardDueno />;
    case 'panadero': return <Produccion />;
    case 'cajero': return <PuntoDeVenta />;
    default: return null;
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Inicio />} />
        <Route path="/locales" element={<ProtectedRoute roles={['superadmin']}><PanelLocales /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute roles={['dueno', 'panadero']}><Inventario /></ProtectedRoute>} />
        <Route path="/produccion" element={<ProtectedRoute roles={['dueno', 'panadero']}><Produccion /></ProtectedRoute>} />
        <Route path="/ventas" element={<ProtectedRoute roles={['dueno', 'cajero']}><PuntoDeVenta /></ProtectedRoute>} />
        <Route path="/cierre-caja" element={<ProtectedRoute roles={['dueno']}><CierreDeCaja /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute roles={['dueno']}><Usuarios /></ProtectedRoute>} />
        <Route path="/reporte-mensual" element={<ProtectedRoute roles={['dueno']}><ReporteMensual /></ProtectedRoute>} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
