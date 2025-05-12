import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore';
import {IdCard, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthHeroSection from '../components/AuthHeroSection'
import logo from '../assets/blab_logo.png';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });

  const { signup, isSigninUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.firstname.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastname.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    return true;
  };
  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()) {
      return;
    }
    const fullname = `${formData.firstname.trim()} ${formData.lastname.trim()}`;
    const data = {
      fullname,
      username: formData.username,
      email: formData.email.toLowerCase(),
      password: formData.password
    };

    signup(data);
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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className='space-y-6'>
            <div className="form-control">
              <label htmlFor="firstname" className="label mb-1">
                <span className='label-text font-medium'>First Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IdCard className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="text"
                  id='firstname'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='John'
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="lastname" className="label mb-1">
                <span className='label-text font-medium'>Last Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IdCard className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="text"
                  id='lastname'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='Doe'
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="username" className="label mb-1">
                <span className='label-text font-medium'>Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="text"
                  id='username'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='Your Username'
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label mb-1">
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="email"
                  id='email'
                  className={'input input-bordered w-full pl-10'}
                  placeholder='you@example.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
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
            <button type='submit' className='btn btn-primary w-full' disabled={isSigninUp}>
              {isSigninUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
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

export default SignupPage