'use client';
import { cn } from '@/lib/utils';
import { AnalyticsEvents } from '@/types/analytics';
import { usePlausible } from 'next-plausible';
import { Button } from '../ui/button';

export function GetStartedButton({
  className,
  children,
  variant,
}: {
  className?: string;
  children: React.ReactNode;
  variant: 'default' | 'secondary';
}) {
  const plausible = usePlausible<AnalyticsEvents>();

  return (
    <Button
      variant={variant}
      onClick={() =>
        plausible('advertising-get-started', {
          props: {
            placement: 'pricing-card',
          },
        })
      }
      className={className}
      asChild
    >
      {children}
    </Button>
  );
}

export function ClickAdButton({
  className,
  children,
  eventPayload,
  eventType,
}: {
  className?: string;
  children: React.ReactNode;
  eventPayload: AnalyticsEvents[keyof AnalyticsEvents];
  eventType: keyof AnalyticsEvents;
}) {
  const plausible = usePlausible<AnalyticsEvents>();

  return (
    <button
      className={cn(className, 'w-fit text-start')}
      onClick={() =>
        plausible(eventType, {
          props: eventPayload,
        })
      }
    >
      {children}
    </button>
  );
}
