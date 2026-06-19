'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import {
  createInvoiceUseCase,
  updateInvoiceUseCase,
  deleteInvoiceUseCase,
  registerUserUseCase,
} from '@/src/infrastructure/di/container';

// Define the form schema using Zod for validation
const FormSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['awaiting', 'fulfilled']),
  date: z.string(),
});

// Define specific schemas for creating invoices
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    sellerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    sellerId: formData.get('sellerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { sellerId, amount, status } = validatedFields.data;

  try {
    await createInvoiceUseCase.execute({
      sellerId,
      amount,
      status,
    });
  } catch (error) {
    console.error('Database Error: Failed to Create Invoice.', error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await deleteInvoiceUseCase.execute(id);
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error: Failed to Delete Invoice.', error);
    throw new Error('Failed to delete invoice.');
  }
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    sellerId: formData.get('sellerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { sellerId, amount, status } = validatedFields.data;

  try {
    await updateInvoiceUseCase.execute(id, {
      sellerId,
      amount,
      status,
    });
  } catch (error) {
    console.error('Database Error: Failed to Update Invoice.', error);
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signUp(prevState: RegisterState, formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create account. Please fix the errors below.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await registerUserUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error: any) {
    console.error('Database Error: Failed to register user.', error);
    return {
      message: error.message || 'Database error. Failed to create account.',
    };
  }

  redirect('/login');
}
