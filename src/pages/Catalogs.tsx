import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Plus, Save, Trash2, ArrowLeft, Loader2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CatalogType = 'tiempos_liturgicos' | 'tipos_canto' | 'usos_canto' | 'tipos_celebracion';

interface CatalogItem {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  color?: string;
}

export function Catalogs() {
  const navigate = useNavigate();
  const [activeCatalog, setActiveCatalog] = useState<CatalogType>('tiempos_liturgicos');
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const catalogs = [
    { id: 'tiempos_liturgicos', label: 'Tiempos Litúrgicos' },
    { id: 'tipos_canto', label: 'Momentos de Misa' },
    { id: 'usos_canto', label: 'Usos Adicionales' },
    { id: 'tipos_celebracion', label: 'Tipos de Celebración' },
  ];

  useEffect(() => {
    fetchItems();
  }, [activeCatalog]);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(activeCatalog)
        .select('*')
        .order('orden');
      
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(item: CatalogItem) {
    const { error } = await supabase
      .from(activeCatalog)
      .update({ activo: !item.activo })
      .eq('id', item.id);
    
    if (!error) fetchItems();
  }

  async function handleAddItem() {
    const nombre = prompt('Nombre del nuevo ítem:');
    if (!nombre) return;
    
    const codigo = nombre.toUpperCase().replace(/\s+/g, '_').substring(0, 10);
    
    const { error } = await supabase
      .from(activeCatalog)
      .insert([{ nombre, codigo, activo: true, orden: items.length + 1 }]);
    
    if (!error) fetchItems();
  }

  async function handleSaveEdit(id: number) {
    if (!editValue) return;
    
    const { error } = await supabase
      .from(activeCatalog)
      .update({ nombre: editValue })
      .eq('id', id);
    
    if (!error) {
      setEditingId(null);
      fetchItems();
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 flex items-center gap-4 sticky top-[60px] z-30">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de Catálogos</h2>
          <p className="text-xs text-gray-500">Configura las opciones del sistema</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Selector de Catálogo */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {catalogs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCatalog(cat.id as CatalogType)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 ${
                activeCatalog === cat.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Listado de Ítems */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registros</span>
            <button 
              onClick={handleAddItem}
              className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-10 text-center"><Loader2 className="animate-spin inline text-blue-500" /></div>
            ) : items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between group hover:bg-blue-50/30 transition-colors">
                <div className="flex-1 mr-4">
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 border border-blue-300 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(item.id)} className="text-green-600"><Check size={20} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-500"><X size={20} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-2 h-2 rounded-full ${item.activo ? 'bg-green-500' : 'bg-gray-300'}`}
                        title={item.activo ? 'Activo' : 'Inactivo'}
                      />
                      <span 
                        className={`font-semibold cursor-pointer ${!item.activo && 'text-gray-400 line-through'}`}
                        onClick={() => {
                          setEditingId(item.id);
                          setEditValue(item.nombre);
                        }}
                      >
                        {item.nombre}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">[{item.codigo}]</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {item.color && (
                    <div 
                      className="w-5 h-5 rounded-md border border-gray-200" 
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  <button 
                    onClick={() => handleToggleStatus(item)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                      item.activo ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-500 hover:bg-green-100'
                    }`}
                  >
                    {item.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
