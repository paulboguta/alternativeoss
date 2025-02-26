import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-svh flex-col">
      <div className="border-grid flex flex-1 flex-col">
        <Header />
        <main className="container-wrapper flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
