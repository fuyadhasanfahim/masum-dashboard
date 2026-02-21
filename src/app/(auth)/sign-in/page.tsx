import Signin from '@/components/auth/sign-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In - Dashboard | Fuyad Hasan Fahim',
    description: 'Sign in to your account',
};

export default function SigninPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Signin />
            </div>
        </div>
    );
}
