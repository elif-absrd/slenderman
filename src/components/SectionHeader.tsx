interface SectionHeaderProps {
  num: string;
  title: string;
}

export default function SectionHeader({ num, title }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-6 mb-10">
      <span className="text-[11px] text-text-muted tracking-widest">{num}</span>
      <span className="text-2xl font-bold tracking-tight text-white">{title}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
