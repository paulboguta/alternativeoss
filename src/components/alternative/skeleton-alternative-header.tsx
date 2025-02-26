import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Command, HomeIcon } from 'lucide-react';
import { EmailCapture } from '../email/email-capture';
import { Skeleton } from '../ui/skeleton';

export function AlternativeHeaderSkeleton() {
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
            <BreadcrumbPage>
              <Skeleton className="h-5 w-24" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-sm" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-7 w-36" />
        </div>
        <EmailCapture />
      </section>
    </>
  );
}
