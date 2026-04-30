import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Perfil, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users as UsersIcon, Shield, ShieldAlert, CheckCircle2, XCircle, Search, Loader2, Plus, X, Mail, Lock, User, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

export function Users() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [users, setUsers] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Perfil | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('nombre');

      if (error) throw error;
      let profiles = data || [];

      // Usamos el RPC seguro para obtener los correos sin necesidad del Service Role
      const { data: authData, error: rpcError } = await supabase.rpc('admin_list_users');
      
      if (!rpcError && authData) {
        profiles = profiles.map(p => {
          const authUser = authData.find((u: any) => u.user_id === p.id);
          return { ...p, email: authUser?.user_email };
        });
      }

      setUsers(profiles);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRole(targetUserId: string, currentRole: UserRole) {
    if (targetUserId === session?.user.id) {
      alert('No puedes cambiar tu propio rol.');
      return;
    }

    try {
      setProcessingId(targetUserId);
      const newRole: UserRole = currentRole === 'admin' ? 'basico' : 'admin';
      
      const { error } = await supabase
        .from('perfiles')
        .update({ rol: newRole })
        .eq('id', targetUserId);

      if (error) throw error;

      setUsers(users.map(u => u.id === targetUserId ? { ...u, rol: newRole } : u));
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error al actualizar el rol del usuario.');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleToggleStatus(targetUserId: string, isCurrentlyActive: boolean) {
    if (targetUserId === session?.user.id) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }

    try {
      setProcessingId(targetUserId);
      const { error } = await supabase
        .from('perfiles')
        .update({ activo: !isCurrentlyActive })
        .eq('id', targetUserId);

      if (error) throw error;

      setUsers(users.map(u => u.id === targetUserId ? { ...u, activo: !isCurrentlyActive } : u));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error al actualizar el estado del usuario.');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    try {
      setIsCreating(true);
      
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: { persistSession: false, autoRefreshToken: false }
        }
      );

      const { data, error } = await tempClient.auth.signUp({
        email: newUserEmail.trim(),
        password: newUserPassword,
        options: {
          data: {
            nombre: newUserName,
          }
        }
      });

      if (error) throw error;

      setIsCreateModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      
      fetchUsers();
      
      alert('Usuario creado exitosamente con rol básico.');
    } catch (err: any) {
      console.error('Error creating user:', err);
      alert('Error al crear usuario: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  }

  function openEditModal(user: Perfil) {
    setEditingUser(user);
    setEditUserName(user.nombre);
    setEditUserEmail(user.email || '');
    setEditUserPassword('');
    setIsEditModalOpen(true);
  }

  async function handleEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser || !editUserName || !editUserEmail) return;

    try {
      setIsEditing(true);
      
      // Update Name in perfiles
      const { error: profileError } = await supabase
        .from('perfiles')
        .update({ nombre: editUserName })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update Email and/or Password if provided using RPC
      if (editUserPassword || (editUserEmail.trim() && editUserEmail.trim() !== editingUser.email)) {
        const { error: authUpdateError } = await supabase.rpc('admin_update_user', {
          target_user_id: editingUser.id,
          new_email: editUserEmail.trim() !== editingUser.email ? editUserEmail.trim() : null,
          new_password: editUserPassword || null
        });

        if (authUpdateError) throw authUpdateError;
      }

      setIsEditModalOpen(false);
      fetchUsers();
      alert('Datos actualizados exitosamente.');
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert('Error al actualizar: ' + err.message);
    } finally {
      setIsEditing(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Contextual */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-[60px] z-30 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="font-bold text-gray-800 text-xl leading-tight">Gestión de Usuarios</h2>
              <p className="text-xs text-gray-500">Administra los accesos y perfiles</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isCurrentUser = user.id === session?.user.id;
            const isProcessing = processingId === user.id;

            return (
              <div 
                key={user.id} 
                className={`bg-white p-4 rounded-2xl shadow-sm border transition-all ${
                  !user.activo ? 'border-red-100 bg-red-50/30 opacity-75' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-base truncate flex items-center gap-2">
                        {user.nombre}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0">
                            Tú
                          </span>
                        )}
                      </h3>
                      {user.email && (
                        <p className="text-xs text-gray-500 mb-1 truncate">{user.email}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold flex items-center gap-1 ${
                          user.rol === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.rol === 'admin' ? <Shield size={10} /> : <UsersIcon size={10} />}
                          {user.rol}
                        </span>
                        
                        {!user.activo && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-red-100 text-red-600">
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Editar datos"
                  >
                    <Pencil size={18} />
                  </button>
                </div>

                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <button
                    disabled={isCurrentUser || isProcessing}
                    onClick={() => handleToggleRole(user.id, user.rol)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      user.rol === 'admin'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing && processingId === user.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : user.rol === 'admin' ? (
                      <><ShieldAlert size={14} /> Quitar Admin</>
                    ) : (
                      <><Shield size={14} /> Hacer Admin</>
                    )}
                  </button>

                  <button
                    disabled={isCurrentUser || isProcessing}
                    onClick={() => handleToggleStatus(user.id, user.activo)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      user.activo
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing && processingId === user.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : user.activo ? (
                      <><XCircle size={14} /> Desactivar</>
                    ) : (
                      <><CheckCircle2 size={14} /> Activar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 flex flex-col items-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <UsersIcon size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-semibold">No se encontraron usuarios</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-600 text-sm font-bold">
                Limpiar búsqueda
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
              <h3 className="text-xl font-bold text-gray-800">Nuevo Usuario</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Contraseña Inicial</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                >
                  {isCreating ? <><Loader2 size={18} className="animate-spin" /> Registrando...</> : 'Registrar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Editar Usuario</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1 flex justify-between">
                  <span>Nueva Contraseña</span>
                  <span className="text-[10px] font-normal text-gray-400 uppercase">Opcional</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Dejar en blanco para mantener"
                    value={editUserPassword}
                    onChange={(e) => setEditUserPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-gray-50 transition-all text-sm"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isEditing}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                >
                  {isEditing ? <><Loader2 size={18} className="animate-spin" /> Guardando...</> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
