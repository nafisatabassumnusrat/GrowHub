import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register - GrowHub',
  description: 'Create an account to join the hyperlocal community.',
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto flex items-center justify-center pb-4 text-3xl font-extrabold tracking-tight text-foreground font-display">
            GrowHub
          </Link>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground font-medium">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
