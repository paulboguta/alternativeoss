import { EmailCapture } from '@/components/email/email-capture';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Category } from '@/db/types';
import { Command, HomeIcon } from 'lucide-react';

export async function CategoryHeader({ category }: { category: Category }) {
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
            <BreadcrumbLink href="/categories" className="inline-flex items-center gap-1.5">
              <Command size={16} aria-hidden="true" />
              Project Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex items-end gap-1">
          <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">{category.name}</h1>
          <span className="text-muted-foreground text-xl font-medium">
            Open Source Alternatives
          </span>
        </div>
        <EmailCapture />
      </section>
    </>
  );
}
