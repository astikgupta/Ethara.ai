import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ListTodo, 
  LogOut, 
  Users, 
  Moon, 
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EtharaLogo = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9 transition-all duration-300">
    {/* Outer Circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4.5" />
    
    {/* Refined Lotus Pattern from screenshot */}
    <g fill="currentColor">
      {/* Center Top Petal */}
      <path d="M50 25 C52 35 55 40 50 52 C45 40 48 35 50 25 Z" />
      
      {/* Top Left Petal */}
      <path d="M47 28 C42 32 32 38 30 45 C38 45 42 42 47 38 Z" opacity="0.95" />
      
      {/* Top Right Petal */}
      <path d="M53 28 C58 32 68 38 70 45 C62 45 58 42 53 38 Z" opacity="0.95" />

      {/* Middle Left Petal */}
      <path d="M28 50 C32 52 38 58 42 62 C38 65 32 65 25 60 C30 55 30 52 28 50 Z" opacity="0.9" />

      {/* Middle Right Petal */}
      <path d="M72 50 C68 52 62 58 58 62 C62 65 68 65 75 60 C70 55 70 52 72 50 Z" opacity="0.9" />
      
      {/* Center Dot */}
      <circle cx="50" cy="58" r="2.2" />

      {/* Bottom Teardrop */}
      <path d="M50 65 C53 72 53 78 50 82 C47 78 47 72 50 65 Z" />
      
      {/* Bottom Two Dots */}
      <circle cx="42" cy="72" r="2" />
      <circle cx="58" cy="72" r="2" />
    </g>
  </svg>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'My Tasks', icon: ListTodo, path: '/tasks' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Team', icon: Users, path: '/team' });
  }

  return (
    <aside className="w-60 h-screen sticky top-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] transition-all duration-300">
      <div className="p-8 pb-10 flex items-center gap-3">
        <div className="text-slate-900 dark:text-white">
          <EtharaLogo />
        </div>
        <span className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
          Ethara.AI
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--card-border)]">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest mb-4"
        >
          <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        
        <div className="flex items-center gap-3 px-2 mb-2 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/50">
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase">{user?.role || 'Member'}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
