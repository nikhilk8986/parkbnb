"use client";
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('latitude', latitude.toString());
        localStorage.setItem('longitude', longitude.toString());
      });
    }
  }, []);

  const clickRegister = async () => {
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = isOwner ? '/api/v1/ownerregister' : '/api/v1/register';
      const response = await axios.post(endpoint, {
        email: email,
        password: password,
        isOwner: isOwner,
        latitude:localStorage.getItem('latitude'),
        longitude:localStorage.getItem('longitude')
      });
      
      if (response.status === 201) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        router.push('/signin');
      }
    } catch (error) {
      
      console.log("something on register frontend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131314] p-4 font-sans">

      <div className="w-full max-w-md bg-[#1E1F20] rounded-3xl p-8 border border-[#333537] shadow-xl">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-medium mb-2 text-white">
            Create Account
          </h2>
          <p className="text-[#C4C7C5]">Register as a new user or owner</p>
        </div>

        {/* User/Owner Toggle */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setIsOwner(false)}
            className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${
              !isOwner
                ? 'bg-[#A8C7FA] text-black border border-[#A8C7FA]'
                : 'bg-[#131314] text-[#C4C7C5] border border-[#444746] hover:border-[#A8C7FA]'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setIsOwner(true)}
            className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${
              isOwner
                ? 'bg-[#A8C7FA] text-black border border-[#A8C7FA]'
                : 'bg-[#131314] text-[#C4C7C5] border border-[#444746] hover:border-[#A8C7FA]'
            }`}
          >
            Owner
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Email input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C4C7C5] mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#131314] border border-[#444746] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#A8C7FA] focus:border-[#A8C7FA] text-[#E3E3E3] placeholder-[#8E918F] transition-all"
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C4C7C5] mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#131314] border border-[#444746] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#A8C7FA] focus:border-[#A8C7FA] text-[#E3E3E3] placeholder-[#8E918F] transition-all"
          />
        </div>

        {/* Confirm Password input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#C4C7C5] mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#131314] border border-[#444746] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#A8C7FA] focus:border-[#A8C7FA] text-[#E3E3E3] placeholder-[#8E918F] transition-all"
          />
        </div>

        {/* Register Button */}
        <button 
          onClick={clickRegister}
          disabled={loading || !email || !password || !confirmPassword}
          className="w-full py-3.5 px-4 bg-white text-black border border-[#444746] rounded-2xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 mb-4"
        >
          {loading ? 'Creating account...' : `Register as ${isOwner ? 'Owner' : 'User'}`}
        </button>

        {/* Sign In Link */}
        <div className="text-center text-sm text-[#C4C7C5]">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#A8C7FA] hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
