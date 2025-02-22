import { Header } from "@/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <div className="border-grid flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col container-wrapper">
          {children}
        </main>
        {/* <SiteFooter /> */}
      </div>
    </div>
  );
}
