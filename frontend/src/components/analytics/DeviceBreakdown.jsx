import React from 'react';
import { Laptop, Smartphone, Tablet, Globe } from 'lucide-react';

const DeviceBreakdown = ({ deviceBreakdown = {}, browserBreakdown = [] }) => {
  const { desktop = 0, mobile = 0, tablet = 0 } = deviceBreakdown;
  const total = desktop + mobile + tablet;

  const getPercentage = (value) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const getPercentageNum = (value) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const devices = [
    { label: 'Desktop', count: desktop, icon: Laptop, color: 'bg-indigo-500' },
    { label: 'Mobile', count: mobile, icon: Smartphone, color: 'bg-emerald-500' },
    { label: 'Tablet', count: tablet, icon: Tablet, color: 'bg-amber-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Device Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Device Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clicks split by access device
          </p>
        </div>

        <div className="flex flex-col gap-4.5 mt-5">
          {devices.map((dev) => {
            const pct = getPercentage(dev.count);
            const pctNum = getPercentageNum(dev.count);
            
            return (
              <div key={dev.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <dev.icon className="h-4 w-4 text-slate-400" />
                    {dev.label}
                  </div>
                  <span className="text-slate-400 font-semibold">
                    {dev.count} ({pct})
                  </span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dev.color} rounded-full transition-all duration-500`}
                    style={{ width: `${pctNum}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Browser Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Top web browsers utilized
          </p>
        </div>

        <div className="flex flex-col gap-3.5 mt-5">
          {browserBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-1.5">
              <Globe className="h-8 w-8 stroke-[1.5]" />
              <span className="text-xs">No browser analytics logged yet</span>
            </div>
          ) : (
            browserBreakdown.map((browser, index) => (
              <div
                key={browser.name}
                className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 h-5 w-5 rounded-md bg-slate-50 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {browser.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-brand bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded-full">
                  {browser.count} clicks
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceBreakdown;
