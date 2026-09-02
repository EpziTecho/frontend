import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Button, Input, ErrorBanner, MarcaEpziTech } from '../components/ui.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-md">
      <div className="w-full max-w-96">
        <div className="text-center mb-lg">
          <h1 className="text-4xl font-bold text-secondary">Panadería</h1>
          <p className="text-on-surface-variant mt-xs">Sistema de gestión</p>
        </div>
        <form onSubmit={onSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col gap-md">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <ErrorBanner error={error} />
          <Button type="submit" disabled={cargando}>{cargando ? 'Ingresando…' : 'Ingresar'}</Button>
        </form>
        <MarcaEpziTech className="mt-lg" />
      </div>
    </div>
  );
}
