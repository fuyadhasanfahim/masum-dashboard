import { ChartAreaInteractive } from '@/components/root/dashboard/chart-area-interactive';
import { DataTable } from '@/components/root/dashboard/data-table';
import { SectionCards } from '@/components/root/dashboard/section-cards';
import data from '@/components/root/dashboard/data.json';
import { createMetadata } from '@/lib/metadata';

export async function generateMetadata() {
    return createMetadata('Dashboard');
}

export default function UserProfile() {
    return (
        <div className="space-y-4 md:space-y-6">
            <SectionCards />
            <ChartAreaInteractive />
            <DataTable data={data} />
        </div>
    );
}
