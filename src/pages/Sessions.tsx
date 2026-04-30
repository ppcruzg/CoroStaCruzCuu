import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, X, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.descripcion?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStartDate = !startDate || session.fecha >= startDate;
    const matchesEndDate = !endDate || session.fecha <= endDate;
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="p-4 pb-24 space-y-6">
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

      {/* Filtros */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="date"
              className="w-full pl-9 pr-2 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[11px] shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="text-gray-300 text-[10px] font-bold">AL</div>
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="date"
              className="w-full pl-9 pr-2 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[11px] shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => {setStartDate(''); setEndDate('');}}
              className="p-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-xl shadow-sm transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Botones de Acceso Rápido */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setStartDate(today);
              setEndDate(today);
            }}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            HOY
          </button>
          <button
            onClick={() => {
              const now = new Date();
              const first = now.getDate() - now.getDay();
              const last = first + 6;
              const firstDay = new Date(now.setDate(first)).toISOString().split('T')[0];
              const lastDay = new Date(now.setDate(last)).toISOString().split('T')[0];
              setStartDate(firstDay);
              setEndDate(lastDay);
            }}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            ESTA SEMANA
          </button>
          <button
            onClick={() => {
              const now = new Date();
              const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
              const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
              setStartDate(firstDay);
              setEndDate(lastDay);
            }}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            ESTE MES
          </button>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-50 text-gray-600 text-[10px] font-bold border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            TODO
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-medium">Cargando sesiones...</div>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Link
              key={session.id}
              to={`/sesiones/${session.id}`}
              className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Misa Dominical
                </div>
                {!session.publicada && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    Borrador
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors truncate">
                {session.nombre}
              </h3>

              {session.descripcion && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-1 italic">
                  {session.descripcion}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon size={14} className="text-blue-500" />
                  <span>{new Date(session.fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-blue-500" />
                  <span>12:00 PM</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                <span>Sesión Activa</span>
                <span className="text-blue-500 font-bold">Ver detalle →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
            <CalendarIcon size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No se encontraron sesiones</p>
            {(searchQuery || startDate || endDate) ? (
               <button 
                 onClick={() => {setSearchQuery(''); setStartDate(''); setEndDate('');}}
                 className="mt-4 text-blue-600 font-bold text-sm"
               >
                 Limpiar filtros
               </button>
            ) : isAdmin && (
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
