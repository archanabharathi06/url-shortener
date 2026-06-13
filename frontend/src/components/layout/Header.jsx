import React from 'react';
import { Menu, User, Link2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/30">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile screen sizes */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Mobile-only logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
            <Link2 className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Sniplink
          </span>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold text-slate-500">Workspace</h1>
        </div>
      </div>

      {/* User profile dropdown triggers */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name || 'Demo User'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {user.email}
              </span>
            </div>
            
            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-brand shadow-inner">
              {getInitials(user.name)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
