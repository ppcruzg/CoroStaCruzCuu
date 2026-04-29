import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Music, FileText, ArrowLeft, Loader2, Check } from 'lucide-react';
import { TipoCanto, TiempoLiturgico } from '../types';

const LITURGY_COLORS: Record<string, string> = {
  ADVIENTO: '#6B21A8',
  NAVIDAD: '#F59E0B',
  ORDINARIO: '#16A34A',
  CUARESMA: '#92400E',
  SEMANA_SANTA: '#1E3A5F',
  PASCUA: '#DC2626',
  PENTECOSTES: '#EF4444',
};

export function AdminSongForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingCatalogs, setFetchingCatalogs] = useState(true);

  // Catalogs
  const [tiposCanto, setTiposCanto] = useState<TipoCanto[]>([]);
  const [tiemposLiturgicos, setTiemposLiturgicos] = useState<TiempoLiturgico[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    url_pdf: '',
    url_audio: '',
    tipo_canto_id: '',
    notas: '',
  });

  // Multi-select: Tiempos Litúrgicos
  const [selectedTiempos, setSelectedTiempos] = useState<number[]>([]);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  async function fetchCatalogs() {
    try {
      const [tipos, tiempos] = await Promise.all([
        supabase.from('tipos_canto').select('*').order('orden'),
        supabase.from('tiempos_liturgicos').select('*').order('orden'),
      ]);
      if (tipos.data) setTiposCanto(tipos.data);
      if (tiempos.data) setTiemposLiturgicos(tiempos.data);
    } catch (err) {
      console.error('Error fetching catalogs:', err);
    } finally {
      setFetchingCatalogs(false);
    }
  }

  function toggleTiempo(id: number) {
    setSelectedTiempos(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Insert canto
      const { data: newCanto, error: cantoError } = await supabase
        .from('cantos')
        .insert([{
          titulo: formData.titulo,
          url_pdf: formData.url_pdf || null,
          url_audio: formData.url_audio || null,
          tipo_canto_id: formData.tipo_canto_id ? parseInt(formData.tipo_canto_id) : null,
          notas: formData.notas || null,
          creado_por: user?.id,
          activo: true,
        }])
        .select()
        .single();

      if (cantoError) throw cantoError;

      // 2. Insert Tiempos Litúrgicos M:N
      if (selectedTiempos.length > 0 && newCanto) {
        const tiempoRows = selectedTiempos.map(tid => ({
          canto_id: newCanto.id,
          tiempo_liturgico_id: tid,
        }));
        const { error: tiempoError } = await supabase
          .from('canto_tiempos_liturgicos')
          .insert(tiempoRows);
        if (tiempoError) throw tiempoError;
      }

      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/cantos');
      }
    } catch (err) {
      alert('Error al guardar el canto. Verifica tus permisos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCatalogs) return (
    <div className="flex items-center justify-center p-10 min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 pt-6 pb-10 rounded-b-[40px] shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-blue-100 text-sm hover:text-white transition-colors">
          <ArrowLeft size={16} /> Volver al catálogo
        </button>
        <h2 className="text-2xl font-bold">Nuevo Canto</h2>
        <p className="text-blue-100 mt-1 text-sm">Registra una nueva pieza en el repertorio litúrgico.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 -mt-4 space-y-4">

        {/* Título */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título del Canto *</label>
          <input
            required
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-800"
            placeholder="Ej: Pescador de Hombres"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          />
        </div>

        {/* Momento de la Misa */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Momento de la Misa *</label>
          <select
            required
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800"
            value={formData.tipo_canto_id}
            onChange={(e) => setFormData({ ...formData, tipo_canto_id: e.target.value })}
          >
            <option value="">Seleccionar momento...</option>
            {tiposCanto.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {/* Tiempos Litúrgicos - Multi-select con chips */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempos Litúrgicos</label>
            <p className="text-[11px] text-gray-400 mt-0.5">Selecciona en qué tiempos se usa este canto</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tiemposLiturgicos.map(t => {
              const isSelected = selectedTiempos.includes(t.id);
              const color = LITURGY_COLORS[t.codigo] || '#2563eb';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTiempo(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    isSelected ? 'text-white border-transparent shadow-md' : 'bg-gray-50 border-gray-100 text-gray-600'
                  }`}
                  style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
                >
                  {isSelected ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span className="w-3 h-3 rounded-full border-2 border-gray-300" style={{ borderColor: color }} />
                  )}
                  {t.nombre}
                </button>
              );
            })}
          </div>
          {selectedTiempos.length > 0 && (
            <p className="text-xs text-blue-600 font-semibold">
              ✓ {selectedTiempos.length} tiempo{selectedTiempos.length > 1 ? 's' : ''} seleccionado{selectedTiempos.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Recursos */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recursos</label>
          <div className="space-y-3">
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <input
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="URL del PDF (Google Drive, etc.)"
                value={formData.url_pdf}
                onChange={(e) => setFormData({ ...formData, url_pdf: e.target.value })}
              />
            </div>
            <div className="relative">
              <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="URL de Audio (YouTube, MP3, etc.)"
                value={formData.url_audio}
                onChange={(e) => setFormData({ ...formData, url_audio: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notas Internas</label>
          <textarea
            rows={3}
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Comentarios adicionales para el coro..."
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <>Guardar Canto <Save size={20} /></>
          )}
        </button>
      </form>
    </div>
  );
}
