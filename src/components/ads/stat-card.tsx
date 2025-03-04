type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="border-border/50 bg-card/30 rounded-none border border-dashed p-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium tracking-wide uppercase">{title}</h3>
      </div>
      <div>
        <p className="font-mono text-3xl font-bold">{value}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>
    </div>
  );
}
