import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Link2, Clock, MousePointerClick, Calendar, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import StatCard from '../components/analytics/StatCard';
import ClickChart from '../components/analytics/ClickChart';
import DeviceBreakdown from '../components/analytics/DeviceBreakdown';
import Skeleton from '../components/common/Skeleton';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { copyToClipboard } from '../utils/copyToClipboard';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

const PublicStatsPage = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_SHORT_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPublicStats = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getPublicStats(shortCode);
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching public stats:', error);
        toast.error('Failed to load public statistics. Link may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, [shortCode]);

  const handleCopy = async () => {
    const shortUrl = `${baseUrl}/${shortCode}`;
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      toast.success('Short link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col gap-6 p-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 w-full" variant="rect" />
          <Skeleton className="h-28 w-full" variant="rect" />
          <Skeleton className="h-28 w-full" variant="rect" />
        </div>
        <Skeleton className="h-80 w-full" variant="rect" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 gap-5 text-slate-100">
        <div className="h-16 w-16 rounded-full bg-red-950/20 border border-red-900/40 flex items-center justify-center text-red-400">
          <Link2 className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold">Public Stats Not Found</h1>
        <p className="text-slate-400 text-xs max-w-xs leading-normal">
          The short link code or alias you entered does not exist, or has been deleted by its owner.
        </p>
        <Link to={ROUTES.LANDING} className="px-5 py-2.5 bg-brand hover:bg-brand-dark font-semibold text-xs rounded-xl transition-all">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const { urlInfo, chartData, deviceBreakdown, browserBreakdown, recentVisits } = stats;
  const shortUrlStr = `${baseUrl}/${urlInfo.shortCode}`;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-10">
      {/* Header Panel */}
      <header className="h-16 bg-slate-950 border-b border-slate-900 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2 max-w-7xl w-full mx-auto justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <Link2 className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Sniplink <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider ml-1.5 border border-slate-800 px-2 py-0.5 rounded-full bg-slate-900">Stats</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg bg-slate-900">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Sanitized (No IP logging visible)
          </div>
        </div>
      </header>

      {/* Main Stats Summary */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* URL Identity Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Public Link Performance</span>
            <h2 className="text-base font-bold text-slate-800 truncate mt-1">
              Destination URL
            </h2>
            <a
              href={urlInfo.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand hover:underline font-medium break-all flex items-center gap-1 mt-0.5"
            >
              {urlInfo.originalUrl}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>

          {/* Shareable Link Copy Panel */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3 shrink-0">
            <span className="text-xs font-bold text-slate-800 font-mono tracking-tight select-all">
              {shortUrlStr}
            </span>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 
                ${copied 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Clicks & Timing Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Clicks"
            value={urlInfo.totalClicks}
            icon={MousePointerClick}
            description="Accrued redirect count"
          />
          <StatCard
            title="Last Click"
            value={urlInfo.lastVisitedAt ? formatDateTime(urlInfo.lastVisitedAt) : 'Never visited'}
            icon={Clock}
            description="Last visitor timestamp"
          />
          <StatCard
            title="Created Date"
            value={formatDate(urlInfo.createdAt)}
            icon={Calendar}
            description="Link creation date"
          />
        </div>

        {/* Trends Chart */}
        <ClickChart data={chartData} />

        {/* Device breakdown info */}
        <DeviceBreakdown
          deviceBreakdown={deviceBreakdown}
          browserBreakdown={browserBreakdown}
        />

        {/* Sanitized recent redirects log */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Recent Visitor Timestamps
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of recent redirect hits
            </p>
          </div>

          <div className="w-full overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full border-collapse text-left text-xs text-slate-500">
              <thead className="bg-slate-50/75 border-b border-slate-100 font-semibold uppercase text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3">Time</th>
                  <th scope="col" className="px-5 py-3">Device</th>
                  <th scope="col" className="px-5 py-3">Browser</th>
                  <th scope="col" className="px-5 py-3">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentVisits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                      No visits recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentVisits.map((visit, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="px-5 py-3 text-slate-900">
                        {formatDateTime(visit.visitedAt)}
                      </td>
                      <td className="px-5 py-3 capitalize">
                        {visit.device}
                      </td>
                      <td className="px-5 py-3">
                        {visit.browser}
                      </td>
                      <td className="px-5 py-3">
                        {visit.country}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-400 mt-6 border-t border-slate-200/30 pt-6 max-w-7xl w-full mx-auto">
        This project is a part of a hackathon run by <a href="https://katomaran.com" className="underline hover:text-slate-600 transition-colors">https://katomaran.com</a>
      </footer>
    </div>
  );
};

export default PublicStatsPage;
