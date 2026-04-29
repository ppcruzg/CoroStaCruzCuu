import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Play, ListMusic, Plus, Search, X, Filter, Check, FileText, Music as MusicIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sesion, Canto, TipoCanto, TiempoLiturgico } from '../types';
import { SongCard } from '../components/songs/SongCard';

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Sesion | null>(null);
  const [songs, setSongs] = useState<Canto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Canto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tipos, setTipos] = useState<TipoCanto[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<number | null>(null);
  const [tiempos, setTiempos] = useState<TiempoLiturgico[]>([]);
  const [selectedTiempo, setSelectedTiempo] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSessionData();
    fetchTipos();
    fetchTiempos();
  }, [id]);

  async function fetchTipos() {
    const { data } = await supabase.from('tipos_canto').select('*').order('orden');
    if (data) setTipos(data);
  }

  async function fetchTiempos() {
    const { data } = await supabase.from('tiempos_liturgicos').select('*').eq('activo', true).order('orden');
    if (data) setTiempos(data);
  }

  async function fetchSessionData() {
    try {
      setLoading(true);
      
      // 1. Fetch Session Info
      const { data: sessionData, error: sessionError } = await supabase
        .from('sesiones')
        .select('*')
        .eq('id', id)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      // 2. Fetch Songs in Order (using the sesion_cantos link table)
      const { data: songsData, error: songsError } = await supabase
        .from('sesion_cantos')
        .select(`
          orden,
          notas,
          cantos (*, tipo_canto:tipos_canto (*))
        `)
        .eq('sesion_id', id)
        .order('orden');

      if (songsError) throw songsError;
      
      // Transform the joined data to a flat array of songs with their session notes
      const mappedSongs = (songsData as any[]).map(item => ({
        ...item.cantos,
        sessionNotes: item.notas,
        sessionOrden: item.orden
      }));
      
      setSongs(mappedSongs);
    } catch (err) {
      console.error('Error fetching session detail:', err);
    } finally {
      setLoading(false);
    }
  }

  async function searchCantos(query: string, tipoId: number | null, tiempoId: number | null) {
    if (!query.trim() && tipoId === null && tiempoId === null) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      let supabaseQuery = supabase
        .from('cantos')
        .select(`*, tipo_canto:tipos_canto (*), canto_tiempos_liturgicos(tiempo_liturgico_id)`)
        .eq('activo', true)
        .limit(15);

      if (query.trim()) {
        supabaseQuery = supabaseQuery.ilike('titulo', `%${query}%`);
      }
      if (tipoId !== null) {
        supabaseQuery = supabaseQuery.eq('tipo_canto_id', tipoId);
      }

      const { data, error } = await supabaseQuery;
      if (error) throw error;
      
      let results = data || [];
      if (tiempoId !== null) {
        results = results.filter(song => {
          const tiemposList = (song as any).canto_tiempos_liturgicos || [];
          return tiemposList.some((t: any) => t.tiempo_liturgico_id === tiempoId);
        });
      }
      
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching cantos:', err);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isSearchModalOpen) {
        searchCantos(searchQuery, selectedTipo, selectedTiempo);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTipo, selectedTiempo, isSearchModalOpen]);

  async function handleAddCantoToSession(canto: Canto) {
    if (songs.some(s => s.id === canto.id)) {
      alert('Este canto ya está en la sesión');
      return;
    }

    try {
      // Usar el orden del tipo_canto para asegurar el orden litúrgico (multiplicado por 10 para dejar espacio)
      let ordenBase = (canto as any).tipo_canto?.orden ? (canto as any).tipo_canto.orden * 10 : 999;
      
      // Encontrar el siguiente orden disponible para evitar error de constraint UNIQUE(sesion_id, orden)
      while (songs.some((s: any) => s.sessionOrden === ordenBase)) {
        ordenBase++;
      }
      
      const { error } = await supabase
        .from('sesion_cantos')
        .insert([{
          sesion_id: id,
          canto_id: canto.id,
          orden: ordenBase
        }]);

      if (error) {
        throw error;
      }
      
      setIsSearchModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchSessionData(); // Reload the list
    } catch (err: any) {
      console.error('Error adding canto to session:', err);
      if (err.code === '23505') {
         alert('Conflicto de orden en la base de datos, intenta de nuevo.');
      } else {
         alert('Error al agregar el canto');
      }
    }
  }

  async function handleRemoveCantoFromSession(cantoId: string) {
    if (!confirm('¿Seguro que deseas quitar este canto de la celebración?')) return;
    
    try {
      const { error } = await supabase
        .from('sesion_cantos')
        .delete()
        .eq('sesion_id', id)
        .eq('canto_id', cantoId);
        
      if (error) throw error;
      
      // Update local state smoothly
      setSongs(songs.filter(s => s.id !== cantoId));
    } catch (err) {
      console.error('Error removing canto:', err);
      alert('Error al quitar el canto');
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-400">Cargando celebración...</div>;
  if (!session) return <div className="p-10 text-center text-red-500">Sesión no encontrada</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Contextual */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-[60px] z-30 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">{session.nombre}</h2>
          <p className="text-xs text-gray-500">
            {new Date(session.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} • {songs.length} cantos
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Descripción / Notas de la sesión */}
        {session.descripcion && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 items-start">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-sm text-blue-800 italic">{session.descripcion}</p>
          </div>
        )}

        {/* Listado Ordenado de Cantos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <ListMusic size={14} /> Orden de la Celebración
            </div>
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Plus size={14} /> Añadir Canto
            </button>
          </div>
          
          <div className="space-y-3">
            {songs.map((song, index) => (
              <div key={song.id} className="relative">
                {/* Indicador de número de orden */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm z-10">
                  {index + 1}
                </div>
                
                <SongCard 
                  song={song} 
                  hideEdit={true} 
                  onRemove={() => handleRemoveCantoFromSession(song.id)}
                />
                
                {/* Nota específica del canto en esta sesión */}
                {(song as any).sessionNotes && (
                  <div className="mt-1 ml-6 pl-4 border-l-2 border-gray-200 py-1">
                    <p className="text-[11px] text-gray-500 font-medium italic">
                      "{(song as any).sessionNotes}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Modo Presentación */}
        <div className="pt-4 pb-10">
          <button 
            onClick={() => navigate(`/sesiones/${id}/live`)}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform hover:bg-gray-800"
          >
            <Play size={20} fill="currentColor" /> Iniciar Modo En Vivo
          </button>
        </div>
      </div>

      {/* Modal de Búsqueda de Cantos */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsSearchModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[85vh] sm:h-[650px] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="px-4 py-4 border-b border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar canto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    showFilters || selectedTipo || selectedTiempo
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Filter size={20} />
                </button>

                <button onClick={() => setIsSearchModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors shrink-0">
                  <X size={20} />
                </button>
              </div>

              {/* Panel de Filtros Expandible */}
              {showFilters && (
                <div className="bg-gray-50 rounded-2xl p-4 mt-2 space-y-4 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Momento de la Misa</h4>
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setSelectedTipo(null)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTipo === null ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>Todos</button>
                      {tipos.map(t => (
                        <button key={t.id} onClick={() => setSelectedTipo(t.id)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTipo === t.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                          {t.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiempo Litúrgico</h4>
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setSelectedTiempo(null)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTiempo === null ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>Todos</button>
                      {tiempos.map(t => (
                        <button key={t.id} onClick={() => setSelectedTiempo(t.id)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTiempo === t.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                          {t.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 bg-gray-50/50">
              {isSearching ? (
                <div className="text-center py-10 text-gray-400 text-sm font-medium">Buscando...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(canto => (
                  <div key={canto.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{canto.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          {canto.tipo_canto?.nombre}
                        </span>
                        {(canto as any).canto_tiempos_liturgicos?.length > 0 && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            {tiempos.find(t => t.id === (canto as any).canto_tiempos_liturgicos[0]?.tiempo_liturgico_id)?.nombre}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      {canto.url_audio && (
                        <a href={canto.url_audio} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                          <MusicIcon size={16} />
                        </a>
                      )}
                      {canto.url_pdf && (
                        <a href={canto.url_pdf} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <FileText size={16} />
                        </a>
                      )}
                      
                      <div className="w-px h-6 bg-gray-100 mx-1"></div>
                      
                      <button 
                        onClick={() => handleAddCantoToSession(canto)}
                        className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white p-2.5 rounded-xl font-bold transition-colors group-hover:scale-105 active:scale-95 shadow-sm"
                        title="Añadir a la sesión"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (searchQuery || selectedTipo || selectedTiempo) ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <Search size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No se encontraron resultados</p>
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <ListMusic size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Escribe el nombre o usa los filtros</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
