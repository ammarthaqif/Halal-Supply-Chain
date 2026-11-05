import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  Thermometer, 
  MapPin, 
  DollarSign, 
  FileCode2, 
  RefreshCw, 
  ArrowRight,
  ExternalLink,
  Building,
  RotateCcw
} from 'lucide-react';
import { EscrowContract } from '../types/blockchain';

interface SmartContractDashboardViewProps {
  escrows: EscrowContract[];
  onUpdateEscrowStatus: (
    contractId: string, 
    newStatus: 'LOCKED_IN_ESCROW' | 'RELEASED_TO_SUPPLIER' | 'REFUNDED_BREACH', 
    metadata?: { releaseTxHash?: string; breachReason?: string; currentTempC?: number }
  ) => void;
  onNavigateToTrace: (batchNumber: string) => void;
}

export const SmartContractDashboardView: React.FC<SmartContractDashboardViewProps> = ({
  escrows,
  onUpdateEscrowStatus,
  onNavigateToTrace,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedContractForInspect, setSelectedContractForInspect] = useState<EscrowContract | null>(null);

  // Financial calculations
  const totalLocked = escrows
    .filter((e) => e.status === 'LOCKED_IN_ESCROW')
    .reduce((sum, e) => sum + e.totalMYR, 0);

  const totalReleased = escrows
    .filter((e) => e.status === 'RELEASED_TO_SUPPLIER')
    .reduce((sum, e) => sum + e.totalMYR, 0);

  const activeCount = escrows.filter((e) => e.status === 'LOCKED_IN_ESCROW').length;
  const releasedCount = escrows.filter((e) => e.status === 'RELEASED_TO_SUPPLIER').length;

  const filteredEscrows = escrows.filter((e) => {
    if (filterStatus === 'ALL') return true;
    return e.status === filterStatus;
  });

  const handleSimulateSuccessfulRelease = (contract: EscrowContract) => {
    const mockTx = '0x' + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    onUpdateEscrowStatus(contract.id, 'RELEASED_TO_SUPPLIER', {
      releaseTxHash: mockTx,
    });
  };

  const handleSimulateThermalBreach = (contract: EscrowContract) => {
    onUpdateEscrowStatus(contract.id, 'REFUNDED_BREACH', {
      currentTempC: 9.4,
      breachReason: 'Cold-chain invariant breach: Cargo temperature spiked to +9.4°C exceeding maximum permitted threshold (+4.0°C) for chilled beef.',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Overview Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                AUTONOMOUS SMART CONTRACT ESCROWS
              </span>
              <span className="text-xs text-neutral-500">
                MS 2400:2019 Halal Supply Chain Protocol
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
              Smart Contract Escrow Dashboard
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed max-w-2xl">
              Financial and compliance safety mechanism for Malaysian restaurant owners. Restaurant procurement funds are locked in an autonomous vault and released to abattoirs only when cold-chain invariants and carton QR receipts are fulfilled.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Zero Counterfeit Meat Payouts</span>
            </span>
          </div>
        </div>

        {/* 4-Column KPI Financial & Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 text-xs">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              TOTAL FUNDS LOCKED IN ESCROW
            </span>
            <p className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums mt-1">
              RM {totalLocked.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              {activeCount} Shipments Protected
            </span>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              DISBURSED TO ABATTOIRS
            </span>
            <p className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
              RM {totalReleased.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-neutral-600 font-medium mt-0.5 block">
              {releasedCount} Completed Payouts
            </span>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              RELEASE TRIGGER CONDITIONS
            </span>
            <p className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums mt-1">
              4 Invariants
            </p>
            <span className="text-[11px] text-neutral-600 font-medium mt-0.5 block">
              GPS + Temp + Seal + QR Scan
            </span>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              FRAUD PROTECTION STATUS
            </span>
            <p className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums mt-1">
              100% Active
            </p>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              Auto-Refund on Thermal Breach
            </span>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-neutral-100 rounded-lg border border-neutral-200">
          {[
            { id: 'ALL', label: `All Escrows (${escrows.length})` },
            { id: 'LOCKED_IN_ESCROW', label: `Locked in Escrow (${activeCount})` },
            { id: 'RELEASED_TO_SUPPLIER', label: `Released to Producers (${releasedCount})` },
            { id: 'REFUNDED_BREACH', label: `Refunded / Breach` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-500 self-center sm:self-auto">
          Showing {filteredEscrows.length} Smart Contract Records
        </span>
      </div>

      {/* Escrow Contract Cards Grid */}
      <div className="space-y-4">
        {filteredEscrows.map((contract) => {
          const isLocked = contract.status === 'LOCKED_IN_ESCROW';
          const isReleased = contract.status === 'RELEASED_TO_SUPPLIER';
          const isBreached = contract.status === 'REFUNDED_BREACH';

          return (
            <div
              key={contract.id}
              className={`bg-white border rounded-xl p-5 sm:p-6 shadow-xs transition-all space-y-5 ${
                isBreached
                  ? 'border-red-300 bg-red-50/20'
                  : isReleased
                  ? 'border-neutral-200 bg-emerald-50/10'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {/* Header: Contract ID, Restaurant & Amount */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {contract.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isLocked
                          ? 'bg-amber-100 text-amber-900'
                          : isReleased
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {isLocked ? 'LOCKED IN ESCROW' : isReleased ? 'RELEASED TO PRODUCER' : 'REFUNDED (BREACH)'}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Created: {contract.createdAt.split('T')[0]}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900">
                    {contract.productName} ({contract.quantityKg} kg)
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">ESCROW VAULT VALUE</span>
                  <p className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    RM {contract.totalMYR.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Transit & Parties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] font-mono uppercase block">BUYER (RESTAURANT)</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{contract.restaurantName}</p>
                  <p className="text-neutral-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>{contract.destinationLocation}</span>
                  </p>
                </div>

                <div>
                  <span className="text-neutral-500 text-[10px] font-mono uppercase block">BENEFICIARY (CERTIFIED RPA)</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{contract.supplierName}</p>
                  <p className="text-neutral-500 text-[11px] font-mono mt-0.5">
                    Batch: {contract.batchId}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-500 text-[10px] font-mono uppercase block">TRANSIT TELEMETRY</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Thermometer className={`w-4 h-4 ${contract.currentTempC > contract.conditions.maxTempAllowedC ? 'text-red-600' : 'text-cyan-600'}`} />
                    <span className="font-mono font-bold text-neutral-900 tabular-nums">
                      {contract.currentTempC}°C
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      (Limit: ≤ {contract.conditions.maxTempAllowedC}°C)
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                    Seal: {contract.conditions.sealMustMatch}
                  </span>
                </div>
              </div>

              {/* AUTOMATED RELEASE TRIGGERS (THE INVARIANTS) */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 tracking-wider">
                    Smart Contract Release Triggers (MS 2400 Protocol)
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Autonomous Condition Matrix
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  {/* Trigger 1: Geofence */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    contract.triggers.geofenceVerified
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-white border-neutral-200 text-neutral-700'
                  }`}>
                    {contract.triggers.geofenceVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">1. Kitchen Geofence</p>
                      <p className="text-[10px] opacity-80">
                        {contract.triggers.geofenceVerified ? 'Arrived at destination' : 'En route in transit'}
                      </p>
                    </div>
                  </div>

                  {/* Trigger 2: Cold Chain */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    contract.triggers.tempCompliant
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}>
                    {contract.triggers.tempCompliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">2. Cold-Chain Invariant</p>
                      <p className="text-[10px] opacity-80">
                        {contract.triggers.tempCompliant ? 'Temperature compliant' : 'Thermal breach detected!'}
                      </p>
                    </div>
                  </div>

                  {/* Trigger 3: Tamper Seal */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    contract.triggers.tamperSealVerified
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-white border-neutral-200 text-neutral-700'
                  }`}>
                    {contract.triggers.tamperSealVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">3. Smart Seal Verified</p>
                      <p className="text-[10px] opacity-80">
                        {contract.triggers.tamperSealVerified ? 'Seal unbroken' : 'Pending inspection'}
                      </p>
                    </div>
                  </div>

                  {/* Trigger 4: Chef Acceptance */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    contract.triggers.chefSignedOff
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-white border-neutral-200 text-neutral-700'
                  }`}>
                    {contract.triggers.chefSignedOff ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">4. Chef Receipt QR Scan</p>
                      <p className="text-[10px] opacity-80">
                        {contract.triggers.chefSignedOff ? 'Receipt confirmed' : 'Awaiting kitchen scan'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Released or Breached Banners */}
                {isReleased && contract.releaseTxHash && (
                  <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Automated Smart Contract Settlement Executed:</span>
                      <span className="text-[11px] block text-emerald-900 font-mono">
                        Funds released to {contract.supplierName}. Tx: {contract.releaseTxHash.slice(0, 24)}...
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800">Verified On-Chain</span>
                  </div>
                )}

                {isBreached && contract.breachReason && (
                  <div className="p-2.5 bg-red-100/70 border border-red-300 rounded-lg text-xs text-red-950">
                    <p className="font-bold text-red-900">Smart Contract Guardrail Triggered — Payout Blocked:</p>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">{contract.breachReason}</p>
                    <p className="text-[10px] font-mono text-red-900 font-bold mt-1">
                      Full refund of RM {contract.totalMYR.toFixed(2)} automatically returned to {contract.restaurantName}.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons & Simulator Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToTrace(contract.batchId)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Batch Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedContractForInspect(contract)}
                    className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg border border-neutral-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>View Contract Code</span>
                  </button>
                </div>

                {/* Simulator controls for demonstrating release vs breach */}
                {isLocked && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateSuccessfulRelease(contract)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                      title="Simulate kitchen arrival and successful payout release"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Simulate QR Release</span>
                    </button>

                    <button
                      onClick={() => handleSimulateThermalBreach(contract)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      title="Simulate temperature excursion triggering automated restaurant refund"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Simulate Temp Breach</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEscrows.length === 0 && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl p-8">
          <p className="text-sm font-semibold text-neutral-800">No matching escrow contracts found</p>
          <p className="text-xs text-neutral-500 mt-1">Try switching to "All Escrows" or placing a new order via the Marketplace.</p>
          <button
            onClick={() => setFilterStatus('ALL')}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-md"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Contract Code & Invariants Modal */}
      {selectedContractForInspect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Smart Contract Invariants ({selectedContractForInspect.id})
                  </h3>
                  <p className="text-[11px] text-neutral-500">Autonomous Escrow Vault Specification</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContractForInspect(null)}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Pseudocode / Logic Specification */}
            <div className="p-4 bg-neutral-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 space-y-2">
              <p className="text-neutral-500">// SPDX-License-Identifier: Apache-2.0</p>
              <p className="text-neutral-500">// HalalChain Autonomous Escrow Settlement Engine</p>
              <p><span className="text-purple-400">contract</span> <span className="text-yellow-300">HalalEscrowSettlement</span> &#123;</p>
              <p className="pl-4">uint256 <span className="text-blue-400">lockedAmountMYR</span> = {selectedContractForInspect.totalMYR};</p>
              <p className="pl-4">address <span className="text-blue-400">buyerRestaurant</span> = 0xRestaurantAddress;</p>
              <p className="pl-4">address <span className="text-blue-400">beneficiaryProducer</span> = 0xAbattoirAddress;</p>
              <p className="pl-4">int8 <span className="text-blue-400">maxTempAllowedC</span> = {selectedContractForInspect.conditions.maxTempAllowedC};</p>
              <p className="pl-4 mt-2 text-neutral-400">// Invariant evaluation on delivery QR scan:</p>
              <p className="pl-4"><span className="text-purple-400">function</span> <span className="text-yellow-300">evaluateReleaseTriggers</span>() &#123;</p>
              <p className="pl-8"><span className="text-purple-400">require</span>(telemetry.maxTemp &lt;= maxTempAllowedC, <span className="text-emerald-300">"BREACH: Auto-refund"</span>);</p>
              <p className="pl-8"><span className="text-purple-400">require</span>(qrScan.verified == <span className="text-cyan-300">true</span>, <span className="text-emerald-300">"Awaiting kitchen receipt"</span>);</p>
              <p className="pl-8"><span className="text-purple-400">require</span>(smartSeal.matched == <span className="text-cyan-300">true</span>, <span className="text-emerald-300">"Seal broken"</span>);</p>
              <p className="pl-8 mt-1 text-emerald-300">disburse(beneficiaryProducer, lockedAmountMYR);</p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
            </div>

            <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <p className="font-semibold text-neutral-900">Invariant Safety Guarantee:</p>
              <p className="mt-0.5">
                Funds in this contract can never be released without an unbroken temperature history and a physical cryptographic receipt scan at {selectedContractForInspect.destinationLocation}.
              </p>
            </div>

            <button
              onClick={() => setSelectedContractForInspect(null)}
              className="w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
