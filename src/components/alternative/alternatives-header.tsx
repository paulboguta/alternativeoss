import { HomeIcon } from 'lucide-react';

import { Command } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export async function AlternativesHeader() {
  return (
    <div className="px-8">
      <Breadcrumb className="mt-4 hidden md:block">
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
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 py-12 lg:py-20">
        <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
          Discover Open Source Software Alternatives
        </h1>
        <p className="max-w-[550px] text-lg leading-tight font-light text-white">
          Find and compare the best open source alternatives to popular software tools.
        </p>
      </section>
    </div>
  );
}
