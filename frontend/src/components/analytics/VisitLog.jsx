import React from 'react';
import { formatDateTime } from '../../utils/formatDate';
import { Globe, ArrowLeft, ArrowRight, Laptop, Smartphone, Tablet } from 'lucide-react';
import Button from '../common/Button';

const VisitLog = ({
  visits = [],
  pagination = {},
  onPageChange,
  isLoading
}) => {
  const { page = 1, pages = 1 } = pagination;

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="h-3.5 w-3.5 text-slate-400" />;
      case 'tablet':
        return <Tablet className="h-3.5 w-3.5 text-slate-400" />;
      case 'desktop':
      default:
        return <Laptop className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Visit History Logs
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Granular list of redirects recorded
        </p>
      </div>

      <div className="w-full overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full border-collapse text-left text-xs text-slate-500">
          <thead className="bg-slate-50/75 border-b border-slate-100 font-semibold uppercase text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3">Timestamp</th>
              <th scope="col" className="px-5 py-3">Device</th>
              <th scope="col" className="px-5 py-3">Browser</th>
              <th scope="col" className="px-5 py-3">Country</th>
              <th scope="col" className="px-5 py-3">Referer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {visits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No redirect clicks recorded yet.
                </td>
              </tr>
            ) : (
              visits.map((visit) => (
                <tr key={visit._id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="px-5 py-3.5 text-slate-900">
                    {formatDateTime(visit.visitedAt)}
                  </td>
                  <td className="px-5 py-3.5 capitalize">
                    <div className="flex items-center gap-1.5">
                      {getDeviceIcon(visit.device)}
                      {visit.device}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {visit.browser}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      {visit.country}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 truncate max-w-xs">
                    {visit.referer}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages || isLoading}
            >
              Next
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitLog;
