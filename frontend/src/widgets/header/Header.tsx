import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { User } from '@/entities/user/types';
import { WalletDisplay } from '@/entities/wallet/ui/WalletDisplay';
import { useWalletQuery } from '@/entities/wallet/model/useWalletQueries';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { DepositFundsModal } from '@/features/deposit-funds/ui/DepositFundsModal';
import { Logo } from '@/shared/ui/Logo';
import { Award, LogOut, LayoutDashboard, Search, ChevronDown } from 'lucide-react';

export interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isBidder = user?.role === 'LICITANTE';
  const isAuctioneer = user?.role === 'LEILOEIRO';

  const { data: walletBalance } = useWalletQuery(isBidder);

  useEffect(() => {
    if (location.pathname === '/busca') {
      const q = searchParams.get('q') || '';
      setSearchValue(q);
    }
  }, [location.pathname, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/busca');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-17 gap-6">
          <div className="flex items-center shrink-0">
            <Link to="/" className="inline-flex items-center">
              <Logo className="h-7" />
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md flex items-center relative"
          >
            <span className="absolute left-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Procurar por lote, marca, modelo, artista..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
          </form>

          <nav className="flex items-center gap-4 shrink-0">
            {isAuctioneer && (
              <Link
                to="/painel"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <LayoutDashboard size={15} />
                Painel
              </Link>
            )}

            {isBidder && (
              <>
                <Link
                  to="/arremates"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Award size={16} className="text-amber-600" />
                  Meus Arremates
                </Link>

                <WalletDisplay
                  balance={walletBalance}
                  compact
                  onOpenDeposit={() => setIsDepositOpen(true)}
                />
              </>
            )}

            <div className="flex items-center gap-2.5 ml-1">
              <ThemeToggle />

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none text-left"
                  >
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-xs ${
                        user.role === 'LEILOEIRO' ? 'bg-amber-600' : 'bg-blue-600'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col pr-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {user.role === 'LEILOEIRO' ? 'Leiloeiro Oficial' : 'Licitante'}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </div>
                      </div>

                      {isAuctioneer && (
                        <Link
                          to="/painel"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <LayoutDashboard size={14} />
                          Painel do Leiloeiro
                        </Link>
                      )}

                      {isBidder && (
                        <Link
                          to="/arremates"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Award size={14} className="text-amber-600" />
                          Meus Arremates
                        </Link>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} />
                        Sair da conta
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap transition-colors cursor-pointer shadow-xs"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {isBidder && (
        <DepositFundsModal
          isOpen={isDepositOpen}
          onClose={() => setIsDepositOpen(false)}
        />
      )}
    </>
  );
}
