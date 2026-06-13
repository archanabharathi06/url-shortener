import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await signup(data.email, data.password, data.name);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start shortening and analyzing your links instantly"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Name Input */}
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Action Button */}
        <Button
          type="submit"
          isLoading={loading}
          className="w-full py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 font-semibold"
        >
          Sign Up
        </Button>

        {/* Switch Route link */}
        <p className="text-center text-xs text-slate-400 mt-2 font-medium">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-bold text-brand hover:text-brand-light hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
