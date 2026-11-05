import React, { useState, useEffect } from 'react';
import { 
  INITIAL_BATCHES, 
  INITIAL_ESCROW_CONTRACTS,
  createInitialBlockchain, 
  verifyBlockchainIntegrity, 
  mineNewBlock 
} from './services/cryptoLedger';
import { 
  BatchItem, 
  BlockchainBlock, 
  ChainVerificationResult, 
  EscrowContract, 
  HalalTransaction 
} from './types/blockchain';
import { TopNav, ActiveTab } from './components/TopNav';
import { MarketplaceView } from './components/MarketplaceView';
import { TraceabilityTimelineView } from './components/TraceabilityTimelineView';
import { SmartContractDashboardView } from './components/SmartContractDashboardView';
import { BlockchainExplorerView } from './components/BlockchainExplorerView';
import { ProducerMintView } from './components/ProducerMintView';
import { AIHalalAuditorView } from './components/AIHalalAuditorView';
import { EscrowCheckoutModal } from './components/EscrowCheckoutModal';
import { ShieldCheck, HeartHandshake, CheckCircle2, User } from 'lucide-react';

export default function App() {
  const [blockchain, setBlockchain] = useState<BlockchainBlock[]>(createInitialBlockchain());
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [currentBatch, setCurrentBatch] = useState<BatchItem>(INITIAL_BATCHES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('MARKETPLACE');
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult>(() =>
    verifyBlockchainIntegrity(createInitialBlockchain())
  );
  const [escrowModalBatch, setEscrowModalBatch] = useState<BatchItem | null>(null);
  const [escrows, setEscrows] = useState<EscrowContract[]>(INITIAL_ESCROW_CONTRACTS);
  const [autoOpenRecordModal, setAutoOpenRecordModal] = useState<boolean>(false);

  // Parse deep-linked URL parameters for direct batch QR scans
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const batchParam = urlParams.get('batch');
      const viewParam = urlParams.get('view');

      if (batchParam) {
        const found = batches.find(
          (b) => b.batchNumber.toLowerCase() === batchParam.toLowerCase() || b.id === batchParam
        );
        if (found) {
          setCurrentBatch(found);
          setActiveTab('TRACE_BATCH');
          if (viewParam === 'immutable-record') {
            setAutoOpenRecordModal(true);
          }
        }
      }
    }
  }, [batches]);

  // Cryptographic audit handler
  const handleAuditChain = () => {
    const result = verifyBlockchainIntegrity(blockchain);
    setVerificationResult(result);
    return result;
  };

  // Simulate malicious data tampering (e.g. counterfeit meat cartel modifying Block #2)
  const handleSimulateTamper = () => {
    setBlockchain((prev) => {
      const tampered = prev.map((block) => {
        if (block.index === 2) {
          return {
            ...block,
            isTampered: true,
            transactions: block.transactions.map((tx, idx) => {
              if (idx === 0) {
                return {
                  ...tx,
                  details: 'FRAUDULENT MUTATION: Uncertified abattoir meat injected into consignment without JAKIM inspection.',
                  toyyibanStatus: 'FLAGGED' as const,
                };
              }
              return tx;
            }),
          };
        }
        return block;
      });

      // Verify the tampered chain immediately
      const result = verifyBlockchainIntegrity(tampered);
      setVerificationResult(result);
      return tampered;
    });
  };

  // Restore pristine consensus state
  const handleRestoreLedger = () => {
    const fresh = createInitialBlockchain();
    setBlockchain(fresh);
    setVerificationResult(verifyBlockchainIntegrity(fresh));
  };

  // Handler for minting new consignment from farms/abattoirs
  const handleMintSuccess = (newBatch: BatchItem, newTransaction: HalalTransaction) => {
    setBatches((prev) => [newBatch, ...prev]);

    // Mine new block
    const newBlock = mineNewBlock(
      blockchain,
      [newTransaction],
      {
        name: `${newBatch.slaughterhouse} Verification Node`,
        nodeId: `NODE-${newBatch.stateOrRegion.slice(0, 3).toUpperCase()}-99`,
        institution: 'Consortium Halal Processing Authority',
      }
    );

    const updatedChain = [...blockchain, newBlock];
    setBlockchain(updatedChain);
    setVerificationResult(verifyBlockchainIntegrity(updatedChain));
    setCurrentBatch(newBatch);
  };

  // Handler for selecting batch to trace
  const handleSelectBatchForTrace = (batch: BatchItem) => {
    setCurrentBatch(batch);
    setAutoOpenRecordModal(false);
    setActiveTab('TRACE_BATCH');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for escrow order
  const handleConfirmEscrowOrder = (contract: EscrowContract) => {
    setEscrows((prev) => [contract, ...prev]);
    setActiveTab('ESCROW_DASHBOARD');
  };

  // Handler for updating smart contract escrow status
  const handleUpdateEscrowStatus = (
    contractId: string, 
    newStatus: 'LOCKED_IN_ESCROW' | 'RELEASED_TO_SUPPLIER' | 'REFUNDED_BREACH',
    metadata?: { releaseTxHash?: string; breachReason?: string; currentTempC?: number }
  ) => {
    setEscrows((prev) =>
      prev.map((escrow) => {
        if (escrow.id === contractId) {
          const isReleased = newStatus === 'RELEASED_TO_SUPPLIER';
          const isBreached = newStatus === 'REFUNDED_BREACH';

          return {
            ...escrow,
            status: newStatus,
            currentTempC: metadata?.currentTempC !== undefined ? metadata.currentTempC : escrow.currentTempC,
            transitStatus: isReleased ? 'DELIVERED' : isBreached ? 'IN_TRANSIT_HIGHWAY' : escrow.transitStatus,
            triggers: {
              geofenceVerified: isReleased ? true : escrow.triggers.geofenceVerified,
              tempCompliant: isBreached ? false : true,
              tamperSealVerified: isReleased ? true : escrow.triggers.tamperSealVerified,
              chefSignedOff: isReleased ? true : isBreached ? false : escrow.triggers.chefSignedOff,
            },
            releaseTxHash: metadata?.releaseTxHash || escrow.releaseTxHash,
            releaseTimestamp: isReleased ? new Date().toISOString() : escrow.releaseTimestamp,
            breachReason: metadata?.breachReason || escrow.breachReason,
          };
        }
        return escrow;
      })
    );
  };

  const handleNavigateToExplorer = (_blockIndex: number) => {
    setActiveTab('BLOCKCHAIN_EXPLORER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTraceByBatchNumber = (batchNum: string) => {
    const found = batches.find((b) => b.batchNumber === batchNum);
    if (found) {
      setCurrentBatch(found);
      setAutoOpenRecordModal(false);
      setActiveTab('TRACE_BATCH');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeEscrowsLockedCount = escrows.filter((e) => e.status === 'LOCKED_IN_ESCROW').length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickScan={() => {
          setActiveTab('TRACE_BATCH');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={activeEscrowsLockedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'MARKETPLACE' && (
          <MarketplaceView
            batches={batches}
            onSelectBatchForTrace={handleSelectBatchForTrace}
            onOpenEscrowModal={(batch) => setEscrowModalBatch(batch)}
            onOpenMintModal={() => setActiveTab('PRODUCER_MINT')}
          />
        )}

        {activeTab === 'TRACE_BATCH' && (
          <TraceabilityTimelineView
            batches={batches}
            currentBatch={currentBatch}
            onSelectBatch={(batch) => {
              setCurrentBatch(batch);
              setAutoOpenRecordModal(false);
            }}
            blockchain={blockchain}
            onNavigateToExplorer={handleNavigateToExplorer}
            autoOpenRecordModal={autoOpenRecordModal}
          />
        )}

        {activeTab === 'ESCROW_DASHBOARD' && (
          <SmartContractDashboardView
            escrows={escrows}
            onUpdateEscrowStatus={handleUpdateEscrowStatus}
            onNavigateToTrace={handleNavigateToTraceByBatchNumber}
          />
        )}

        {activeTab === 'BLOCKCHAIN_EXPLORER' && (
          <BlockchainExplorerView
            blockchain={blockchain}
            onAuditChain={handleAuditChain}
            onSimulateTamper={handleSimulateTamper}
            onRestoreLedger={handleRestoreLedger}
            verificationResult={verificationResult}
          />
        )}

        {activeTab === 'PRODUCER_MINT' && (
          <ProducerMintView
            onMintSuccess={handleMintSuccess}
            blockchain={blockchain}
          />
        )}

        {activeTab === 'AI_AUDITOR' && (
          <AIHalalAuditorView />
        )}
      </main>

      {/* Escrow Modal */}
      {escrowModalBatch && (
        <EscrowCheckoutModal
          batch={escrowModalBatch}
          onClose={() => setEscrowModalBatch(null)}
          onConfirmOrder={handleConfirmEscrowOrder}
        />
      )}

      {/* Quiet Corporate Footer with Developed By attribution */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-8 text-xs text-neutral-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-neutral-800">HalalChain Malaysia</span>
            <span aria-hidden="true">·</span>
            <span>Malaysian Halal Standard MS 1500:2019 & MS 2400:2019 (Halalan-Toyyiban Assurance)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-neutral-600 justify-center md:justify-end">
            <span className="font-medium text-neutral-800">Developed by Ammar Thaqif</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">ammarthaqif.ar@gmail.com</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 HalalChain Consortium</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
