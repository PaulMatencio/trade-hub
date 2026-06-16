'use client';


import { poppins } from '@/app/ui/fonts';
import {
  UserIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';


export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-neutral-900 px-6 pb-4 pt-8">
        <h1 className={`${poppins.className} mb-3 text-3xl text-white`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-12 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-sky-700 peer-focus:text-sky-700" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-12 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-sky-700 peer-focus:text-sky-700" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-sky-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-8 w-full" aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Log in'} <ArrowRightIcon className="ml-auto h-5 w-5 text-white" />
    </Button>
  );
}

