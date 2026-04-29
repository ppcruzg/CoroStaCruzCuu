import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Settings, Music } from 'lucide-react';
import { supabase } from './lib/supabase';
import { BottomNav } from './components/layout/BottomNav';
import { Songs } from './pages/Songs';
import { Sessions } from './pages/Sessions';
import { SessionDetail } from './pages/SessionDetail';
import { LiveSession } from './pages/LiveSession';
import { AdminSongForm } from './pages/AdminSongForm';
import { EditSongForm } from './pages/EditSongForm';
import { Catalogs } from './pages/Catalogs';
import { Login } from './pages/Login';

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center min-h-[70vh] flex flex-col justify-center items-center">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="mt-4 text-gray-500">Esta sección está en desarrollo.</p>
    {title === 'Mi Perfil' && (
      <Link 
        to="/admin/catalogos"
        className="mt-8 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
      >
        <Settings size={20} /> Gestionar Catálogos
      </Link>
    )}
  </div>
);

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
            <Route path="/admin/nuevo-canto" element={<AdminSongForm />} />
            <Route path="/admin/editar-canto/:id" element={<EditSongForm />} />
            <Route path="/admin/catalogos" element={<Catalogs />} />
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
