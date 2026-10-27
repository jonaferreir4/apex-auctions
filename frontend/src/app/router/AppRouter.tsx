import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Header } from '@/widgets/header/Header';
import { VitrinePage } from '@/pages/vitrine/VitrinePage';
import { SearchPage } from '@/pages/search/SearchPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { LotRoomPage } from '@/pages/lot-room/LotRoomPage';
import { AuditPage } from '@/pages/audit/AuditPage';
import { ReceiptsPage } from '@/pages/receipts/ReceiptsPage';
import { ReceiptSharePage } from '@/pages/receipt-share/ReceiptSharePage';
import { AuctioneerPage } from '@/pages/auctioneer/AuctioneerPage';
import { WalletPage } from '@/pages/wallet/WalletPage';
import { Footer } from '@/widgets/footer/Footer';

function NotFoundPage() {
  return (
    <div className="py-12 px-8 text-center max-w-lg mx-auto my-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
      <h2 className="text-2xl font-extrabold mb-2 text-blue-600 dark:text-blue-400">
        404 — Página Não Encontrada
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition-colors"
      >
        Voltar para a Vitrine
      </Link>
    </div>
  );
}

export function AppRouter() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
              <Header user={user} onLogout={logout} />

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12 flex-1 w-full">
                <Routes>
                  <Route path="/" element={<VitrinePage />} />
                  <Route path="/busca" element={<SearchPage />} />
                  <Route path="/lote/:id" element={<LotRoomPage currentUser={user} />} />
                  <Route path="/auditoria/:lotId" element={<AuditPage />} />
                  <Route path="/audit/:lotId" element={<AuditPage />} />
                  <Route path="/arremates" element={<ReceiptsPage currentUser={user} />} />
                  <Route path="/recibo/:token" element={<ReceiptSharePage />} />
                  <Route path="/receipts/share/:token" element={<ReceiptSharePage />} />
                  <Route path="/painel" element={<AuctioneerPage currentUser={user} />} />
                  <Route path="/carteira" element={<WalletPage currentUser={user} />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
