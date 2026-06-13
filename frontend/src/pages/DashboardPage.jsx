import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Link2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import urlService from '../services/urlService';
import CreateUrlForm from '../components/urls/CreateUrlForm';
import UrlTable from '../components/urls/UrlTable';
import UrlCard from '../components/urls/UrlCard';
import DeleteUrlModal from '../components/urls/DeleteUrlModal';
import EditUrlModal from '../components/urls/EditUrlModal';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { copyToClipboard } from '../utils/copyToClipboard';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Search query filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form submission loading
  const [createLoading, setCreateLoading] = useState(false);

  // Copy indicator state
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDeleteId, setUrlToDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_SHORT_URL || 'http://localhost:5000';

  const fetchUrls = async (page = 1) => {
    setLoading(true);
    try {
      const response = await urlService.getUrls(page, pagination.limit);
      if (response.success) {
        setUrls(response.data);
        setPagination(response.meta);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to load shortened links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls(1);
  }, []);

  const handleCreateUrl = async ({ originalUrl, customAlias, expiresAt }) => {
    setCreateLoading(true);
    try {
      const response = await urlService.createUrl(originalUrl, customAlias, expiresAt);
      if (response.success) {
        toast.success('Short link generated!');
        fetchUrls(1); // Refresh list back to first page
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCopyUrl = async (shortUrl, id) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopiedId(id);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error('Failed to copy link.');
    }
  };

  const handleOpenDelete = (id) => {
    setUrlToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await urlService.deleteUrl(urlToDeleteId);
      if (response.success) {
        toast.success('Shortened URL deleted.');
        setDeleteModalOpen(false);
        // If current page is empty and we have pages, go back
        const newPage = urls.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
        fetchUrls(newPage);
      }
    } catch (error) {
      toast.error('Failed to delete URL.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEdit = (url) => {
    setUrlToEdit(url);
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (id, updatedFields) => {
    setEditLoading(true);
    try {
      const response = await urlService.updateUrl(id, updatedFields.originalUrl, updatedFields.customAlias);
      if (response.success) {
        toast.success('Short link updated.');
        setEditModalOpen(false);
        fetchUrls(pagination.page);
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update URL');
      return false;
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewAnalytics = (id) => {
    navigate(`${ROUTES.ANALYTICS}/${id}`);
  };

  const handlePageChange = (newPage) => {
    fetchUrls(newPage);
  };

  // Filter links on the client based on search query (for immediate search response)
  const filteredUrls = urls.filter((url) => {
    const query = searchQuery.toLowerCase();
    return (
      url.originalUrl.toLowerCase().includes(query) ||
      url.shortCode.toLowerCase().includes(query) ||
      (url.customAlias && url.customAlias.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create, edit, and analyze your shortened links.
        </p>
      </div>

      {/* Shorten Link Form Widget */}
      <CreateUrlForm onSubmitUrl={handleCreateUrl} isLoading={createLoading} />

      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-brand focus:ring-1 focus:ring-indigo-100 placeholder:text-slate-400 text-slate-700"
          />
        </div>

        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">
          Total links: {pagination.total}
        </span>
      </div>

      {/* URL Grid & Listings */}
      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full" variant="rect" />
          <Skeleton className="h-16 w-full" variant="rect" />
          <Skeleton className="h-16 w-full" variant="rect" />
        </div>
      ) : filteredUrls.length === 0 ? (
        /* Empty State Illustration */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-sm flex flex-col items-center justify-center text-center gap-5">
          <div className="h-20 w-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand">
            <Link2 className="h-10 w-10 stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-md">
            <h3 className="text-base font-bold text-slate-800">
              {searchQuery ? 'No matching links found' : 'No links created yet'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchQuery
                ? 'Try refining your search terms or enter a different URL keyword.'
                : 'Welcome to Sniplink! Enter your first long URL in the form above to generate a short shareable link.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <UrlTable
              urls={filteredUrls}
              copiedId={copiedId}
              onCopy={handleCopyUrl}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAnalytics={handleViewAnalytics}
              baseUrl={baseUrl}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredUrls.map((url) => (
              <UrlCard
                key={url._id}
                url={url}
                copiedId={copiedId}
                onCopy={handleCopyUrl}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onAnalytics={handleViewAnalytics}
                baseUrl={baseUrl}
              />
            ))}
          </div>

          {/* Pagination Controllers */}
          {pagination.pages > 1 && !searchQuery && (
            <div className="flex items-center justify-between border-t border-slate-200/50 pt-5 text-sm font-semibold text-slate-500 mt-2">
              <span>
                Showing page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CRUD confirmation/form overlays */}
      <DeleteUrlModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />

      <EditUrlModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        url={urlToEdit}
        onConfirm={handleConfirmEdit}
        isLoading={editLoading}
      />
    </div>
  );
};

export default DashboardPage;
