import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, FileX, Music as MusicIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sesion, Canto } from '../types';

export function LiveSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Sesion | null>(null);
  const [songs, setSongs] = useState<Canto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionData();
  }, [id]);

  async function fetchSessionData() {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase
        .from('sesiones')
        .select('*')
        .eq('id', id)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

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
      
      const mappedSongs = (songsData as any[]).map(item => ({
        ...item.cantos,
        sessionNotes: item.notas
      }));
      
      setSongs(mappedSongs);
    } catch (err) {
      console.error('Error fetching live session:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session || songs.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <p className="text-xl mb-6">No hay cantos en esta sesión para proyectar.</p>
        <button onClick={() => navigate(-1)} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold">
          Volver
        </button>
      </div>
    );
  }

  const currentSong = songs[currentIndex];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    return `${url}#view=FitH`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur border-b border-gray-800 p-3 sm:p-4 flex items-center justify-between shadow-md">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          title="Salir del Modo En Vivo"
        >
          <X size={24} className="text-gray-300" />
        </button>

        <div className="text-center flex-1 px-4">
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
            Canto {currentIndex + 1} de {songs.length}
          </p>
          <p className="text-sm font-semibold text-blue-400 mt-0.5">
            {currentSong.tipo_canto?.nombre || 'General'}
          </p>
        </div>

        {currentSong.url_audio ? (
          <a 
            href={currentSong.url_audio} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 bg-gray-800 hover:bg-blue-900 hover:text-blue-400 rounded-full transition-colors"
            title="Abrir Audio"
          >
            <MusicIcon size={20} />
          </a>
        ) : (
          <div className="w-10 h-10"></div> /* spacer */
        )}
      </div>

      {/* Body: PDF Viewer */}
      <div className="flex-1 relative bg-[#333333] overflow-hidden flex flex-col">
        {currentSong.url_pdf ? (
          <>
            <div className="bg-amber-900/40 text-amber-200 text-xs text-center py-1 border-b border-amber-900/50">
              Si ves un error de acceso, asegúrate de que el PDF en Google Drive tenga permiso de "Cualquier persona con el enlace".
            </div>
            <iframe 
              src={getEmbedUrl(currentSong.url_pdf)} 
              className="w-full flex-1 border-0"
              title={`PDF de ${currentSong.titulo}`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <FileX size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium text-center px-4">Este canto no tiene PDF asignado</p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-900/95 backdrop-blur border-t border-gray-800 p-4 sm:p-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(prev => prev - 1)}
          disabled={currentIndex === 0}
          className={`flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl font-bold transition-all ${
            currentIndex === 0 
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
          }`}
        >
          <ChevronLeft size={24} /> <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex-[2] text-center px-2 truncate">
          <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
            {currentSong.titulo}
          </h2>
          {(currentSong as any).sessionNotes && (
             <p className="text-xs text-amber-400 mt-1 truncate">
               "{(currentSong as any).sessionNotes}"
             </p>
          )}
        </div>

        <button
          onClick={() => setCurrentIndex(prev => prev + 1)}
          disabled={currentIndex === songs.length - 1}
          className={`flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl font-bold transition-all ${
            currentIndex === songs.length - 1
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-900/50'
          }`}
        >
          <span className="hidden sm:inline">Siguiente</span> <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
