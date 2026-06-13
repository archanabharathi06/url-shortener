import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, Clock, MousePointerClick, QrCode, Globe2 } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import StatCard from '../components/analytics/StatCard';
import ClickChart from '../components/analytics/ClickChart';
import DeviceBreakdown from '../components/analytics/DeviceBreakdown';
import VisitLog from '../components/analytics/VisitLog';
import QrModal from '../components/qr/QrModal';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';
import { formatDate, formatDateTime } from '../utils/formatDate';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { urlId } = useParams();
  const [loading, setLoading] = useState(true);
  const [urlInfo, setUrlInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState({});
  const [browserBreakdown, setBrowserBreakdown] = useState([]);

  // Visits log state
  const [visits, setVisits] = useState([]);
  const [visitsPagination, setVisitsPagination] = useState({ page: 1, limit: 8, total: 0, pages: 1 });
  const [visitsLoading, setVisitsLoading] = useState(false);

  // QR Modal state
  const [qrOpen, setQrOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_SHORT_URL || 'http://localhost:5000';

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // 1. Fetch URL summary statistics & aggregates
      const summaryResponse = await analyticsService.getUrlAnalytics(urlId);
      if (summaryResponse.success) {
        setUrlInfo(summaryResponse.data.urlInfo);
        setDeviceBreakdown(summaryResponse.data.deviceBreakdown);
        setBrowserBreakdown(summaryResponse.data.browserBreakdown);
      }

      // 2. Fetch daily click chart points
      const chartResponse = await analyticsService.getUrlChart(urlId);
      if (chartResponse.success) {
        setChartData(chartResponse.data);
      }

      // 3. Fetch initial visits log page
      await fetchVisitsLog(1);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load URL analytics details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitsLog = async (page) => {
    setVisitsLoading(true);
    try {
      const response = await analyticsService.getUrlVisits(urlId, page, visitsPagination.limit);
      if (response.success) {
        setVisits(response.data);
        setVisitsPagination(response.meta);
      }
    } catch (error) {
      console.error('Error loading visits log:', error);
    } finally {
      setVisitsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [urlId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" variant="rect" />
          <Skeleton className="h-32 w-full" variant="rect" />
          <Skeleton className="h-32 w-full" variant="rect" />
        </div>
        <Skeleton className="h-80 w-full" variant="rect" />
      </div>
    );
  }

  if (!urlInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-sm text-slate-500 font-semibold">Analytics data not found or URL deleted.</p>
        <Link to={ROUTES.DASHBOARD} className="text-xs font-bold text-brand hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const shortUrlStr = `${baseUrl}/${urlInfo.shortCode}`;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Back button and page title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 pb-5">
        <div className="flex flex-col gap-2.5 items-start">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate max-w-sm md:max-w-md lg:max-w-xl">
              Link Analytics
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1 truncate max-w-xs md:max-w-lg">
              Destination: <a href={urlInfo.originalUrl} target="_blank" rel="noreferrer" className="underline hover:text-brand transition-colors">{urlInfo.originalUrl}</a>
            </p>
          </div>
        </div>

        {/* Public stats + QR Modal actions */}
        <div className="flex gap-2.5">
          {/* Public Sharing link */}
          <Link
            to={`${ROUTES.PUBLIC_STATS}/${urlInfo.shortCode}`}
            target="_blank"
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 shadow-sm transition-all duration-200"
          >
            <Globe2 className="h-4 w-4 mr-2 text-slate-400" />
            Public Page
          </Link>

          <Button onClick={() => setQrOpen(true)} className="px-4 py-2 text-xs font-bold shadow-indigo-500/10">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>
      </div>

      {/* 3 Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Redirect Clicks"
          value={urlInfo.totalClicks}
          icon={MousePointerClick}
          description="Total visits recorded across all devices"
        />
        <StatCard
          title="Last Visit Logged"
          value={urlInfo.lastVisitedAt ? formatDateTime(urlInfo.lastVisitedAt) : 'Never visited'}
          icon={Clock}
          description="Timestamp of the most recent redirect hit"
        />
        <StatCard
          title="Created Date"
          value={formatDate(urlInfo.createdAt)}
          icon={Calendar}
          description="Date short link was initialized"
        />
      </div>

      {/* Click Activity Trend Recharts BarChart */}
      <ClickChart data={chartData} />

      {/* Device & Browser Breakdowns */}
      <DeviceBreakdown
        deviceBreakdown={deviceBreakdown}
        browserBreakdown={browserBreakdown}
      />

      {/* Granular Visit Log List */}
      <VisitLog
        visits={visits}
        pagination={visitsPagination}
        onPageChange={fetchVisitsLog}
        isLoading={visitsLoading}
      />

      {/* QR Code trigger Modal dialog */}
      <QrModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        shortUrl={shortUrlStr}
      />
    </div>
  );
};

export default AnalyticsPage;
