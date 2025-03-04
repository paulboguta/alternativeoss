'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Icons } from '@/components/icons';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { AD_PLACEMENT } from '@/config/ads';
import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import { AdSpot3 } from '../ads/ad-spot-3';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-dashed backdrop-blur">
      <div className="container-wrapper px-8">
        <div className="justify flex h-14 items-center">
          <div className="flex w-full items-center gap-8">
            <Link href="/" className="group flex cursor-pointer items-center">
              <Logo />
              <span className="font-bold">{websiteConfig.name}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-6">
              <Link
                prefetch={false}
                href="/alternatives"
                className="transition-hover text-sm text-white/75 hover:text-white/80"
              >
                Alternatives
              </Link>
              <Link
                prefetch={false}
                href="/categories"
                className="transition-hover text-sm text-white/75 hover:text-white/80"
              >
                Categories
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden w-full justify-end md:flex md:items-center md:gap-2">
            <AdSpot3
              adMetadata={{
                placement: 'header-ad',
                adName: AD_PLACEMENT.name,
                adVersion: AD_PLACEMENT.version,
              }}
            />
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
              <Link href={websiteConfig.links.github} target="_blank" rel="noreferrer">
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
              <Link href={websiteConfig.links.twitterPawel} target="_blank" rel="noreferrer">
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-muted/30 text-bg border-muted hover:bg-muted/50 h-6 border px-2.5 py-1"
            >
              <Link href="/submit" className={cn('hover:text-foreground/80 transition-colors')}>
                Submit
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white/80 hover:text-white md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-5 border-t border-dashed py-4 duration-200 md:hidden">
            <nav className="flex flex-col space-y-1">
              <div className="mb-4 flex">
                <AdSpot3
                  adMetadata={{
                    placement: 'header-ad',
                    adName: AD_PLACEMENT.name,
                    adVersion: AD_PLACEMENT.version,
                  }}
                />
              </div>
              <Link
                prefetch={false}
                href="/alternatives"
                className="transition-hover py-1 text-sm text-white/75 hover:text-white/80"
                onClick={toggleMenu}
              >
                Alternatives
              </Link>
              <Link
                prefetch={false}
                href="/categories"
                className="transition-hover py-2 text-sm text-white/75 hover:text-white/80"
                onClick={toggleMenu}
              >
                Categories
              </Link>

              <div className="flex items-center py-2">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
                  <Link href={websiteConfig.links.github} target="_blank" rel="noreferrer">
                    <Icons.gitHub className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
                  <Link href={websiteConfig.links.twitterPawel} target="_blank" rel="noreferrer">
                    <Icons.twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
              </div>

              <Button
                asChild
                variant="outline"
                className="bg-muted/30 text-bg border-muted hover:bg-muted/50 h-8 w-fit border px-2.5 py-1"
                onClick={toggleMenu}
              >
                <Link href="/submit" className={cn('hover:text-foreground/80 transition-colors')}>
                  Submit
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
