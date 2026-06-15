
import { Card } from '@/app/ui/dashboard/cards';
import IncomeChart from '@/app/ui/dashboard/income-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { poppins } from '@/app/ui/fonts';
import { fetchIncome, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';

export default async function Page() {
    try {
        const income = await fetchIncome();
        const latestInvoices = await fetchLatestInvoices();
        const cardData = await fetchCardData();
        return (
            <main className="rounded-xl bg-neutral-900 p-6">
                <h1
                    className={`${poppins.className} mb-4 text-center text-xl text-white md:text-3xl`}
                >
                    Dashboard
                </h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card title="Earned" value={cardData.totalFulfilledInvoices} type="earned" />
                    <Card
                        title="In Progress"
                        value={cardData.totalAwaitingInvoices}
                        type="awaiting"
                    />
                    <Card title="All Invoices" value={cardData.numberOfInvoices} type="invoices" />
                    <Card title="Total Sellers" value={cardData.numberOfSellers} type="sellers" />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                    <IncomeChart income={income} />
                    <LatestInvoices latestInvoices={latestInvoices} />
                </div>
            </main>
        );
    } catch (error) {
        console.error('Failed to fetch income:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return (
            <main className="rounded-xl bg-neutral-900 p-6">
                <h1
                    className={`${poppins.className} mb-4 text-center text-xl text-white md:text-3xl`}
                >
                    Dashboard
                </h1>
                <div className="rounded-xl bg-neutral-800 p-6 text-center">
                    <p className="text-red-500 font-medium">{errorMessage}</p>
                </div>
            </main>
        );
    }
}



