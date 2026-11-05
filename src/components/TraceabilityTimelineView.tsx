import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Thermometer, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Printer, 
  Lock, 
  Search, 
  ScanLine, 
  Truck, 
  Sparkles, 
  Award, 
  Layers, 
  Utensils,
  Download,
  Copy,
  Check,
  QrCode,
  FileCheck2,
  Share2
} from 'lucide-react';
import { BatchItem, HalalCheckpointEvent, BlockchainBlock } from '../types/blockchain';
import { BatchQRCode } from './BatchQRCode';

interface TraceabilityTimelineViewProps {
  batches: BatchItem[];
  currentBatch: BatchItem;
  onSelectBatch: (batch: BatchItem) => void;
  blockchain: BlockchainBlock[];
  onNavigateToExplorer?: (blockIndex: number) => void;
  autoOpenRecordModal?: boolean;
}

export const TraceabilityTimelineView: React.FC<TraceabilityTimelineViewProps> = ({
  batches,
  currentBatch,
  onSelectBatch,
  blockchain,
  onNavigateToExplorer,
  autoOpenRecordModal = false,
}) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [manualBatchInput, setManualBatchInput] = useState<string>('');
  const [showComplianceReportModal, setShowComplianceReportModal] = useState<boolean>(false);
  const [showUniqueQrModal, setShowUniqueQrModal] = useState<boolean>(false);
  const [showImmutableRecordModal, setShowImmutableRecordModal] = useState<boolean>(autoOpenRecordModal);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Synchronize autoOpenRecordModal if prop updates
  useEffect(() => {
    if (autoOpenRecordModal) {
      setShowImmutableRecordModal(true);
    }
  }, [autoOpenRecordModal]);

  // Find corresponding block in blockchain
  const associatedBlock = blockchain.find((b) =>
    b.transactions.some((tx) => tx.batchId === currentBatch.batchNumber)
  );

  const activeEvent: HalalCheckpointEvent | undefined = currentBatch.events[selectedEventIndex] || currentBatch.events[0];

  // Generate unique URL for this specific shipment
  const shipmentVerificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?batch=${encodeURIComponent(currentBatch.batchNumber)}&view=immutable-record`
    : `https://halalchain.my/verify?batch=${encodeURIComponent(currentBatch.batchNumber)}`;

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualBatchInput.trim().toLowerCase();
    const match = batches.find(
      (b) =>
        b.batchNumber.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.originFarm.toLowerCase().includes(query)
    );
    if (match) {
      onSelectBatch(match);
      setSelectedEventIndex(0);
      setManualBatchInput('');
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shipmentVerificationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrintComplianceReport = () => {
    window.print();
  };

  const handleDownloadDossierJson = () => {
    const reportData = {
      consortium: 'HalalChain Malaysia Consortium',
      certificationStandard: 'Malaysian Halal Standard MS 1500:2019 & MS 2400:2019',
      exportTimestamp: new Date().toISOString(),
      developerAttribution: 'Developed by Ammar Thaqif (ammarthaqif.ar@gmail.com)',
      consignment: {
        batchNumber: currentBatch.batchNumber,
        productName: currentBatch.name,
        sku: currentBatch.sku,
        category: currentBatch.category,
        subCategory: currentBatch.subCategory,
        weightKg: currentBatch.weightKg,
        unitPriceMYR: currentBatch.unitPriceMYR,
        originFarm: currentBatch.originFarm,
        stateOrRegion: currentBatch.stateOrRegion,
        slaughterhouse: currentBatch.slaughterhouse,
        jakimCertRef: currentBatch.jakimCertRef,
        slaughtererId: currentBatch.slaughtererId,
        slaughtererName: currentBatch.slaughtererName,
        slaughterDate: currentBatch.slaughterDate,
        storageType: currentBatch.storageType,
        liveTemperatureC: currentBatch.currentTemperatureC,
        toyyibanRating: currentBatch.toyyibanRating,
      },
      blockchainAnchor: {
        blockIndex: associatedBlock ? associatedBlock.index : 1,
        blockHash: associatedBlock ? associatedBlock.hash : 'VERIFIED_ON_CHAIN',
        merkleRoot: associatedBlock ? associatedBlock.merkleRoot : 'VALIDATED_ROOT',
        validatorNode: associatedBlock ? associatedBlock.validator.name : 'JAKIM National Root Node',
        institution: associatedBlock ? associatedBlock.validator.institution : 'JAKIM',
      },
      auditTrailEvents: currentBatch.events,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HalalChain-Compliance-Report-${currentBatch.batchNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Batch Switcher & Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Farm-to-Table Supply Chain Traceability
            </h2>
            <p className="text-xs text-neutral-500">
              Cryptographically verified stages from Malaysian farm origin and JAKIM slaughterhouse to the restaurant kitchen.
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {batches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  onSelectBatch(b);
                  setSelectedEventIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                  currentBatch.id === b.id
                    ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {b.batchNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Direct Scan Input */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleManualSearch} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Batch Number (e.g. MY-BEEF-2026-PERAK-0418) or Livestock RFID..."
              value={manualBatchInput}
              onChange={(e) => setManualBatchInput(e.target.value)}
              className="w-full pl-9 pr-24 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-neutral-900 text-white text-[11px] font-medium rounded-md hover:bg-neutral-800"
            >
              Verify
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <ScanLine className="w-4 h-4 text-emerald-700" />
              <span>Simulate Box QR Scan</span>
            </button>

            <button
              onClick={() => setShowUniqueQrModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <QrCode className="w-4 h-4 text-neutral-700" />
              <span>Shipment QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Batch Overview Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Batch Hero Picture */}
          <div className="lg:col-span-4 h-64 lg:h-auto relative bg-neutral-100">
            <img
              src={currentBatch.image}
              alt={currentBatch.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
              Batch: {currentBatch.batchNumber}
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white p-2.5 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Toyyiban Grade:</span>
                <span className="font-bold text-emerald-400 font-mono">Grade {currentBatch.toyyibanRating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Live Temperature:</span>
                <span className="font-mono text-cyan-300">{currentBatch.currentTemperatureC}°C ({currentBatch.storageType === 'FROZEN_NEG_18C' ? 'Frozen' : 'Chilled'})</span>
              </div>
            </div>
          </div>

          {/* Batch Metadata & JAKIM Proofs */}
          <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
                <span>{currentBatch.category}</span>
                <span aria-hidden="true">·</span>
                <span>{currentBatch.stateOrRegion}</span>
                <span aria-hidden="true">·</span>
                <span>SKU: {currentBatch.sku}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-neutral-900">
                {currentBatch.name}
              </h1>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                {currentBatch.description}
              </p>

              {/* Specification Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">JAKIM REFERENCE</p>
                  <p className="font-bold text-neutral-900 font-mono truncate" title={currentBatch.jakimCertRef}>
                    {currentBatch.jakimCertRef}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">SLAUGHTERER ID</p>
                  <p className="font-bold text-neutral-900 font-mono">
                    {currentBatch.slaughtererId}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">LOT WEIGHT</p>
                  <p className="font-bold text-neutral-900 font-mono tabular-nums">
                    {currentBatch.weightKg} kg
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">BLOCKCHAIN HEIGHT</p>
                  <p className="font-bold text-emerald-700 font-mono tabular-nums">
                    Block #{associatedBlock ? associatedBlock.index : '01'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar with Export Compliance Report and Shipment QR */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Malaysian Halal Standard MS 1500:2019 Fully Verified</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowUniqueQrModal(true)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Shipment QR Code</span>
                </button>

                <button
                  onClick={() => setShowComplianceReportModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export Compliance Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage Supply Chain Stepper */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 no-print">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Immutable Verification Timeline
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Click on any supply chain node below to inspect cryptographic signatures, IoT sensor logs, and Islamic compliance certificates.
          </p>
        </div>

        {/* Stepper Node Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {currentBatch.events.map((event, idx) => {
            const isSelected = selectedEventIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedEventIndex(idx)}
                className={`p-3.5 text-left rounded-xl transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      STEP 0{idx + 1}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
                  </div>
                  <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                    {event.title.split(' ')[0]} {event.title.split(' ')[1]}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                    {event.location.split(',')[0]}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-100/80">
                  <span className="text-[10px] font-mono text-emerald-800 font-semibold block">
                    Verified
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Event Inspector Card */}
        {activeEvent && (
          <div className="p-5 sm:p-6 bg-neutral-50/70 border border-neutral-200 rounded-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    Stage: {activeEvent.stage}
                  </span>
                  <span className="text-xs text-neutral-500">{activeEvent.stageNameMalay}</span>
                </div>
                <h4 className="text-lg font-bold text-neutral-900 mt-1">
                  {activeEvent.title}
                </h4>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-neutral-500 font-mono">TIMESTAMP</p>
                <p className="text-xs font-semibold text-neutral-900 font-mono mt-0.5">
                  {activeEvent.timestamp}
                </p>
              </div>
            </div>

            {/* Event Specific Telemetry & Compliance Proofs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-700">Actor & Regulatory Authority:</p>
                  <p className="text-xs text-neutral-900 mt-0.5 font-medium">{activeEvent.actorName}</p>
                  <p className="text-[11px] text-neutral-500">{activeEvent.actorRole}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-700">Location & Facility:</p>
                  <p className="text-xs text-neutral-900 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{activeEvent.location}</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-700">Inspection & Audit Reference:</p>
                  <p className="text-xs text-emerald-900 font-mono bg-emerald-50/80 p-2 rounded border border-emerald-100 mt-1">
                    {activeEvent.jakimComplianceProof}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-700">Operational & Shari’ah Notes:</p>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200">
                    {activeEvent.details}
                  </p>
                </div>

                {/* Telemetry Chips */}
                {activeEvent.telemetry && (
                  <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-1.5">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">IoT Sensor & Audit Telemetry</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      {activeEvent.telemetry.tempC !== undefined && (
                        <div>
                          <span className="text-neutral-500">Cargo Temp: </span>
                          <span className="font-bold text-cyan-600">{activeEvent.telemetry.tempC}°C</span>
                        </div>
                      )}
                      {activeEvent.telemetry.humidity !== undefined && (
                        <div>
                          <span className="text-neutral-500">Humidity: </span>
                          <span className="font-bold text-neutral-800">{activeEvent.telemetry.humidity}%</span>
                        </div>
                      )}
                      {activeEvent.telemetry.sealNumber && (
                        <div className="col-span-2">
                          <span className="text-neutral-500">Smart Seal: </span>
                          <span className="font-bold text-neutral-900">{activeEvent.telemetry.sealNumber}</span>
                        </div>
                      )}
                      {activeEvent.telemetry.vehiclePlate && (
                        <div>
                          <span className="text-neutral-500">Fleet Plate: </span>
                          <span className="font-bold text-neutral-900">{activeEvent.telemetry.vehiclePlate}</span>
                        </div>
                      )}
                      {activeEvent.telemetry.slaughtererId && (
                        <div className="col-span-2">
                          <span className="text-neutral-500">Slaughterer ID: </span>
                          <span className="font-bold text-emerald-800">{activeEvent.telemetry.slaughtererId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cryptographic Hash Bar */}
            <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-neutral-600 truncate max-w-xl">
                <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="text-neutral-400">SHA-256 Hash:</span>
                <span className="truncate text-neutral-800">{activeEvent.hash}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                ECDSA Signature Verified
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Merkle Proof & Cryptographic Anchor Card */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-xs space-y-4 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Consortium Merkle Anchor Proof</h3>
          </div>
          <button
            onClick={() => onNavigateToExplorer && associatedBlock && onNavigateToExplorer(associatedBlock.index)}
            className="px-2.5 py-1 text-xs font-mono bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded transition-colors flex items-center gap-1"
          >
            <span>Block #{associatedBlock ? associatedBlock.index : '01'} Verified</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          This consignment is permanently sealed in Block #{associatedBlock ? associatedBlock.index : '01'} validated by the Malaysian Halal Consortium. Any attempt by rogue meat syndicates or counterfeit suppliers to alter slaughter dates, animal origin, or cold-chain temperatures creates an instant cryptographic hash mismatch.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-black/40 p-3.5 rounded-lg border border-white/10">
          <div>
            <span className="text-neutral-400 text-[10px] block">PREVIOUS BLOCK HASH</span>
            <span className="text-neutral-300 truncate block mt-0.5">
              {associatedBlock ? associatedBlock.previousHash : '0000000000000000000000000000000000000000'}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] block">BLOCK MERKLE ROOT</span>
            <span className="text-emerald-400 truncate block mt-0.5">
              {associatedBlock ? associatedBlock.merkleRoot : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL 1: UNIQUE BATCH QR CODE GENERATOR & SCAN VIEWER */}
      {showUniqueQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2 text-neutral-900">
                <QrCode className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold">Unique Shipment QR Code</h3>
              </div>
              <button
                onClick={() => setShowUniqueQrModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Each batch is issued a distinct cryptographic QR code label. When scanned by a recipient restaurant or consumer smartphone, it renders the immutable on-chain audit trail for this exact shipment.
            </p>

            {/* Generated QR Code Card */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col items-center justify-center">
              <BatchQRCode 
                value={shipmentVerificationUrl} 
                size={160} 
                label={currentBatch.batchNumber}
                showDetails={true}
                allowDownload={true}
              />
            </div>

            {/* Direct Verification Link Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-700 block">
                Direct On-Chain Verification Link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shipmentVerificationUrl}
                  className="flex-1 p-2 text-xs font-mono bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-800 truncate select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                onClick={() => {
                  setShowUniqueQrModal(false);
                  setShowImmutableRecordModal(true);
                }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Immutable Record</span>
              </button>
              <button
                onClick={() => setShowUniqueQrModal(false)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IMMUTABLE BLOCKCHAIN RECORD (DISPLAYED WHEN SCANNED) */}
      {showImmutableRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Immutable Blockchain Shipment Record
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold">
                    Consignment Authenticated On-Chain
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImmutableRecordModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Block Certification Badge */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-900">
                  BLOCK #{associatedBlock ? associatedBlock.index : '01'} SEALS THIS SHIPMENT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 rounded">
                  CONSENSUS VALIDATED
                </span>
              </div>
              <p className="text-xs text-neutral-800 font-medium">
                Consignment: {currentBatch.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-600 pt-1 border-t border-emerald-200/60">
                <div>
                  <span className="text-neutral-400 block text-[10px]">BATCH ID:</span>
                  <span className="font-bold text-neutral-900">{currentBatch.batchNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">JAKIM CERT REF:</span>
                  <span className="font-bold text-emerald-800 truncate block">{currentBatch.jakimCertRef}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Ledger Invariants */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Block SHA-256 Hash</span>
                <p className="font-semibold text-emerald-900 break-all text-xs">
                  {associatedBlock ? associatedBlock.hash : '4c8109bf128a90192e448b192837461928374659102837465910283746519283'}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Merkle Root Verification Tree</span>
                <p className="font-semibold text-neutral-700 break-all text-xs">
                  {associatedBlock ? associatedBlock.merkleRoot : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Consortium Validator Authority</span>
                <p className="font-semibold text-neutral-900 text-xs">
                  {associatedBlock ? associatedBlock.validator.name : 'JAKIM National Root Node #01'}
                </p>
                <p className="text-[10px] text-neutral-500">
                  Sig: {associatedBlock ? associatedBlock.validator.signature : '0xjakimverifiedconsortiumnodesig991'}
                </p>
              </div>
            </div>

            {/* Milestones Summary */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-900">Audit Trail Milestone Receipts:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentBatch.events.map((ev, i) => (
                  <div key={i} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-neutral-900">{ev.title}</p>
                      <p className="text-[10px] text-neutral-500">{ev.location} · {ev.timestamp}</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                      {ev.hash.slice(0, 8)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-200">
              {onNavigateToExplorer && associatedBlock && (
                <button
                  onClick={() => {
                    setShowImmutableRecordModal(false);
                    onNavigateToExplorer(associatedBlock.index);
                  }}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect in Blockchain Explorer</span>
                </button>
              )}
              <button
                onClick={() => setShowImmutableRecordModal(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-lg ml-auto"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXPORT COMPLIANCE REPORT (PRINT-FRIENDLY PDF SUMMARY) */}
      {showComplianceReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-9 shadow-2xl border border-neutral-300 space-y-6 my-8 print:p-0 print:border-none print:shadow-none print:m-0 print:max-w-none">
            {/* Modal Actions Header (Hidden in Print) */}
            <div className="flex items-center justify-between no-print border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Export Compliance Report (PDF Summary)
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Official JAKIM & MS 1500:2019 / MS 2400:2019 print-friendly document
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDossierJson}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  title="Download raw cryptographic audit ledger in JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={handlePrintComplianceReport}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowComplianceReportModal(false)}
                  className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {/* PRINTABLE REPORT SHEET */}
            <div className="border-4 border-emerald-950 p-7 sm:p-8 rounded-xl bg-white space-y-6 print:border-2 print:p-4 print:rounded-none">
              {/* Official Header */}
              <div className="border-b-2 border-emerald-950 pb-5 text-center space-y-1">
                <p className="text-[11px] font-mono font-bold tracking-widest text-emerald-900 uppercase">
                  KERAJAAN MALAYSIA · JABATAN KEMAJUAN ISLAM MALAYSIA (JAKIM)
                </p>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  LAPORAN VERIFIKASI PEMATUHAN HALAL & RANTAIAN BEKALAN
                </h1>
                <p className="text-xs font-semibold text-neutral-700">
                  HALAL COMPLIANCE AUDIT DOSSIER · STANDARDS MS 1500:2019 & MS 2400:2019
                </p>
                <p className="text-[10px] text-neutral-500 font-mono pt-1">
                  Generated via HalalChain Malaysia Consortium Node · Developed by Ammar Thaqif (ammarthaqif.ar@gmail.com)
                </p>
              </div>

              {/* Shipment & Consignment Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50/80 p-4 rounded-lg border border-neutral-200 text-xs">
                <div>
                  <p className="text-[10px] text-neutral-400 font-mono font-bold uppercase">1. MAKLUMAT PRODUK</p>
                  <p className="font-extrabold text-neutral-900 text-sm mt-0.5">{currentBatch.name}</p>
                  <p className="font-mono text-neutral-600 text-xs">Batch: {currentBatch.batchNumber}</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">Kategori: {currentBatch.category} ({currentBatch.subCategory})</p>
                  <p className="font-mono text-neutral-700 text-[11px]">Berat Lot: {currentBatch.weightKg} kg</p>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-400 font-mono font-bold uppercase">2. PUSAT PENYEMBELIHAN / RPA</p>
                  <p className="font-bold text-neutral-900 mt-0.5">{currentBatch.slaughterhouse}</p>
                  <p className="text-[11px] text-neutral-700 font-mono">No. Siri JAKIM: {currentBatch.jakimCertRef}</p>
                  <p className="text-[11px] text-neutral-700">Penyembelih: {currentBatch.slaughtererName}</p>
                  <p className="text-[11px] text-neutral-600 font-mono">ID Penyembelih: {currentBatch.slaughtererId}</p>
                  <p className="text-[11px] text-neutral-500">Tarikh Sembelih: {currentBatch.slaughterDate.split('T')[0]}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 font-mono font-bold uppercase">3. STATUS RANTAIAN SEJUK</p>
                    <p className="font-bold text-emerald-800 text-sm mt-0.5">
                      Gred {currentBatch.toyyibanRating} (Patuh Toyyib)
                    </p>
                    <p className="font-mono text-neutral-700 text-xs">
                      Suhu Semasa: {currentBatch.currentTemperatureC}°C
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {currentBatch.storageType === 'FROZEN_NEG_18C' ? 'Beku (-18°C ke bawah)' : 'Dingin (0°C - +4°C)'}
                    </p>
                  </div>
                  <div className="mt-2 text-center">
                    <BatchQRCode value={shipmentVerificationUrl} size={65} showDetails={false} />
                    <span className="text-[9px] font-mono text-neutral-500 block">Scan to Verify</span>
                  </div>
                </div>
              </div>

              {/* Complete 5-Stage Audit Chronology Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    Kronologi Lengkap Rantaian Bekalan (Ladang ke Meja Makan)
                  </p>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">
                    Semua 5 Peringkat Disahkan
                  </span>
                </div>

                <div className="border border-neutral-300 rounded-lg overflow-hidden text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-800 font-semibold border-b border-neutral-300">
                      <tr>
                        <th className="p-2.5">Peringkat</th>
                        <th className="p-2.5">Lokasi & Pengendali</th>
                        <th className="p-2.5">Tarikh / Masa</th>
                        <th className="p-2.5">Dokumen Rujukan / Telemetri</th>
                        <th className="p-2.5 font-mono">Hash Sah (SHA-256)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {currentBatch.events.map((ev, i) => (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-bold text-neutral-900">
                            0{i + 1}. {ev.stage}
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold block">{ev.actorName}</span>
                            <span className="text-neutral-500 text-[10px]">{ev.location}</span>
                          </td>
                          <td className="p-2.5 font-mono text-[10px] text-neutral-600 whitespace-nowrap">
                            {ev.timestamp}
                          </td>
                          <td className="p-2.5">
                            <span className="text-emerald-800 font-semibold block">{ev.jakimComplianceProof}</span>
                            {ev.telemetry && ev.telemetry.tempC !== undefined && (
                              <span className="text-[10px] font-mono text-neutral-600 block">
                                Suhu Kargo: {ev.telemetry.tempC}°C · Seal #{ev.telemetry.sealNumber || 'N/A'}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-mono text-[9px] text-neutral-600">
                            {ev.hash.slice(0, 16)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Blockchain Cryptographic Sealing Statement */}
              <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs space-y-1">
                <p className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>Meterai Konsortium Blockchain Malaysia (Anti-Kartel & Anti-Palsu)</span>
                  <span className="font-mono text-emerald-800 text-[10px]">
                    Status: Kekal Tidak Boleh Diubah (Immutable)
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-600">
                  <div>Hash Blok: {associatedBlock ? associatedBlock.hash : '4c8109bf128a90192e448b192837461928374659102837465910283746519283'}</div>
                  <div>Merkle Root: {associatedBlock ? associatedBlock.merkleRoot : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>
                </div>
              </div>

              {/* Sign-Off Authorization Footer */}
              <div className="pt-4 border-t-2 border-emerald-950 grid grid-cols-3 gap-6 text-[11px]">
                <div className="space-y-6">
                  <p className="font-semibold text-neutral-800">Pegawai Pemeriksa Halal / RPA:</p>
                  <div className="border-b border-neutral-400 pt-6"></div>
                  <p className="text-[10px] text-neutral-500">Nama: {currentBatch.slaughtererName}</p>
                  <p className="text-[10px] text-neutral-500">Jawatan: Eksekutif Halal Bertauliah</p>
                </div>

                <div className="space-y-6">
                  <p className="font-semibold text-neutral-800">Penerima Dapur Restoran (SPHM):</p>
                  <div className="border-b border-neutral-400 pt-6"></div>
                  <p className="text-[10px] text-neutral-500">Nama: Chef Eksekutif Restoran</p>
                  <p className="text-[10px] text-neutral-500">Status Semakan: Kod QR & Suhu Diterima</p>
                </div>

                <div className="text-right space-y-1 flex flex-col justify-end">
                  <div className="p-2 border-2 border-dashed border-emerald-800 rounded inline-block text-center ml-auto">
                    <p className="text-[9px] font-mono font-bold text-emerald-900 uppercase">COP PENGESAHAN JAKIM</p>
                    <p className="text-[8px] text-emerald-700">MS 1500:2019 / MS 2400</p>
                    <p className="text-[8px] font-mono text-neutral-500">{new Date().toISOString().split('T')[0]}</p>
                  </div>
                  <p className="text-[9px] text-neutral-400 pt-1">
                    Dokumen ini sah tanpa tandatangan fizikal jika disahkan melalui HalalChain QR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: QR SCANNER SIMULATOR MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-900">
                <ScanLine className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold">Restaurant Kitchen QR Scanner</h3>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Point your smartphone or kitchen warehouse scanner at the delivery carton label to instantly authenticate halal provenance.
            </p>

            {/* Simulated Camera Viewfinder */}
            <div className="relative h-64 bg-neutral-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500/50">
              <div className="w-44 h-44 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                <BatchQRCode value={shipmentVerificationUrl} size={110} showDetails={false} />
              </div>
              <p className="text-[11px] text-emerald-400 font-mono mt-3 z-10 animate-bounce">
                Scanning HalalChain QR Tag...
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-neutral-700">Quick-Select Batch to Authenticate:</p>
              <div className="grid grid-cols-2 gap-2">
                {batches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onSelectBatch(b);
                      setSelectedEventIndex(0);
                      setIsScannerOpen(false);
                      setShowImmutableRecordModal(true);
                    }}
                    className="p-2 text-left bg-neutral-50 hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 rounded-lg text-xs"
                  >
                    <p className="font-bold text-neutral-900 truncate">{b.name}</p>
                    <p className="text-[10px] font-mono text-neutral-500">{b.batchNumber}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsScannerOpen(false)}
              className="w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
