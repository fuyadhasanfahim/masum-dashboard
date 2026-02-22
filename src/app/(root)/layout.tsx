import { AppSidebar } from '@/components/shared/sidebar/app-sidebar';
import { SiteHeader } from '@/components/shared/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Fuyad Hasan Fahim',
    description:
        'A personal dashboard built with Next.js, TypeScript, and Tailwind CSS. View your profile, manage your account, and explore the features of the dashboard.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
