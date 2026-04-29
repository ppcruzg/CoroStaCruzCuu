import { Home, Music, Calendar, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: '/cantos',   icon: Music,     label: 'Cantos' },
    { to: '/sesiones', icon: Calendar,  label: 'Sesiones' },
    { to: '/',         icon: Home,      label: 'Inicio',   exact: true },
    { to: '/perfil',   icon: User,      label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-2xl">
      <div className="max-w-lg mx-auto flex justify-around items-center px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 w-16 py-1 transition-all"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-transparent'
              }`}>
                <Icon
                  size={22}
                  className={isActive ? 'text-white' : 'text-gray-400'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
