import { useState, useEffect } from 'react';
import { Search, Music as MusicIcon, Plus, X, Filter, Check, RotateCcw, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Canto, TiempoLiturgico, TipoCanto } from '../types';
import { SongCard, SongCardTheme } from '../components/songs/SongCard';
import { Link, useSearchParams } from 'react-router-dom';

export function Songs() {
  const [songs, setSongs] = useState<Canto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiempos, setTiempos] = useState<TiempoLiturgico[]>([]);
  const [momentos, setMomentos] = useState<TipoCanto[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [globalTheme, setGlobalTheme] = useState<SongCardTheme>('default');

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') || '';
  const activeFilter = searchParams.has('filter') ? Number(searchParams.get('filter')) : null;
  const activeMomento = searchParams.has('momento') ? Number(searchParams.get('momento')) : null;

  const setSearch = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set('q', value);
      else next.delete('q');
      return next;
    }, { replace: true });
  };

  const setActiveFilter = (value: number | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value !== null) next.set('filter', value.toString());
      else next.delete('filter');
      return next;
    }, { replace: true });
  };

  const setActiveMomento = (value: number | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value !== null) next.set('momento', value.toString());
      else next.delete('momento');
      return next;
    }, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('filter');
      next.delete('momento');
      return next;
    }, { replace: true });
  };

  const clearFiltersOnly = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('filter');
      next.delete('momento');
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    fetchSongs();
    fetchTiempos();
    fetchMomentos();
  }, []);

  async function fetchTiempos() {
    const { data } = await supabase
      .from('tiempos_liturgicos')
      .select('*')
      .eq('activo', true)
      .order('orden');
    if (data) setTiempos(data);
  }

  async function fetchMomentos() {
    const { data } = await supabase
      .from('tipos_canto')
      .select('*')
      .order('orden');
    if (data) setMomentos(data);
  }

  async function fetchSongs() {
    try {
      setLoading(true);

      let query = supabase
        .from('cantos')
        .select(`
          *,
          tipo_canto:tipos_canto (id, codigo, nombre, es_obligatorio),
          canto_tiempos_liturgicos (tiempo_liturgico_id)
        `)
        .eq('activo', true)
        .order('titulo');

      const { data, error } = await query;
      if (error) throw error;
      setSongs(data || []);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.titulo.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter !== null) {
      const tiemposList = (song as any).canto_tiempos_liturgicos || [];
      if (!tiemposList.some((t: any) => t.tiempo_liturgico_id === activeFilter)) return false;
    }

    if (activeMomento !== null) {
      if (song.tipo_canto_id !== activeMomento) return false;
    }

    return true;
  });

  const liturgyColors: Record<string, string> = {
    ADVIENTO: '#6B21A8',
    NAVIDAD: '#F59E0B',
    ORDINARIO: '#16A34A',
    CUARESMA: '#92400E',
    SEMANA_SANTA: '#1E3A5F',
    PASCUA: '#DC2626',
    PENTECOSTES: '#EF4444',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sticky search bar header */}
      <div className="sticky top-[60px] z-30 bg-white border-b border-gray-100 px-4 py-3 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar canto..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`px-4 h-full rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                globalTheme !== 'default' 
                  ? 'bg-purple-50 border-purple-200 text-purple-600 ring-2 ring-purple-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
              title="Personalizar color"
            >
              <Palette size={18} />
            </button>

            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1">
                  <button onClick={() => { setGlobalTheme('default'); setShowThemeMenu(false); }} className={`px-3 py-2 text-sm font-bold text-left rounded-xl transition-colors ${globalTheme === 'default' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}>Blanco</button>
                  <button onClick={() => { setGlobalTheme('blue'); setShowThemeMenu(false); }} className={`px-3 py-2 text-sm font-bold text-left rounded-xl transition-colors ${globalTheme === 'blue' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}>Azul</button>
                  <button onClick={() => { setGlobalTheme('green'); setShowThemeMenu(false); }} className={`px-3 py-2 text-sm font-bold text-left rounded-xl transition-colors ${globalTheme === 'green' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>Verde</button>
                  <button onClick={() => { setGlobalTheme('amber'); setShowThemeMenu(false); }} className={`px-3 py-2 text-sm font-bold text-left rounded-xl transition-colors ${globalTheme === 'amber' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-amber-50 hover:text-amber-600'}`}>Ámbar</button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => setShowFilters(true)}
            className={`px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              activeFilter || activeMomento 
                ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-100' 
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Filter size={18} />
            {(activeFilter || activeMomento) && (
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Chips de filtros activos */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide empty:hidden">
           {(activeFilter || activeMomento || search) && (
             <button 
               onClick={clearAllFilters}
               className="shrink-0 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
               title="Limpiar filtros"
             >
               <RotateCcw size={16} />
             </button>
           )}
           {activeFilter && (
             <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm">
               {tiempos.find(t => t.id === activeFilter)?.nombre}
               <X size={12} className="cursor-pointer" onClick={() => setActiveFilter(null)} />
             </div>
           )}
           {activeMomento && (
             <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-sm">
               {momentos.find(m => m.id === activeMomento)?.nombre}
               <X size={12} className="cursor-pointer" onClick={() => setActiveMomento(null)} />
             </div>
           )}
        </div>
      </div>

      {/* Modal de Filtros */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header Modal */}
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
                <p className="text-xs text-gray-500 mt-0.5">Personaliza tu búsqueda</p>
              </div>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Tiempo Litúrgico */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Tiempo Litúrgico</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      activeFilter === null 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Todos {activeFilter === null && <Check size={16} />}
                  </button>
                  {tiempos.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveFilter(t.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                        activeFilter === t.id 
                          ? 'text-white shadow-lg' 
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'
                      }`}
                      style={activeFilter === t.id ? { backgroundColor: liturgyColors[t.codigo] || '#2563eb', borderColor: liturgyColors[t.codigo] } : {}}
                    >
                      <span className="truncate">{t.nombre}</span>
                      {activeFilter === t.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Momento de la Misa */}
              <div className="space-y-4 pb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Momento de la Misa</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveMomento(null)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      activeMomento === null 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Todos {activeMomento === null && <Check size={16} />}
                  </button>
                  {momentos.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMomento(m.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                        activeMomento === m.id 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:border-indigo-300'
                      }`}
                    >
                      <span className="truncate">{m.nombre}</span>
                      {activeMomento === m.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => {
                  clearFiltersOnly();
                  setShowFilters(false);
                }}
                className="flex-1 py-4 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-2xl transition-colors"
              >
                Limpiar todo
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="flex-[2] py-4 bg-gray-900 text-white font-bold text-sm rounded-2xl shadow-xl active:scale-[0.98] transition-transform"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Song count */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {filteredSongs.length} {filteredSongs.length === 1 ? 'canto' : 'cantos'}
        </span>
      </div>

      {/* Song list */}
      <div className="px-4 space-y-2 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Cargando catálogo...</p>
          </div>
        ) : filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() => {}}
              theme={globalTheme}
            />
          ))
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center mt-4">
            <MusicIcon size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-semibold">Sin resultados</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 text-blue-600 font-bold text-sm">
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        to="/admin/nuevo-canto"
        className="fixed bottom-24 right-5 bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Plus size={22} />
        <span className="text-sm font-bold pr-1">Nuevo Canto</span>
      </Link>
    </div>
  );
}
