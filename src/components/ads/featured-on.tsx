import { OptimizedImage } from '@/components/ui/optimized-image';
import { FEAUTRED_ON } from '@/config/ads';

export function FeaturedOn() {
  return (
    <section className="max-w-5xl pb-16">
      <h2 className="mb-6 text-xl font-semibold">Featured On</h2>
      <div className="border-border/50 flex gap-2 rounded-md border border-dashed p-6">
        {FEAUTRED_ON.map(item => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary w-fit"
          >
            <OptimizedImage
              src={item.logo}
              alt={item.name}
              width={100}
              height={50}
              className="rounded-md opacity-60 transition-opacity hover:opacity-90"
              isIcon
            />
          </a>
        ))}
      </div>
    </section>
  );
}
