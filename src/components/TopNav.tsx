import React from 'react';
import { ShieldCheck, ScanLine, ShoppingBag, Layers, PlusCircle, Sparkles } from 'lucide-react';

export type ActiveTab = 'MARKETPLACE' | 'TRACE_BATCH' | 'BLOCKCHAIN_EXPLORER' | 'PRODUCER_MINT' | 'AI_AUDITOR';

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickScan: () => void;
  cartCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onQuickScan,
  cartCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('MARKETPLACE')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900">
            HalalChain Malaysia
          </span>
        </div>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'MARKETPLACE'
                ? 'text-emerald-700 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('TRACE_BATCH')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'TRACE_BATCH'
                ? 'text-emerald-700 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Trace Batch (QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('BLOCKCHAIN_EXPLORER')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'BLOCKCHAIN_EXPLORER'
                ? 'text-emerald-700 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Blockchain Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('PRODUCER_MINT')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'PRODUCER_MINT'
                ? 'text-emerald-700 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint Halal Batch</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_AUDITOR')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'AI_AUDITOR'
                ? 'text-emerald-700 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Halal Auditor</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickScan}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan Batch QR</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-100 px-2 py-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('MARKETPLACE')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'MARKETPLACE' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
        >
          Market
        </button>
        <button
          onClick={() => setActiveTab('TRACE_BATCH')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'TRACE_BATCH' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
        >
          Trace QR
        </button>
        <button
          onClick={() => setActiveTab('BLOCKCHAIN_EXPLORER')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'BLOCKCHAIN_EXPLORER' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
        >
          Ledger
        </button>
        <button
          onClick={() => setActiveTab('PRODUCER_MINT')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'PRODUCER_MINT' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
        >
          Mint
        </button>
        <button
          onClick={() => setActiveTab('AI_AUDITOR')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'AI_AUDITOR' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
        >
          AI Audit
        </button>
      </div>
    </header>
  );
};
