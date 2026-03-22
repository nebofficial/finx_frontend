"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Define schemas for each step
const requestOtpSchema = z.object({
  tenant_slug: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
});

const verifyOtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const resetPasswordSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resetContext, setResetContext] = useState({ tenant_slug: '', email: '', reset_token: '' });

  // Forms
  const { register: regRequest, handleSubmit: handleRequest, formState: { errors: errRequest } } = useForm({
    resolver: zodResolver(requestOtpSchema),
  });
  const { register: regVerify, handleSubmit: handleVerify, formState: { errors: errVerify } } = useForm({
    resolver: zodResolver(verifyOtpSchema),
  });
  const { register: regReset, handleSubmit: handleReset, formState: { errors: errReset } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handlers
  const onRequestOtp = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setResetContext({ ...resetContext, tenant_slug: data.tenant_slug, email: data.email });
      setStep(2);
      toast.success('An OTP has been sent to your email.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        tenant_slug: resetContext.tenant_slug,
        email: resetContext.email,
        otp: data.otp,
      });
      setResetContext({ ...resetContext, reset_token: res.data.data.reset_token });
      setStep(3);
      toast.success('OTP Verified. Please enter your new password.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        new_password: data.new_password,
      }, {
        headers: { Authorization: `Bearer ${resetContext.reset_token}` }
      });
      toast.success('Password reset successfully! You can now log in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">Reset Password</CardTitle>
        <CardDescription className="text-slate-400">
          {step === 1 && "Enter your email to receive a secure recovery code."}
          {step === 2 && "Enter the 6-digit code sent to your email."}
          {step === 3 && "Create a new strong password."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleRequest(onRequestOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant_slug" className="text-slate-300">Organization ID</Label>
              <Input 
                id="tenant_slug" 
                className="bg-slate-800 border-slate-700 text-white"
                {...regRequest('tenant_slug')} 
              />
              {errRequest.tenant_slug && <p className="text-sm text-red-500">{errRequest.tenant_slug.message as string}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                className="bg-slate-800 border-slate-700 text-white"
                {...regRequest('email')} 
              />
              {errRequest.email && <p className="text-sm text-red-500">{errRequest.email.message as string}</p>}
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Recovery Code'}
            </Button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleVerify(onVerifyOtp)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-slate-300">6-Digit Code</Label>
              <Input 
                id="otp" 
                type="text"
                placeholder="000000"
                className="bg-slate-800 border-slate-700 text-white text-center text-lg tracking-[0.5em]"
                maxLength={6}
                {...regVerify('otp')} 
              />
              {errVerify.otp && <p className="text-sm text-red-500">{errVerify.otp.message as string}</p>}
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleReset(onResetPassword)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-slate-300">New Password</Label>
              <Input 
                id="new_password" 
                type="password" 
                className="bg-slate-800 border-slate-700 text-white"
                {...regReset('new_password')} 
              />
              {errReset.new_password && <p className="text-sm text-red-500">{errReset.new_password.message as string}</p>}
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Save New Password'}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800 pt-6">
        <a href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          &larr; Back to Sign In
        </a>
      </CardFooter>
    </Card>
  );
}
