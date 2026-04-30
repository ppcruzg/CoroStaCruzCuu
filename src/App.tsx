import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Settings, Music, Users as UsersIcon } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/layout/BottomNav';
import { Songs } from './pages/Songs';
import { Sessions } from './pages/Sessions';
import { SessionDetail } from './pages/SessionDetail';
import { LiveSession } from './pages/LiveSession';
import { AdminSongForm } from './pages/AdminSongForm';
import { EditSongForm } from './pages/EditSongForm';
import { Catalogs } from './pages/Catalogs';
import { Users } from './pages/Users';
import { Login } from './pages/Login';

const Placeholder = ({ title }: { title: string }) => {
  const { isAdmin } = useAuth();
  return (
    <div className="p-8 text-center min-h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-4 text-gray-500">Esta sección está en desarrollo.</p>
      {title === 'Mi Perfil' && isAdmin && (
        <div className="flex flex-col gap-3 mt-8">
          <Link 
            to="/admin/usuarios"
            className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <UsersIcon size={20} /> Gestionar Usuarios
          </Link>
          <Link 
            to="/admin/catalogos"
            className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Settings size={20} /> Gestionar Catálogos
          </Link>
        </div>
      )}
    </div>
  );
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/cantos" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-4 sticky top-0 z-40 shadow-lg shadow-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Music size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">CantoManager</h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-semibold transition-colors"
          >
            Salir
          </button>
        </header>

        <main className="container mx-auto max-w-lg">
          <Routes>
            <Route path="/" element={<Navigate to="/cantos" replace />} />
            <Route path="/cantos" element={<Songs />} />
            <Route path="/admin/nuevo-canto" element={<AdminRoute><AdminSongForm /></AdminRoute>} />
            <Route path="/admin/editar-canto/:id" element={<AdminRoute><EditSongForm /></AdminRoute>} />
            <Route path="/admin/catalogos" element={<AdminRoute><Catalogs /></AdminRoute>} />
            <Route path="/admin/usuarios" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/sesiones" element={<Sessions />} />
            <Route path="/sesiones/:id" element={<SessionDetail />} />
            <Route path="/sesiones/:id/live" element={<LiveSession />} />
            <Route path="/perfil" element={<Placeholder title="Mi Perfil" />} />
            <Route path="*" element={<Navigate to="/cantos" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
