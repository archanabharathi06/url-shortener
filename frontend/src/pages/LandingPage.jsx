import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, BarChart3, QrCode, Shield, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="h-20 max-w-7xl w-full mx-auto px-6 flex items-center justify-between border-b border-slate-900 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Link2 className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Sniplink
          </span>
        </div>

        <nav className="flex items-center gap-4 text-sm font-semibold">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl shadow-lg shadow-indigo-500/10 flex items-center gap-1.5 transition-all duration-200"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-slate-400 hover:text-white transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl shadow-lg shadow-indigo-500/10 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 mb-6">
          <Zap className="h-3.5 w-3.5 fill-indigo-400/20" />
          Next-Gen Short Links
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Shorten. Share. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Analyze with Precision.
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Create premium short links with custom aliases, automatic link expiration, dynamic QR codes, and granular user-agent traffic analytics. Built for modern creators.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.SIGNUP}
            className="px-8 py-3.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 transition-all duration-200"
          >
            Create Your First Link
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
          {!isAuthenticated && (
            <Link
              to={ROUTES.LOGIN}
              className="px-8 py-3.5 border border-slate-800 bg-slate-950/40 text-slate-300 font-semibold rounded-xl hover:bg-slate-900/60 hover:text-white transition-all duration-200 flex items-center justify-center"
            >
              Sign In to Account
            </Link>
          )}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="border-t border-slate-900/80 bg-slate-950/40 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Standard MERN SaaS Features
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Sniplink offers a full-suite short link workflow out of the box
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'High-Speed Redirects',
                desc: 'Server-side redirection with collision-resistant nanoid keys guarantees millisecond-fast navigation.'
              },
              {
                icon: BarChart3,
                title: 'Granular Analytics',
                desc: 'Track daily click counts, parse device structures, browser configurations, referrers, and locations.'
              },
              {
                icon: QrCode,
                title: 'Dynamic QR Codes',
                desc: 'Generate downloadable high-resolution QR codes for physical or visual sharing with one click.'
              },
              {
                icon: Shield,
                title: 'Protected Access',
                desc: 'Secure user login sessions using standard JWT encryption tokens and bcrypt hashed credentials.'
              }
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-900 p-6 rounded-2xl flex flex-col gap-4 transition-all duration-200 hover:border-slate-800"
              >
                <div className="h-10 w-10 bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <feat.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-normal">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-900 flex items-center justify-between px-6 text-xs text-slate-500 max-w-7xl w-full mx-auto relative z-10">
        <span>© {new Date().getFullYear()} Sniplink. All rights reserved.</span>
        <a
          href="https://katomaran.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-slate-400 transition-colors"
        >
          katomaran.com Hackathon
          <ExternalLink className="h-3 w-3" />
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
