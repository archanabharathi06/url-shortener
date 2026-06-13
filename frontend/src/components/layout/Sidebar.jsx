import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Link2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 border-r border-slate-900 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top Header Section */}
        <div className="flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Link2 className="h-5 w-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Sniplink
              </span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                    ${isActive 
                      ? 'bg-brand text-white shadow-lg shadow-indigo-600/10' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer User Info & Logout */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex flex-col gap-3">
            {user && (
              <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-900/80">
                <p className="text-xs font-semibold text-slate-400 truncate">Logged in as</p>
                <p className="text-sm font-medium text-white truncate mt-0.5">{user.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-900 hover:border-red-950/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
