import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Thermometer, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Clock
} from 'lucide-react';
import { BatchItem, StorageType, BlockchainBlock, HalalTransaction } from '../types/blockchain';
import { calculateSha256 } from '../services/cryptoLedger';

interface ProducerMintViewProps {
  onMintSuccess: (newBatch: BatchItem, newTransaction: HalalTransaction) => void;
  blockchain: BlockchainBlock[];
}

export const ProducerMintView: React.FC<ProducerMintViewProps> = ({
  onMintSuccess,
  blockchain,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [successBatchId, setSuccessBatchId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('Pahang Prime Grass-Fed Beef Striploin');
  const [category, setCategory] = useState<'BEEF' | 'POULTRY' | 'LAMB' | 'GROCERY'>('BEEF');
  const [weightKg, setWeightKg] = useState<number>(95);
  const [unitPriceMYR, setUnitPriceMYR] = useState<number>(82.0);
  const [originFarm, setOriginFarm] = useState('Ladang Ternakan Muadzam Shah, Pahang');
  const [stateOrRegion, setStateOrRegion] = useState('Pahang Darul Makmur');
  const [slaughterhouse, setSlaughterhouse] = useState('Rumah Penyembelihan Halal Kuantan (RPA Kuantan)');
  const [jakimCertRef, setJakimCertRef] = useState('JAKIM/(S)/(22.00)/492/2/1 055-08');
  
  // Certificate Expiry Warning System (Default: 2027-05-20)
  const [jakimCertExpiryDate, setJakimCertExpiryDate] = useState('2027-05-20');
  
  const [slaughtererId, setSlaughtererId] = useState('MY-HAL-SL-773');
  const [slaughtererName, setSlaughtererName] = useState('Ustaz Hakimi bin Abdul Rahman');
  const [storageType, setStorageType] = useState<StorageType>('CHILLED_0_4C');
  const [currentTempC, setCurrentTempC] = useState<number>(1.9);
  const [dvsPermit, setDvsPermit] = useState('DVS-PHG-2026-9912');
  const [vehiclePlate, setVehiclePlate] = useState('CAF 9120');

  // Compute certificate expiration days relative to current time
  const getCertificateStatus = () => {
    if (!jakimCertExpiryDate) return { days: 0, status: 'UNKNOWN' };
    const today = new Date();
    const expiry = new Date(jakimCertExpiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: diffDays, status: 'EXPIRED' };
    } else if (diffDays <= 30) {
      return { days: diffDays, status: 'EXPIRING_SOON' };
    } else {
      return { days: diffDays, status: 'VALID' };
    }
  };

  const certStatus = getCertificateStatus();

  // Preset date helpers for interactive demonstration
  const setPresetDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const isoStr = d.toISOString().split('T')[0];
    setJakimCertExpiryDate(isoStr);
  };

  const handleMintBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (certStatus.status === 'EXPIRED') {
      alert('Cannot mint consignment: The associated JAKIM Halal Certificate has expired. Under MS 1500:2019, renewal is mandatory.');
      return;
    }

    setIsMining(true);

    const generatedBatchNumber = `MY-${category}-${new Date().getFullYear()}-${stateOrRegion.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    // Simulate proof of authority block mining latency
    setTimeout(() => {
      const newBatchItem: BatchItem = {
        id: `batch-${Date.now()}`,
        batchNumber: generatedBatchNumber,
        sku: `HL-${category}-${Math.floor(Math.random() * 900 + 100)}`,
        name,
        category,
        subCategory: `${category === 'BEEF' ? 'Prime Fresh Cuts' : 'Farm Harvest'}`,
        weightKg,
        unitPriceMYR,
        stockAvailableKg: weightKg,
        originFarm,
        stateOrRegion,
        slaughterhouse,
        jakimCertRef,
        jakimCertExpiryDate,
        slaughtererId,
        slaughtererName,
        slaughterDate: new Date().toISOString(),
        storageType,
        currentTemperatureC: currentTempC,
        image: category === 'BEEF' 
          ? '/src/assets/images/halal_farm_livestock_1793807995810.jpg'
          : category === 'POULTRY'
          ? '/src/assets/images/halal_abattoir_facility_1793807996477.jpg'
          : '/src/assets/images/halal_grocery_wholesale_1793807997179.jpg',
        toyyibanRating: 'A+',
        verifiedStatus: certStatus.status === 'EXPIRING_SOON' ? 'FLAGGED' : 'VERIFIED',
        description: `Verified ${category} consignment from ${originFarm}. 100% Shari'ah compliant Islamic slaughter verified by ${slaughtererName} under JAKIM reference ${jakimCertRef} (Valid through ${jakimCertExpiryDate}).`,
        events: [
          {
            stage: 'FARM_ORIGIN',
            title: 'Farm Husbandry & Livestock Clearance',
            stageNameMalay: 'Asal-Usul Ternakan Ladang Berdaftar',
            location: originFarm,
            actorName: 'Accredited Farm Manager',
            actorRole: 'Livestock Husbandry Specialist',
            timestamp: new Date().toLocaleString(),
            jakimComplianceProof: `DVS Health Permit #${dvsPermit} / Clean Organic Feed`,
            details: `Livestock raised on halal-certified plant meal. Zero porcine/animal by-products. DVS permit ${dvsPermit} verified.`,
            telemetry: {
              feedCertification: '100% Halal Certified Organic Grain / Grass',
            },
            hash: calculateSha256(`EVENT_FARM_${generatedBatchNumber}`),
            signature: '0x' + calculateSha256(`SIG_FARM_${Date.now()}`).slice(0, 40),
          },
          {
            stage: 'HALAL_SLAUGHTER',
            title: 'Islamic Halal Slaughter (Dhabh Shari’ah)',
            stageNameMalay: 'Penyembelihan Halal Syariah',
            location: slaughterhouse,
            actorName: slaughtererName,
            actorRole: `Certified Halal Slaughterer (ID: ${slaughtererId})`,
            timestamp: new Date().toLocaleString(),
            jakimComplianceProof: `JAKIM License #${jakimCertRef} (Expiry: ${jakimCertExpiryDate})`,
            details: `Manual halal slaughter with continuous Tasmiyah ("Bismillahi Allahu Akbar"). Confirmed full severance of trachea (Halkum), esophagus (Mari'), and jugular veins (Wadajain). Expiry status: ${certStatus.status}.`,
            telemetry: {
              slaughtererId,
              slaughtererName,
              cutDetails: 'Full severance of Halkum, Mari, and Wadajain vessels',
            },
            hash: calculateSha256(`EVENT_SLAUGHTER_${generatedBatchNumber}`),
            signature: '0x' + calculateSha256(`SIG_SLAUGHTER_${Date.now()}`).slice(0, 40),
          },
          {
            stage: 'COLD_CHAIN',
            title: 'Halal Dedicated Reefer Fleet Dispatch',
            stageNameMalay: 'Penghantaran Logistik Sejuk Beku Halal',
            location: `${stateOrRegion} -> Distribution Depot`,
            actorName: 'Consortium Halal Cold Carrier',
            actorRole: 'MS 2400 Certified Logistics Partner',
            timestamp: new Date().toLocaleString(),
            jakimComplianceProof: 'MS 2400:2019 Clean Freight Cert',
            details: `Fleet Plate ${vehiclePlate}. Zero co-loading. Temperature calibrated at ${currentTempC}°C.`,
            telemetry: {
              tempC: currentTempC,
              humidity: 82,
              vehiclePlate,
              sealNumber: `SEAL-${Math.floor(Math.random() * 90000 + 10000)}`,
            },
            hash: calculateSha256(`EVENT_COLD_${generatedBatchNumber}`),
            signature: '0x' + calculateSha256(`SIG_COLD_${Date.now()}`).slice(0, 40),
          },
        ],
      };

      const newTx: HalalTransaction = {
        txHash: calculateSha256(`TX_MINT_${generatedBatchNumber}_${Date.now()}`),
        batchId: generatedBatchNumber,
        productName: name,
        stage: 'HALAL_SLAUGHTER',
        actor: `${slaughterhouse} (${slaughtererName})`,
        details: `Minted new Halal Consignment ${generatedBatchNumber} under JAKIM cert ${jakimCertRef}. Expiry date: ${jakimCertExpiryDate}.`,
        signature: '0x' + calculateSha256(`TX_SIG_${generatedBatchNumber}`).slice(0, 40),
        toyyibanStatus: certStatus.status === 'EXPIRING_SOON' ? 'FLAGGED' : 'COMPLIANT',
        timestamp: new Date().toISOString(),
      };

      setIsMining(false);
      setSuccessBatchId(generatedBatchNumber);
      onMintSuccess(newBatchItem, newTx);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              SUPPLIER & ABATTOIR ON-CHAIN PORTAL
            </span>
            <span className="text-xs text-neutral-500">MS 1500:2019 Protocol</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
            Mint New Verified Halal Consignment
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Record fresh livestock, slaughter, and cold-chain credentials to the HalalChain blockchain. Active verification checks prevent expired certifications from entering the food supply chain.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 border-b border-neutral-200 pb-4 text-xs">
          <button
            onClick={() => setStep(1)}
            className={`p-2 rounded-lg text-left ${
              step === 1 ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            1. Farm & Livestock
          </button>
          <button
            onClick={() => setStep(2)}
            className={`p-2 rounded-lg text-left ${
              step === 2 ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            2. JAKIM Certification & Expiry
          </button>
          <button
            onClick={() => setStep(3)}
            className={`p-2 rounded-lg text-left ${
              step === 3 ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            3. Cold-Chain & Mint
          </button>
        </div>

        {successBatchId ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Consignment Minted Successfully to Block #{blockchain.length}!
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Batch <span className="font-mono font-bold text-emerald-800">{successBatchId}</span> is now cryptographically immutable and visible in the Marketplace, Smart Contract Escrows, and QR Traceability explorer.
              </p>
            </div>
            <button
              onClick={() => {
                setSuccessBatchId(null);
                setStep(1);
              }}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
            >
              Mint Another Batch
            </button>
          </div>
        ) : (
          <form onSubmit={handleMintBatch} className="space-y-6">
            {/* Step 1: Farm Origin */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Consignment Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Product Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    >
                      <option value="BEEF">Fresh Halal Beef</option>
                      <option value="POULTRY">Free-Range Organic Poultry</option>
                      <option value="LAMB">Halal Lamb / Mutton</option>
                      <option value="GROCERY">Halal Groceries & Spices</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Origin Farm / Breeder
                    </label>
                    <input
                      type="text"
                      value={originFarm}
                      onChange={(e) => setOriginFarm(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Malaysian State / Region
                    </label>
                    <select
                      value={stateOrRegion}
                      onChange={(e) => setStateOrRegion(e.target.value)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    >
                      <option value="Pahang Darul Makmur">Pahang</option>
                      <option value="Perak Darul Ridzuan">Perak</option>
                      <option value="Selangor Darul Ehsan">Selangor</option>
                      <option value="Johor Darul Ta'zim">Johor</option>
                      <option value="Kedah Darul Aman">Kedah</option>
                      <option value="Pulau Pinang">Pulau Pinang</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Lot Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Unit Price (RM/kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={unitPriceMYR}
                      onChange={(e) => setUnitPriceMYR(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      DVS Health Permit #
                    </label>
                    <input
                      type="text"
                      value={dvsPermit}
                      onChange={(e) => setDvsPermit(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <span>Proceed to Slaughterhouse & Expiry Check</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Slaughterhouse Data & Visual Warning System */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Certified Abattoir (Rumah Penyembelihan Halal)
                    </label>
                    <input
                      type="text"
                      value={slaughterhouse}
                      onChange={(e) => setSlaughterhouse(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      JAKIM Halal Certification Ref
                    </label>
                    <input
                      type="text"
                      value={jakimCertRef}
                      onChange={(e) => setJakimCertRef(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                </div>

                {/* JAKIM Certificate Expiration Field & Date Simulator */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span>JAKIM Halal Certificate Expiration Date</span>
                      </label>
                      <p className="text-[11px] text-neutral-500">
                        Official validity date issued under SPHM MS 1500:2019
                      </p>
                    </div>

                    {/* Quick Simulation Buttons for Verification Testing */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-neutral-500 font-mono">Test Simulator:</span>
                      <button
                        type="button"
                        onClick={() => setPresetDate(15)}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-medium transition-colors"
                        title="Set certificate to expire in 15 days"
                      >
                        Expiring (15d)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetDate(-5)}
                        className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-900 rounded font-medium transition-colors"
                        title="Set certificate to expired 5 days ago"
                      >
                        Expired (-5d)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetDate(365)}
                        className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-medium transition-colors"
                        title="Set certificate valid for 1 year"
                      >
                        Valid (1 Year)
                      </button>
                    </div>
                  </div>

                  <input
                    type="date"
                    value={jakimCertExpiryDate}
                    onChange={(e) => setJakimCertExpiryDate(e.target.value)}
                    required
                    className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                  />

                  {/* VISUAL WARNING SYSTEM ALERT BANNERS */}
                  {certStatus.status === 'EXPIRED' && (
                    <div className="p-3.5 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3 text-xs text-red-950">
                      <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold uppercase tracking-wide text-red-900 flex items-center gap-2">
                          <span>CRITICAL ALERT: JAKIM CERTIFICATE EXPIRED</span>
                          <span className="font-mono text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded">
                            Lapsed {Math.abs(certStatus.days)} Days Ago
                          </span>
                        </p>
                        <p className="leading-relaxed">
                          This abattoir’s accreditation expired on <strong className="font-mono">{jakimCertExpiryDate}</strong>. Under Malaysian Halal Standard MS 1500:2019 Clause 4.2.1, new consignments cannot be minted onto the blockchain with expired credentials. SPHM renewal is required before processing.
                        </p>
                      </div>
                    </div>
                  )}

                  {certStatus.status === 'EXPIRING_SOON' && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 text-xs text-amber-950">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-2">
                          <span>WARNING: CERTIFICATE APPROACHING EXPIRATION</span>
                          <span className="font-mono text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                            {certStatus.days} Days Remaining
                          </span>
                        </p>
                        <p className="leading-relaxed">
                          The JAKIM certificate will expire on <strong className="font-mono">{jakimCertExpiryDate}</strong> (under 30-day threshold). A formal renewal application must be filed immediately with JAKIM. Batches minted now will carry an automated audit alert in the restaurant SPHM inspection passport.
                        </p>
                      </div>
                    </div>
                  )}

                  {certStatus.status === 'VALID' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="flex-1 flex items-center justify-between">
                        <span>
                          <strong>JAKIM Accreditation Active:</strong> Certificate valid for <span className="font-mono font-bold">{certStatus.days} days</span> ({jakimCertExpiryDate}).
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          MS 1500:2019 Compliant
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Certified Muslim Slaughterer Name
                    </label>
                    <input
                      type="text"
                      value={slaughtererName}
                      onChange={(e) => setSlaughtererName(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Slaughterer JAKIM ID
                    </label>
                    <input
                      type="text"
                      value={slaughtererId}
                      onChange={(e) => setSlaughtererId(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1.5 text-xs">
                  <p className="font-semibold text-neutral-900">Mandatory MS 1500:2019 Attestations:</p>
                  <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                    <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                    <span>Tasmiyah ("Bismillahi Allahu Akbar") continuously recited by certified Muslim.</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                    <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                    <span>Complete severance of Halkum (windpipe), Mari' (gullet) and both Wadajain.</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                    <input type="checkbox" defaultChecked disabled className="rounded text-emerald-600" />
                    <span>Non-lethal / zero mechanical brain destruction compliance verified.</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={certStatus.status === 'EXPIRED'}
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>{certStatus.status === 'EXPIRED' ? 'Blocked: Certificate Expired' : 'Proceed to Cold Chain & Sign'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cold-Chain & Cryptographic Mint */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Storage Classification
                    </label>
                    <select
                      value={storageType}
                      onChange={(e) => setStorageType(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    >
                      <option value="CHILLED_0_4C">Chilled (0°C to +4°C)</option>
                      <option value="FROZEN_NEG_18C">Frozen (-18°C or below)</option>
                      <option value="AMBIENT">Ambient Pantry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Logged Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentTempC}
                      onChange={(e) => setCurrentTempC(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Fleet Reefer Plate
                    </label>
                    <input
                      type="text"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      required
                      className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographic Block Assembly & Expiry Sealing</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    By clicking below, your credentials and certified expiry date (<span className="font-mono text-emerald-400">{jakimCertExpiryDate}</span>) will be signed with your abattoir private key, hashed with SHA-256, and sealed onto the Malaysian HalalChain ledger as Block #{blockchain.length}.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isMining}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    {isMining ? (
                      <>
                        <Layers className="w-4 h-4 animate-spin" />
                        <span>Mining & Sealing Block...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Sign & Mine Halal Consignment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
