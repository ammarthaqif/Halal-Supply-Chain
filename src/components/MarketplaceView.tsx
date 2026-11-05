import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Thermometer, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  Calendar
} from 'lucide-react';
import { BatchItem } from '../types/blockchain';

interface MarketplaceViewProps {
  batches: BatchItem[];
  onSelectBatchForTrace: (batch: BatchItem) => void;
  onOpenEscrowModal: (batch: BatchItem) => void;
  onOpenMintModal: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  batches,
  onSelectBatchForTrace,
  onOpenEscrowModal,
  onOpenMintModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.originFarm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slaughterhouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.stateOrRegion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || b.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Banner for Malaysian F&B Restaurateurs */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 text-white">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/halal_restaurant_chef_1793807997665.jpg"
            alt="Malaysian Restaurant Chef inspecting halal beef cut"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 p-8 sm:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>MALAYSIA HALAL SUPPLY CHAIN CONSORTIUM</span>
            <span aria-hidden="true">·</span>
            <span>MS 1500:2019 & MS 2400 CERTIFIED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Transparent Halal Meat & Grocery Sourcing for Malaysian Restaurants
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Eliminate counterfeit meat cartel risks and untraceable supply chains. Procure directly from authenticated Malaysian farms and JAKIM-approved abattoirs with verifiable blockchain Merkle proofs and continuous cold-chain IoT telemetry.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectBatchForTrace(batches[0])}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Verify Sample Batch Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenMintModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg backdrop-blur-xs transition-colors border border-white/20"
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-300" />
              <span>Register Abattoir Consignment</span>
            </button>
          </div>
        </div>

        {/* 3-Column Proof Metric Strip */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 border-t border-white/10 bg-black/40 backdrop-blur-xs">
          <div className="p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-white/10">
            <p className="text-xs text-neutral-400">Halal Verification Protocol</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">MS 1500:2019</p>
            <p className="text-xs text-neutral-400 mt-1">Halkum & Mari' tracheal severance audit</p>
          </div>
          <div className="p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-white/10">
            <p className="text-xs text-neutral-400">Cold Chain Integrity</p>
            <p className="text-lg font-bold text-emerald-400 font-mono tabular-nums mt-0.5">MS 2400:2019</p>
            <p className="text-xs text-neutral-400 mt-1">Continuous IoT temperature logging</p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-xs text-neutral-400">Restaurant Escrow Protection</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">100% Guaranteed</p>
            <p className="text-xs text-neutral-400 mt-1">Funds locked until physical QR receipt</p>
          </div>
        </div>
      </div>

      {/* Sourcing & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Verified Halal Wholesale Lots
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Inspected abattoir consignments ready for restaurant delivery in Kuala Lumpur, Selangor, Penang, and Johor.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cut, abattoir, batch ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-neutral-900"
            />
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
          {[
            { id: 'ALL', label: 'All Consignments' },
            { id: 'BEEF', label: 'Fresh Halal Beef' },
            { id: 'POULTRY', label: 'Kampung Poultry' },
            { id: 'GROCERY', label: 'Halal Spices & Groceries' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-all shadow-xs flex flex-col"
          >
            {/* Card Header & Image */}
            <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
              <img
                src={batch.image}
                alt={batch.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-800 text-white rounded-md shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>JAKIM Halal Verified</span>
                </span>
                <span className="px-2 py-1 text-[11px] font-mono font-medium bg-neutral-900/80 text-white backdrop-blur-xs rounded-md">
                  Grade {batch.toyyibanRating}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono rounded-md flex items-center gap-1.5">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                <span className="tabular-nums font-semibold">{batch.currentTemperatureC}°C</span>
                <span className="text-[10px] text-neutral-300">
                  ({batch.storageType === 'FROZEN_NEG_18C' ? 'Frozen' : 'Chilled'})
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      Batch #{batch.batchNumber}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                      {batch.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-extrabold text-neutral-900 font-mono tabular-nums">
                      RM {batch.unitPriceMYR.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono">per kg wholesale</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed">
                  {batch.description}
                </p>

                {/* Trust Details Matrix */}
                <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-700 truncate">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate" title={batch.originFarm}>
                      {batch.originFarm}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700 truncate">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate" title={batch.slaughterhouse}>
                      {batch.slaughterhouse}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">JAKIM: {batch.jakimCertRef.slice(0, 18)}...</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>Slaughter: {batch.slaughterDate.split('T')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2.5">
                <button
                  onClick={() => onSelectBatchForTrace(batch)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Trace Blockchain History</span>
                </button>
                <button
                  onClick={() => onOpenEscrowModal(batch)}
                  className="py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Order with Escrow</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl p-8">
          <p className="text-sm font-semibold text-neutral-800">No matching Halal consignments found</p>
          <p className="text-xs text-neutral-500 mt-1">Try clearing your search query or selecting "All Consignments".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="mt-4 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
