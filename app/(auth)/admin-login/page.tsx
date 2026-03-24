"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const adminLoginSchema = z.object({
  tenant_slug: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { token, refreshToken, user } = res.data.data;
      
      login(token, refreshToken, user);
      
      toast.success('Admin access granted');
      
      switch (user.role) {
        case 'SuperAdmin':
          router.push('/superadmin');
          break;
        case 'Admin':
          router.push('/admin');
          break;
        case 'BranchAdmin':
          router.push('/branchadmin');
          break;
        default:
          router.push('/admin');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-emerald-900/50 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.1)]">
      <CardHeader>
        <div className="flex justify-center mb-2">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            ADMINISTRATOR PORTAL
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-white text-center">Admin Sign In</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your organization credentials to manage your cooperative.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant_slug" className="text-slate-300">Organization ID</Label>
            <Input 
              id="tenant_slug" 
              placeholder="e.g. city-coop" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              {...register('tenant_slug')} 
            />
            {errors.tenant_slug && <p className="text-sm text-red-500">{errors.tenant_slug.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              {...register('email')} 
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <a href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              {...register('password')} 
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]" 
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-slate-800 pt-6 flex flex-col gap-2">
        <a href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          &larr; Return to Staff Login
        </a>
      </CardFooter>
    </Card>
  );
}
