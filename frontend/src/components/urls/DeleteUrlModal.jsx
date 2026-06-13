import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteUrlModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Short URL" size="sm">
      <div className="flex flex-col gap-4">
        {/* Alert Icon & Message */}
        <div className="flex gap-3.5 items-start bg-red-50 border border-red-100 rounded-xl p-4 text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">Warning</span>
            <span className="text-xs text-red-600 leading-normal">
              Are you sure you want to delete this short URL? This action cannot be undone. Redirects using this link will immediately stop working.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUrlModal;
