import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sesion } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Sessions() {
  const { isAdmin } = useAuth();
  const [sessions, setSessions] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sesiones')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!newSessionName || !newSessionDate) return;

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('sesiones')
        .insert([
          {
            nombre: newSessionName,
            fecha: newSessionDate,
            publicada: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSessions([data, ...sessions]);
        setIsCreateModalOpen(false);
        setNewSessionName('');
        setNewSessionDate('');
      }
    } catch (err) {
      console.error('Error creating session:', err);
      alert('Error al crear la sesión');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Próximas Sesiones</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-medium">Cargando sesiones...</div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <Link
              key={session.id}
              to={`/sesiones/${session.id}`}
              className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Misa Dominical
                </div>
                {!session.publicada && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                    Borrador
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {session.nombre}
              </h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={16} className="text-blue-500" />
                  <span>{new Date(session.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-blue-500" />
                  <span>12:00 PM</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                <span>12 cantos seleccionados</span>
                <span className="text-blue-500 font-bold">Ver detalle →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
            <CalendarIcon size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No hay sesiones programadas</p>
            {isAdmin && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-blue-600 font-bold text-sm"
              >
                Crear primera sesión
              </button>
            )}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Nueva Sesión</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSession} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Nombre de la Sesión</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Misa de Domingo"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Fecha</label>
                <input
                  type="date"
                  required
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating || !newSessionName || !newSessionDate}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isCreating ? 'Guardando...' : 'Crear Sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
