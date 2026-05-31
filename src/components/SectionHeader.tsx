interface SectionHeaderProps {
  num: string;
  title: string;
}

export default function SectionHeader({ num, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-[10px] text-text-muted tracking-widest">{num}</span>
      <span className="text-2xl font-bold tracking-tight text-white">{title}</span>
      <span
        className="flex-1 h-px bg-[#1e1e1e]"
        aria-hidden="true"
      />
    </div>
  );
}
