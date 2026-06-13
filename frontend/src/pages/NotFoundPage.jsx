import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Link2, AlertTriangle, Home } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const NotFoundPage = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const isExpired = reason === 'expired';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 gap-6 text-slate-100 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Brand Header */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Link2 className="h-5 w-5 text-white stroke-[2.5]" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Sniplink
        </span>
      </div>

      {/* Main card box */}
      <div className="max-w-md w-full bg-slate-950/60 border border-slate-900 rounded-3xl p-8 flex flex-col items-center gap-5 backdrop-blur-sm relative z-10">
        <div className={`h-16 w-16 rounded-full flex items-center justify-center 
          ${isExpired ? 'bg-orange-950/20 border border-orange-950 text-orange-500' : 'bg-red-950/20 border border-red-900/40 text-red-400'}`}
        >
          <AlertTriangle className="h-8 w-8 stroke-[1.5]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-extrabold text-white">
            {isExpired ? 'Link Expired' : 'Page Not Found'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isExpired
              ? 'This shortened URL has exceeded its validity expiration date and is no longer redirecting traffic.'
              : 'The link you are trying to visit does not exist, has been disabled, or was deleted by its owner.'}
          </p>
        </div>

        <Link
          to={ROUTES.LANDING}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
