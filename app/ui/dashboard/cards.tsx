import {
  BanknotesIcon,
  ClockIcon,
  UsersIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { rubik } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { poppins } from '@/app/ui/fonts';

const iconMap = {
  earned: BanknotesIcon,
  sellers: UsersIcon,
  awaiting: ClockIcon,
  invoices: ClipboardDocumentIcon,
};

export default async function CardWrapper() {
  let cardData: any;
  try {
    cardData = await fetchCardData();
  } catch (error) {
    console.error('Failed to fetch card data:', error);
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2
          className={`${poppins.className} mb-4 text-xl text-white md:text-2xl`}
        >
          Card Data
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-neutral-700 p-4">
          <div className="bg-neutral-00 px-6">
            <p className="text-red-400 font-medium">Failed to load card data.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Card title="Earned" value={cardData.totalFulfilledInvoices} type="earned" />
      <Card title="In Progress" value={cardData.totalAwaitingInvoices} type="awaiting" />
      <Card title="All Invoices" value={cardData.numberOfInvoices} type="invoices" />
      <Card title="Total Sellers" value={cardData.numberOfSellers} type="sellers" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'sellers' | 'awaiting' | 'earned';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-neutral-700 p-2 shadow-sm">
      <div className="flex bg-neutral-700 p-4">
        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
        <h3 className="ml-2 text-sm font-medium text-white">{title}</h3>
      </div>
      <p
        className={`${rubik.className}
          truncate rounded-xl bg-sky-700 px-4 py-8 text-center text-2xl text-white`}
      >
        {value}
      </p>
    </div>
  );
}
