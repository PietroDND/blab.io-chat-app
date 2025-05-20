import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore';
import {User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthHeroSection from '../components/shared/AuthHeroSection'
import logo from '../assets/blab_logo.png';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      identifier: '',
      password: ''
    });
  
    const { login, isLoggingIn } = useAuthStore();

    const validateForm = () => {
      if (!formData.identifier.trim()) {
        toast.error('Username or email are required');
        return false;
      }
      if (!formData.password) {
        toast.error('Password is required');
        return false;
      }
      return true;
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      if(!validateForm()) {
        return;
      }

      const data = {
        emailOrUsername: formData.identifier,
        password: formData.password
      };
  
      login(data);
    };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Section */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <img src={logo} alt="Blab.io Logo" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back!</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className='space-y-6'>

            <div className="form-control">
              <label htmlFor="identifier" className="label mb-1">
                <span className='label-text font-medium'>Username or Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="text"
                  id='identifier'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='username / you@example.com'
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label mb-1">
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              You don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <AuthHeroSection />
    </div>
  )
}

export default LoginPage