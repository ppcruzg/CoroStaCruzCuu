import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Music, FileText, ArrowLeft, Loader2, Check, Trash2 } from 'lucide-react';
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

export function EditSongForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [tiposCanto, setTiposCanto] = useState<TipoCanto[]>([]);
  const [tiemposLiturgicos, setTiemposLiturgicos] = useState<TiempoLiturgico[]>([]);
  const [selectedTiempos, setSelectedTiempos] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    titulo: '',
    url_pdf: '',
    url_audio: '',
    tipo_canto_id: '',
    notas: '',
  });

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    try {
      setFetchingData(true);
      const [tipos, tiempos, canto, cantoTiempos] = await Promise.all([
        supabase.from('tipos_canto').select('*').order('orden'),
        supabase.from('tiempos_liturgicos').select('*').order('orden'),
        supabase.from('cantos').select('*').eq('id', id).single(),
        supabase.from('canto_tiempos_liturgicos').select('tiempo_liturgico_id').eq('canto_id', id),
      ]);

      if (tipos.data) setTiposCanto(tipos.data);
      if (tiempos.data) setTiemposLiturgicos(tiempos.data);

      if (canto.data) {
        setFormData({
          titulo: canto.data.titulo || '',
          url_pdf: canto.data.url_pdf || '',
          url_audio: canto.data.url_audio || '',
          tipo_canto_id: canto.data.tipo_canto_id?.toString() || '',
          notas: canto.data.notas || '',
        });
      }

      if (cantoTiempos.data) {
        setSelectedTiempos(cantoTiempos.data.map((r: any) => r.tiempo_liturgico_id));
      }
    } catch (err) {
      console.error('Error loading song:', err);
    } finally {
      setFetchingData(false);
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
      // 1. Update canto
      const { error: updateError } = await supabase
        .from('cantos')
        .update({
          titulo: formData.titulo,
          url_pdf: formData.url_pdf || null,
          url_audio: formData.url_audio || null,
          tipo_canto_id: formData.tipo_canto_id ? parseInt(formData.tipo_canto_id) : null,
          notas: formData.notas || null,
          actualizado_en: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // 2. Replace tiempos litúrgicos (delete all + reinsert)
      await supabase.from('canto_tiempos_liturgicos').delete().eq('canto_id', id);

      if (selectedTiempos.length > 0) {
        const tiempoRows = selectedTiempos.map(tid => ({
          canto_id: id,
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
      alert('Error al actualizar el canto. Verifica tus permisos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await supabase.from('cantos').update({ activo: false }).eq('id', id);
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/cantos');
      }
    } catch (err) {
      alert('Error al eliminar el canto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) return (
    <div className="flex items-center justify-center p-10 min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 text-white px-6 pt-6 pb-10 rounded-b-[40px] shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-amber-100 text-sm hover:text-white transition-colors">
          <ArrowLeft size={16} /> Volver al catálogo
        </button>
        <h2 className="text-2xl font-bold">Editar Canto</h2>
        <p className="text-amber-100 mt-1 text-sm truncate">{formData.titulo}</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 -mt-4 space-y-4">

        {/* Título */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título del Canto *</label>
          <input
            required
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all font-semibold text-gray-800"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          />
        </div>

        {/* Momento de la Misa */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Momento de la Misa *</label>
          <select
            required
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-gray-800"
            value={formData.tipo_canto_id}
            onChange={(e) => setFormData({ ...formData, tipo_canto_id: e.target.value })}
          >
            <option value="">Seleccionar momento...</option>
            {tiposCanto.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {/* Tiempos Litúrgicos */}
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
                    <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: color }} />
                  )}
                  {t.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recursos */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recursos</label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
            <input
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
              placeholder="URL del PDF"
              value={formData.url_pdf}
              onChange={(e) => setFormData({ ...formData, url_pdf: e.target.value })}
            />
          </div>
          <div className="relative">
            <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
              placeholder="URL de Audio"
              value={formData.url_audio}
              onChange={(e) => setFormData({ ...formData, url_audio: e.target.value })}
            />
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notas Internas</label>
          <textarea
            rows={3}
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-amber-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : <><Save size={20} /> Guardar Cambios</>}
        </button>

        {/* Delete */}
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full border-2 border-red-100 text-red-400 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-red-50 active:scale-[0.98]"
          >
            <Trash2 size={18} /> Desactivar Canto
          </button>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-3">
            <p className="text-red-600 font-semibold text-sm text-center">¿Confirmas que quieres desactivar este canto?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm">
                Cancelar
              </button>
              <button type="button" onClick={handleDelete} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-60">
                Sí, desactivar
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
