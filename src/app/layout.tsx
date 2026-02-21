import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Open_Sans, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fontSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontSerif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif',
});

const fontMono = IBM_Plex_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: 'Dashboard | Masum Kamal',
    description:
        'A personal dashboard built with Next.js, TypeScript, and Tailwind CSS. View your profile, manage your account, and explore the features of the dashboard.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
            >
                {children}
                <Toaster theme="light" position="bottom-right" />
            </body>
        </html>
    );
}
