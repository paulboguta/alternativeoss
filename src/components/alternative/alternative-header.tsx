import { EmailCapture } from '@/components/email/email-capture';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Alternative } from '@/db/types';
import { getFaviconUrl } from '@/lib/favicon';
import { Command, HomeIcon } from 'lucide-react';
import { OptimizedImage } from '../ui/optimized-image';

export async function AlternativeHeader({ alternative }: { alternative: Alternative }) {
  return (
    <>
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
              <HomeIcon size={16} aria-hidden="true" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/alternatives" className="inline-flex items-center gap-1.5">
              <Command size={16} aria-hidden="true" />
              Alternatives
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{alternative.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex items-end gap-2">
          <OptimizedImage
            isIcon
            src={getFaviconUrl(alternative.url || '')}
            alt={alternative.name}
            width={32}
            height={32}
          />
          <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">{alternative.name}</h1>
          <span className="text-muted-foreground text-xl font-medium">
            Open Source Alternatives
          </span>
        </div>
        <EmailCapture />
      </section>
    </>
  );
}
