import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = z.object({
  originalUrl: z.string().url('Please enter a valid URL (including http:// or https://)'),
  customAlias: z
    .string()
    .refine(
      (val) => val === '' || /^[a-zA-Z0-9-_]{3,30}$/.test(val),
      'Alias must be 3-30 characters, containing only letters, numbers, hyphens, and underscores'
    )
    .optional()
});

const EditUrlModal = ({ isOpen, onClose, url, onConfirm, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  // Load current URL values when modal opens or url changes
  useEffect(() => {
    if (url) {
      setValue('originalUrl', url.originalUrl);
      setValue('customAlias', url.customAlias || '');
    }
  }, [url, setValue]);

  const handleFormSubmit = async (data) => {
    const success = await onConfirm(url._id, {
      originalUrl: data.originalUrl.trim(),
      customAlias: data.customAlias ? data.customAlias.trim() : null
    });
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Shortened Link">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        {/* Destination URL Input */}
        <Input
          label="Destination URL"
          type="text"
          placeholder="https://example.com/very-long-path"
          error={errors.originalUrl?.message}
          {...register('originalUrl')}
        />

        {/* Custom Alias Input */}
        <Input
          label="Custom Alias (Optional)"
          type="text"
          placeholder="my-cool-link"
          error={errors.customAlias?.message}
          {...register('customAlias')}
        />

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUrlModal;
