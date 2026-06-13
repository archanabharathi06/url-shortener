import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Sparkles, Calendar, PlusCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

// Schema matches backend validation requirements
const schema = z.object({
  originalUrl: z.string().url('Please enter a valid URL (e.g. https://google.com)'),
  customAlias: z
    .string()
    .refine(
      (val) => val === '' || /^[a-zA-Z0-9-_]{3,30}$/.test(val),
      'Alias must be 3-30 characters, containing only letters, numbers, hyphens, and underscores'
    )
    .optional(),
  expiresAt: z
    .string()
    .refine(
      (val) => val === '' || new Date(val) > new Date(),
      'Expiration date must be in the future'
    )
    .optional()
});

const CreateUrlForm = ({ onSubmitUrl, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      originalUrl: '',
      customAlias: '',
      expiresAt: ''
    }
  });

  const handleFormSubmit = async (data) => {
    const originalUrl = data.originalUrl.trim();
    const customAlias = data.customAlias ? data.customAlias.trim() : null;
    const expiresAt = data.expiresAt ? new Date(data.expiresAt).toISOString() : null;

    const success = await onSubmitUrl({ originalUrl, customAlias, expiresAt });
    if (success) {
      reset();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-100/30">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-brand">
          <PlusCircle className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Create New Link
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Destination URL Input */}
          <div className="md:col-span-6">
            <Input
              label="Destination URL"
              type="text"
              placeholder="https://example.com/very-long-path"
              error={errors.originalUrl?.message}
              {...register('originalUrl')}
            />
          </div>

          {/* Custom Alias Input */}
          <div className="md:col-span-3">
            <Input
              label="Custom Alias (Optional)"
              type="text"
              placeholder="my-cool-link"
              error={errors.customAlias?.message}
              {...register('customAlias')}
            />
          </div>

          {/* Expiration Date Input */}
          <div className="md:col-span-3">
            <Input
              label="Expiration Date (Optional)"
              type="datetime-local"
              error={errors.expiresAt?.message}
              {...register('expiresAt')}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-50">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 text-sm font-semibold"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Shorten Link
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUrlForm;
