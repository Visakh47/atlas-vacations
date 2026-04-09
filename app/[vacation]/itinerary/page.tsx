'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useItinerary } from '@/hooks/useItinerary';
import { useVacation } from '@/hooks/useVacations';
import { useCategories } from '@/hooks/useCategories';
import { DayTabs } from '@/components/itinerary/DayTabs';
import { DaySidebar } from '@/components/itinerary/DaySidebar';
import { DayView } from '@/components/itinerary/DayView';
import { CurrencyToggle } from '@/components/budget/CurrencyToggle';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { CURRENCY_CONVERSIONS } from '@/lib/currency-utils';

interface PageProps {
  params: Promise<{ vacation: string }>;
}

export default function ItineraryPage({ params }: PageProps) {
  const { vacation: vacationId } = use(params);
  const { vacation } = useVacation(vacationId);
  const { days, loading: itinLoading } = useItinerary(vacationId);
  const { categories, loading: catLoading } = useCategories();
  const [activeDay, setActiveDay] = useState(1);
  const [showNative, setShowNative] = useState(false); // false = INR (default)

  if (itinLoading || catLoading) return <PageLoader />;

  const currencyCode = vacation?.currency_code ?? 'IDR';
  const currencySymbol = vacation?.currency_symbol ?? 'Rp';
  const conversion = CURRENCY_CONVERSIONS[currencyCode];
  const conversionRate = !showNative && conversion ? conversion.rate : 1;
  const displaySymbol = !showNative && conversion ? conversion.symbol : currencySymbol;
  const displayCode = !showNative && conversion ? conversion.code : currencyCode;
  const currentDay = days.find((d) => d.day_number === activeDay) ?? days[0];

  return (
    <div style={{ backgroundColor: 'var(--a-bg)' }} className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--a-border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs" style={{ color: 'var(--a-muted)' }}>
              <Link href={`/${vacationId}`} className="hover:underline">{vacation?.name ?? vacationId}</Link>
              <span style={{ color: 'var(--a-dim)' }}>→</span>
              <span style={{ color: 'var(--a-dim)' }}>Itinerary</span>
            </div>
            <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--a-text)' }}>
              Itinerary
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {conversion && (
              <CurrencyToggle
                nativeCode={currencyCode}
                nativeSymbol={currencySymbol}
                showNative={showNative}
                onToggle={() => setShowNative(!showNative)}
              />
            )}
            <Link
              href={`/${vacationId}/budget`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-[var(--a-border2)]"
              style={{ color: 'var(--a-muted)', borderColor: 'var(--a-border)' }}
            >
              Budget →
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal day tabs */}
      <div className="lg:hidden flex-shrink-0">
        <DayTabs
          days={days}
          activeDay={activeDay}
          onSelect={setActiveDay}
          currencySymbol={displaySymbol}
          conversionRate={conversionRate}
        />
      </div>

      {/* Body: sidebar + scrollable content */}
      <div className="flex flex-1" style={{ minHeight: 0 }}>

        {/* Desktop left sidebar */}
        <DaySidebar
          days={days}
          activeDay={activeDay}
          onSelect={setActiveDay}
          currencySymbol={displaySymbol}
          conversionRate={conversionRate}
        />

        {/* Day content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {currentDay && (
            <DayView
              day={currentDay}
              categories={categories}
              currencyCode={displayCode}
              currencySymbol={displaySymbol}
              conversionRate={conversionRate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
