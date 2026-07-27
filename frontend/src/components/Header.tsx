import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 shrink-0 bg-header-bg border-b border-header-bg shadow-sm z-10 px-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-white/80 hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-white text-xl font-bold tracking-widest">
          G-SCORES
        </h1>
      </div>

      <span className="hidden lg:block text-white/90 text-sm font-medium tracking-wide">
        Hệ thống tra cứu điểm THPT
      </span>
    </header>
  );
}
