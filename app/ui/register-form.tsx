'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { signUp } from '@/app/lib/actions';
import { poppins } from '@/app/ui/fonts';
import { UserIcon, KeyIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import Link from 'next/link';

export default function RegisterForm() {
  const [state, dispatch] = useFormState(signUp, {});

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-neutral-900 px-6 pb-4 pt-8">
        <h1 className={`${poppins.className} mb-3 text-3xl text-white`}>
          Create your account.
        </h1>
        <div className="w-full">
          {/* Name Field */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-12 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-sky-700" />
            </div>
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email Address
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
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-sky-700" />
            </div>
            {state?.errors?.email && (
              <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Password Field */}
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
                placeholder="Choose a password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-sky-700" />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 text-xs text-red-500">{state.errors.password[0]}</p>
            )}
          </div>
        </div>

        <RegisterButton />

        <div className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </form>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-8 w-full" aria-disabled={pending}>
      {pending ? 'Creating account...' : 'Sign Up'}{' '}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-white" />
    </Button>
  );
}
