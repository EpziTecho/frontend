import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Icon } from './Icon.jsx';

const NAV_POR_ROL = {
  superadmin: [{ to: '/locales', label: 'Locales', icon: 'storefront' }],
  dueno: [
    { to: '/', label: 'Dashboard', icon: 'grid_view', end: true },
    { to: '/inventario', label: 'Inventario', icon: 'inventory_2' },
    { to: '/produccion', label: 'Producción', icon: 'skillet' },
    { to: '/ventas', label: 'Ventas', icon: 'point_of_sale' },
    { to: '/cierre-caja', label: 'Cierre de Caja', icon: 'lock' },
    { to: '/usuarios', label: 'Personal', icon: 'group' },
    { to: '/reporte-mensual', label: 'Reporte Mensual', icon: 'monitoring' },
  ],
  panadero: [
    { to: '/', label: 'Producción', icon: 'skillet', end: true },
    { to: '/inventario', label: 'Inventario', icon: 'inventory_2' },
  ],
  cajero: [{ to: '/', label: 'Punto de Venta', icon: 'point_of_sale', end: true }],
};

function NavItems({ items, onNavigate }) {
  return (
    <nav className="flex flex-col gap-xs p-md md:p-md">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-sm px-md py-sm rounded whitespace-nowrap ${
              isActive ? 'bg-secondary/10 text-secondary font-semibold' : 'text-on-surface-variant hover:bg-surface-container'
            }`
          }
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function Layout() {
  const { sesion, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const items = NAV_POR_ROL[sesion.usuario.rol] ?? [];

  return (
    <div className="min-h-screen md:flex">
      {/* Barra superior -- solo mobile/tablet */}
      <header className="md:hidden flex items-center justify-between p-sm bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-20">
        <button onClick={() => setMenuAbierto(true)} className="p-sm" aria-label="Abrir menú">
          <Icon name="menu" />
        </button>
        <h1 className="font-bold text-lg text-secondary">Panadería</h1>
        <div className="w-10" />
      </header>

      {/* Sidebar fija -- solo desktop */}
      <aside className="hidden md:flex md:w-72 shrink-0 bg-surface-container-lowest border-r border-outline-variant flex-col">
        <div className="p-md">
          <h1 className="font-bold text-2xl text-secondary">Panadería</h1>
          <p className="text-sm text-on-surface-variant">{sesion.usuario.nombre}</p>
        </div>
        <div className="flex-1">
          <NavItems items={items} />
        </div>
        <button onClick={logout} className="flex items-center gap-sm px-md py-md text-on-surface-variant hover:text-error">
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </aside>

      {/* Panel deslizable -- solo mobile/tablet */}
      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-on-surface/40" onClick={() => setMenuAbierto(false)} />
          <div className="relative w-72 max-w-[80vw] bg-surface-container-lowest h-full flex flex-col">
            <div className="p-md flex items-center justify-between border-b border-outline-variant">
              <div>
                <h1 className="font-bold text-xl text-secondary">Panadería</h1>
                <p className="text-sm text-on-surface-variant">{sesion.usuario.nombre}</p>
              </div>
              <button onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú">
                <Icon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavItems items={items} onNavigate={() => setMenuAbierto(false)} />
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-sm px-md py-md text-on-surface-variant hover:text-error border-t border-outline-variant"
            >
              <Icon name="logout" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 p-md md:p-lg bg-surface-container-low min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
