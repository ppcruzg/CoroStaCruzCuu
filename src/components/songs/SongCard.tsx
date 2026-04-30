import { FileText, Music as MusicIcon, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canto } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export type SongCardTheme = 'default' | 'blue' | 'green' | 'amber';

interface SongCardProps {
  song: Canto;
  onClick?: () => void;
  theme?: SongCardTheme;
  hideEdit?: boolean;
  onRemove?: () => void;
}

const themeClasses: Record<SongCardTheme, string> = {
  default: 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md',
  blue: 'bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:shadow-md',
  green: 'bg-green-50/50 border-green-100 hover:border-green-300 hover:shadow-md',
  amber: 'bg-amber-50/50 border-amber-100 hover:border-amber-300 hover:shadow-md',
};

export function SongCard({ song, onClick, theme = 'default', hideEdit = false, onRemove }: SongCardProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const currentThemeClasses = themeClasses[theme];

  return (
    <div
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl shadow-sm border flex items-center justify-between transition-all group ${currentThemeClasses}`}
    >
      {/* Title + Momento */}
      <div className="flex-1 min-w-0 pr-3">
        <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
          {song.titulo}
        </h3>
        {song.tipo_canto && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wide leading-none">
            {song.tipo_canto.nombre}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* PDF */}
        <a
          href={song.url_pdf || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Ver PDF"
          className={`p-1.5 rounded-xl transition-colors ${
            song.url_pdf
              ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
              : 'text-gray-200 pointer-events-none'
          }`}
        >
          <FileText size={18} />
        </a>

        {/* Audio */}
        <a
          href={song.url_audio || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Escuchar Audio"
          className={`p-1.5 rounded-xl transition-colors ${
            song.url_audio
              ? 'text-blue-400 hover:bg-blue-50 hover:text-blue-600'
              : 'text-gray-200 pointer-events-none'
          }`}
        >
          <MusicIcon size={18} />
        </a>

        {/* Edit */}
        {(!hideEdit && isAdmin) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/editar-canto/${song.id}`);
            }}
            title="Editar canto"
            className="p-1.5 rounded-xl text-gray-300 hover:bg-amber-50 hover:text-amber-500 transition-colors"
          >
            <Pencil size={16} />
          </button>
        )}
        {/* Remove */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Quitar de la sesión"
            className="p-1.5 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
