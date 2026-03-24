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

const systemLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SystemLoginFormValues = z.infer<typeof systemLoginSchema>;

export default function SystemLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SystemLoginFormValues>({
    resolver: zodResolver(systemLoginSchema),
  });

  const onSubmit = async (data: SystemLoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/platform/login', data);
      const { token, refreshToken, user } = res.data.data;

      login(token, refreshToken, user);

      toast.success('System portal access granted');
      router.push('/systemadmin'); // Redirect to SystemAdmin dashboard
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-indigo-900 bg-slate-900/40 backdrop-blur-md shadow-[0_0_40px_rgba(79,70,229,0.1)]">
      <CardHeader>
        <div className="flex justify-center mb-2">
          <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
            PLATFORM ADMINISTRATION
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-white text-center">System Login</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Authorized personnel only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@codecraft.ai"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-slate-800 pt-6">
        <a href="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          &larr; Return to Cooperative Login
        </a>
      </CardFooter>
    </Card>
  );
}
