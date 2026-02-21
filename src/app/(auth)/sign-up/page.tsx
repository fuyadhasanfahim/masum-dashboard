import Signup from '@/components/auth/sign-up';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up - Dashboard | Masum Kamal',
    description: 'Sign up to your account',
};

export default function SignupPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Signup />
            </div>
        </div>
    );
}
