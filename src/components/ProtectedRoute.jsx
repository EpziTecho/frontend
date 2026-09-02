import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export function ProtectedRoute({ roles, children }) {
  const { sesion } = useAuth();
  if (!sesion) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(sesion.usuario.rol)) return <Navigate to="/" replace />;
  return children;
}
