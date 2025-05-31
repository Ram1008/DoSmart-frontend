// components/Form.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser, signupUser } from '@/lib/features/auth/authSlice';

interface FormProps {
  mode: 'login' | 'signup';
}

const Form: React.FC<FormProps> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const result = await dispatch(loginUser({ username, password }));
    if (
      result.payload &&
      typeof result.payload === 'object' &&
      'token' in result.payload &&
      'username' in result.payload
    ) {
      localStorage.setItem('token', result.payload.token);
      localStorage.setItem('username', JSON.stringify(result.payload.username));
    }
      if (loginUser.fulfilled.match(result)) {
        router.push('/');
      }
    } else {
      const result = await dispatch(signupUser({ username, password }));
      if (
      result.payload &&
      typeof result.payload === 'object' &&
      'token' in result.payload &&
      'username' in result.payload
    ) {
      localStorage.setItem('token', result.payload.token);
      localStorage.setItem('username', JSON.stringify(result.payload.username));
    }
      if (signupUser.fulfilled.match(result)) {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              mode === 'login' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading
              ? mode === 'login'
                ? 'Logging in…'
                : 'Signing up…'
              : mode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </button>
            <p className="text-sm text-center text-gray-600 mt-4">
                {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
                <span
                onClick={() => router.push(mode === 'login' ? '/signup' : '/login')}
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
                </span>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Form;
