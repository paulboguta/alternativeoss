import { COUNTRY_VISITORS, DAYS_SINCE_LAUNCH } from '@/config/ads';
import { StatCard } from './stat-card';

export function Stats() {
  return (
    <>
      <section className="max-w-5xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Days Since Launch"
            value={DAYS_SINCE_LAUNCH.toString()}
            description="We're just getting started"
          />
          <StatCard
            title="Daily Visitors"
            value="600+"
            description="Unique visitors per day (7-day avg)"
          />
          <StatCard
            title="Monthly Reach"
            value="5,000+"
            description={`Unique visitors this month (Launch ${DAYS_SINCE_LAUNCH} days ago)`}
          />
        </div>
      </section>

      {/* Country Visitors Section */}
      <section className="max-w-5xl pb-8">
        <div className="border-border/50 rounded-md border-b border-dashed p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {COUNTRY_VISITORS.map(item => (
              <div key={item.country} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.country}</span>
                  <span className="text-muted-foreground text-xs">{item.percentage}%</span>
                </div>
                <div className="bg-muted/30 mt-1 h-2 w-full rounded-sm">
                  <div
                    className="bg-primary/80 h-full rounded-sm"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
