'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/auth-store';
import { useCoinStore } from '@/store/coin-store';

const registerSchema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요'),
    username: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다')
      .max(20, '닉네임은 20자 이하여야 합니다'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, '약관에 동의해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { setCoins } = useCoinStore();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        addToast('error', result.error || '회원가입에 실패했습니다');
        return;
      }

      login(result.data.user, result.data.token);
      setCoins(
        result.data.user.purchasedCoins,
        result.data.user.earnedCoins,
        result.data.user.earnedCoinsExpireAt ? new Date(result.data.user.earnedCoinsExpireAt) : null
      );

      addToast('success', result.message || '회원가입이 완료되었습니다!');
      router.push('/');
    } catch {
      addToast('error', '서버 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </Link>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">가입하고 100코인을 받으세요!</p>
        </CardHeader>
        <CardContent>
          {/* Welcome Bonus Banner */}
          <div className="mb-6 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">신규 가입 혜택</span>
            </div>
            <p className="mt-1 text-sm text-white/80">지금 가입하면 100코인이 즉시 지급됩니다!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder="이메일"
                className="pl-10"
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register('username')}
                type="text"
                placeholder="닉네임 (2-20자)"
                className="pl-10"
                error={errors.username?.message}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 (8자 이상)"
                className="pl-10 pr-10"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                className="pl-10 pr-10"
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <Link href="/terms" className="text-orange-500 hover:underline">
                    이용약관
                  </Link>
                  {' 및 '}
                  <Link href="/privacy" className="text-orange-500 hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다.
                </span>
              </label>
              {errors.agreeTerms ? (
                <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              회원가입
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-orange-500 hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
