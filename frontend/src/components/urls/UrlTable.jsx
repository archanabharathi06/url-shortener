import React from 'react';
import { Copy, BarChart2, Edit2, Trash2, Calendar, Check, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Tooltip from '../common/Tooltip';

const UrlTable = ({
  urls,
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

  const truncateUrl = (urlStr, max = 50) => {
    if (urlStr.length <= max) return urlStr;
    return `${urlStr.substring(0, max)}...`;
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/30">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <tr>
            <th scope="col" className="px-6 py-4.5">Destination URL</th>
            <th scope="col" className="px-6 py-4.5">Short Link</th>
            <th scope="col" className="px-6 py-4.5">Created Date</th>
            <th scope="col" className="px-6 py-4.5 text-center">Clicks</th>
            <th scope="col" className="px-6 py-4.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {urls.map((url) => {
            const domain = getDomain(url.originalUrl);
            const shortUrlStr = `${baseUrl}/${url.shortCode}`;
            const isCopied = copiedId === url._id;

            return (
              <tr key={url._id} className="hover:bg-slate-50/50 transition-colors">
                {/* Destination Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
                      alt={domain}
                      className="h-7 w-7 rounded-lg border border-slate-200/80 p-1 bg-white shrink-0 shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                      }}
                    />
                    <div className="flex flex-col min-w-0 max-w-sm md:max-w-md lg:max-w-lg">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 hover:text-brand flex items-center gap-1 hover:underline truncate"
                      >
                        {truncateUrl(url.originalUrl)}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      </a>
                      {url.expiresAt && (
                        <span className="text-[10px] text-orange-600 font-semibold mt-0.5 flex items-center gap-1">
                          Expires: {new Date(url.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Short Link Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-semibold tracking-tight">
                      {url.customAlias || url.shortCode}
                    </span>
                    <button
                      onClick={() => onCopy(shortUrlStr, url._id)}
                      className={`p-1.5 rounded-lg border transition-all duration-200 
                        ${isCopied 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </td>

                {/* Created At Column */}
                <td className="px-6 py-4 text-slate-500 font-normal">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(url.createdAt)}
                  </div>
                </td>

                {/* Click Count Column */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-brand border border-indigo-100 shadow-sm shadow-indigo-100/20">
                    {url.totalClicks}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Tooltip text="Analytics">
                      <button
                        onClick={() => onAnalytics(url._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        <BarChart2 className="h-4 w-4" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip text="Edit">
                      <button
                        onClick={() => onEdit(url)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip text="Delete">
                      <button
                        onClick={() => onDelete(url._id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;
