import React, { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Thermometer, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { BatchItem, EscrowContract } from '../types/blockchain';

interface EscrowCheckoutModalProps {
  batch: BatchItem;
  onClose: () => void;
  onConfirmOrder: (contract: EscrowContract) => void;
}

export const EscrowCheckoutModal: React.FC<EscrowCheckoutModalProps> = ({
  batch,
  onClose,
  onConfirmOrder,
}) => {
  const [quantityKg, setQuantityKg] = useState<number>(Math.min(25, batch.stockAvailableKg));
  const [restaurantName, setRestaurantName] = useState<string>('Restoran Selera Warisan, Bangsar');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('No. 18, Jalan Telawi 3, Bangsar, 59100 Kuala Lumpur');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedContract, setDeployedContract] = useState<EscrowContract | null>(null);

  const totalAmount = quantityKg * batch.unitPriceMYR;

  const handleDeployContract = () => {
    setIsDeploying(true);

    setTimeout(() => {
      const contract: EscrowContract = {
        id: `ESCROW-HL-${Date.now()}`,
        batchId: batch.batchNumber,
        productName: batch.name,
        restaurantName,
        supplierName: batch.slaughterhouse,
        quantityKg,
        totalMYR: totalAmount,
        status: 'LOCKED_IN_ESCROW',
        conditions: {
          maxTempAllowedC: batch.storageType === 'FROZEN_NEG_18C' ? -15.0 : 4.0,
          sealMustMatch: 'SEAL-VALIDATED-ON-CHAIN',
          tempBreached: false,
          sealVerified: false,
        },
        createdAt: new Date().toISOString(),
      };

      setIsDeploying(false);
      setDeployedContract(contract);
      onConfirmOrder(contract);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Halal Smart Contract Escrow Order
              </h3>
              <p className="text-[11px] text-neutral-500">
                Automated payment protection for Malaysian restaurants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {deployedContract ? (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-neutral-900">
                Smart Contract Deployed & Locked in Escrow
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Contract ID: <span className="font-mono font-bold text-emerald-800">{deployedContract.id}</span>
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order Amount:</span>
                <span className="font-bold font-mono text-neutral-900">RM {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Locked In Escrow Vault:</span>
                <span className="font-semibold text-emerald-700">100% Protected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Release Rule:</span>
                <span className="text-neutral-800">Upon physical QR verification at Bangsar kitchen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cold Chain Threshold:</span>
                <span className="font-mono text-neutral-800">Must not exceed {deployedContract.conditions.maxTempAllowedC}°C</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              The cold-chain carrier has been dispatched. Funds will only transfer to {batch.slaughterhouse} when you scan the consignment label upon arrival.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
            >
              Back to Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Batch Quick Snapshot */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <p className="font-bold text-neutral-900 truncate">{batch.name}</p>
                <p className="text-[11px] text-neutral-500 font-mono">Batch: {batch.batchNumber}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold font-mono text-neutral-900 text-sm">
                  RM {batch.unitPriceMYR.toFixed(2)} / kg
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold">JAKIM Verified</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Procurement Quantity (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max={batch.stockAvailableKg}
                    step="5"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-700"
                  />
                  <span className="font-mono font-bold text-sm text-neutral-900 w-16 text-right">
                    {quantityKg} kg
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Restaurant / Establishment Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                />
              </div>
            </div>

            {/* Smart Contract Guarantee Checklist */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5 text-[11px]">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>On-Chain Escrow Protection Invariants:</span>
              </p>
              <p className="text-emerald-900">
                1. Money is held securely in the HalalChain smart contract — supplier receives RM 0 until delivery.
              </p>
              <p className="text-emerald-900">
                2. If the temperature exceeds {batch.storageType === 'FROZEN_NEG_18C' ? '-15°C' : '+4°C'}, the contract triggers an automatic full refund.
              </p>
              <p className="text-emerald-900">
                3. Restaurant kitchen scans the box QR code to verify intact tamper seal before releasing funds.
              </p>
            </div>

            {/* Total Calculation */}
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-neutral-500">Total Escrow Amount:</p>
                <p className="text-xl font-black text-neutral-900 font-mono tabular-nums">
                  RM {totalAmount.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                disabled={isDeploying}
                onClick={handleDeployContract}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                {isDeploying ? (
                  <span>Locking in Escrow...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Escrow & Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
