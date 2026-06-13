import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-light/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <Link
          to={ROUTES.LANDING}
          className="flex items-center gap-2.5 text-white hover:text-indigo-200 transition-colors"
        >
          <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Link2 className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Sniplink
          </span>
        </Link>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main card panel */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950/50 backdrop-blur-md py-8 px-4 border border-slate-800/80 shadow-2xl sm:rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
