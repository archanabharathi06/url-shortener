import React from 'react';
import { Copy, BarChart2, Edit2, Trash2, Calendar, Check, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const UrlCard = ({
  url,
  copiedId,
  onCopy,
  onEdit,
  onDelete,
  onAnalytics,
  baseUrl
}) => {
  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname;
    } catch (_) {
      return 'link';
    }
  };

  const domain = getDomain(url.originalUrl);
  const shortUrlStr = `${baseUrl}/${url.shortCode}`;
  const isCopied = copiedId === url._id;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 flex flex-col gap-4">
      {/* Header with favicon and destination url */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
            alt={domain}
            className="h-8 w-8 rounded-lg border border-slate-200/85 p-1 bg-white shrink-0 shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            }}
          />
          <div className="flex flex-col min-w-0">
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-slate-900 hover:text-brand flex items-center gap-1 hover:underline truncate"
            >
              {domain}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </a>
            <span className="text-xs text-slate-400 truncate mt-0.5">
              {url.originalUrl}
            </span>
          </div>
        </div>

        {/* Click Badge */}
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-brand border border-indigo-100 shadow-sm shrink-0">
          {url.totalClicks} clicks
        </span>
      </div>

      {/* Expiry alerts */}
      {url.expiresAt && (
        <div className="text-[10px] text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1 font-semibold self-start flex items-center gap-1">
          Expires: {new Date(url.expiresAt).toLocaleDateString()}
        </div>
      )}

      {/* Short link and Copy action */}
      <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 rounded-xl p-3">
        <span className="text-sm font-bold tracking-tight text-slate-800 truncate">
          {url.customAlias || url.shortCode}
        </span>
        <button
          onClick={() => onCopy(shortUrlStr, url._id)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 
            ${isCopied 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
            }`}
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5 animate-scaleUp" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Footer details (Created Date & Actions) */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-1 text-slate-400">
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(url.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAnalytics(url._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit(url)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(url._id)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
