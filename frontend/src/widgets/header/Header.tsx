import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { User } from '@/entities/user/types';
import { WalletDisplay } from '@/entities/wallet/ui/WalletDisplay';
import { useWalletQuery } from '@/entities/wallet/model/useWalletQueries';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { DepositFundsModal } from '@/features/deposit-funds/ui/DepositFundsModal';
import { Logo } from '@/shared/ui/Logo';
import {
  Award,
  LogOut,
  LayoutDashboard,
  Search,
  ChevronDown,
  Menu,
  X,
  Wallet,
  LogIn,
  Home
} from 'lucide-react';

export interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputMobileRef = useRef<HTMLInputElement>(null);
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
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputMobileRef.current) {
      searchInputMobileRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileSearchOpen(false);
    if (searchValue.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/busca');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3 sm:gap-6">
          <div className="flex items-center shrink-0">
            <Link to="/" className="inline-flex items-center focus:outline-none">
              <Logo className="h-6 sm:h-7" />
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <span className="absolute left-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar por lote, marca, modelo, artista..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
          </form>

          <nav className="hidden md:flex items-center gap-3 shrink-0">
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
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold inline-flex items-center justify-center whitespace-nowrap transition-colors cursor-pointer shadow-xs"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </nav>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="w-9 h-9 rounded-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Buscar lotes"
              aria-label="Buscar"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1.5 py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Menu de navegação"
            >
              {user && (
                <div
                  className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center text-[10px] ${
                    user.role === 'LEILOEIRO' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isMobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputMobileRef}
                  type="text"
                  placeholder="Buscar por lote, marca, modelo..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>
              <button
                type="submit"
                className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shrink-0 cursor-pointer"
              >
                Buscar
              </button>
            </form>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3.5 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Aparência (Claro / Escuro)
              </span>
              <ThemeToggle />
            </div>

            {user ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <div
                  className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shrink-0 ${
                    user.role === 'LEILOEIRO' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {user.role === 'LEILOEIRO' ? 'Leiloeiro Oficial' : 'Licitante Ativo'}
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <LogIn size={16} />
                Entrar / Cadastrar
              </button>
            )}

            {isBidder && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Wallet size={14} className="text-blue-600" />
                    Carteira Virtual
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDepositOpen(true);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    + Depositar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Disponível</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      R$ {walletBalance?.availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Comprometido</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">
                      R$ {walletBalance?.committedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1 pt-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Home size={16} className="text-slate-500" />
                Início (Vitrine de Lotes)
              </Link>

              <Link
                to="/busca"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Search size={16} className="text-slate-500" />
                Catálogo & Busca de Lotes
              </Link>

              {isAuctioneer && (
                <Link
                  to="/painel"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Painel do Leiloeiro
                </Link>
              )}

              {isBidder && (
                <Link
                  to="/arremates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Award size={16} className="text-amber-600" />
                  Meus Arremates & Comprovantes
                </Link>
              )}
            </div>

            {user && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sair da Conta
                </button>
              </div>
            )}
          </div>
        )}
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
