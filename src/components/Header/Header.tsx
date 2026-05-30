import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${active
            ? 'bg-gold-600/20 text-gold-400 border border-gold-600/30'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-game-950/90 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl leading-none">⚔️</span>
          <span className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors duration-200">
            Rota<span className="text-gold-400">Master</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLink('/', 'Criar Rotação')}
          {navLink('/ranking', 'Ranking')}
        </nav>
      </div>
    </header>
  );
}
