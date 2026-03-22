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

const loginSchema = z.object({
  tenant_slug: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function TenantLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { token, refreshToken, user } = res.data.data;
      
      login(token, refreshToken, user);
      
      toast.success('Welcome back!');
      
      // Route based on role
      switch (user.role) {
        case 'SuperAdmin':
        case 'Admin':
          router.push('/admin');
          break;
        case 'BranchAdmin':
          router.push('/branchadmin');
          break;
        case 'FieldCollector':
          router.push('/collector');
          break;
        default:
          router.push('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white">Sign In</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your organization credentials to access your cooperative.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant_slug" className="text-slate-300">Organization ID</Label>
            <Input 
              id="tenant_slug" 
              placeholder="e.g. city-coop" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              {...register('tenant_slug')} 
            />
            {errors.tenant_slug && <p className="text-sm text-red-500">{errors.tenant_slug.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              {...register('email')} 
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <a href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              {...register('password')} 
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-slate-800 pt-6">
        <a href="/system-login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          Platform Administrator Login
        </a>
      </CardFooter>
    </Card>
  );
}
