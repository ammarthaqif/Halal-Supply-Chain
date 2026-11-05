import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  Key, 
  ChevronRight, 
  Search,
  Activity,
  Cpu,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { BlockchainBlock, ChainVerificationResult, HalalTransaction } from '../types/blockchain';

interface BlockchainExplorerViewProps {
  blockchain: BlockchainBlock[];
  onAuditChain: () => ChainVerificationResult;
  onSimulateTamper: () => void;
  onRestoreLedger: () => void;
  verificationResult: ChainVerificationResult;
}

export const BlockchainExplorerView: React.FC<BlockchainExplorerViewProps> = ({
  blockchain,
  onAuditChain,
  onSimulateTamper,
  onRestoreLedger,
  verificationResult,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(0);
  const [selectedTx, setSelectedTx] = useState<HalalTransaction | null>(null);
  const [searchHash, setSearchHash] = useState<string>('');

  const activeBlock = blockchain[selectedBlockIndex] || blockchain[0];

  const filteredBlocks = blockchain.filter((b) => {
    if (!searchHash.trim()) return true;
    const q = searchHash.toLowerCase();
    return (
      b.hash.toLowerCase().includes(q) ||
      b.previousHash.toLowerCase().includes(q) ||
      b.merkleRoot.toLowerCase().includes(q) ||
      b.validator.nodeId.toLowerCase().includes(q) ||
      b.transactions.some((tx) => tx.batchId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Cryptographic Consensus Status */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                SHA-256 IMMUTABLE LEDGER
              </span>
              <span className="text-xs text-neutral-500">
                Malaysian Halal Traceability Consortium Nodes
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-neutral-900 mt-1">
              Consortium Blockchain Explorer
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live inspection of cryptographic block headers, Merkle roots, and consensus validations across JAKIM, DVS, and certified logistics providers.
            </p>
          </div>

          {/* Tamper Testing & Integrity Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={onAuditChain}
              className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Hashes</span>
            </button>

            <button
              onClick={onSimulateTamper}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Simulate Fraudulent Alteration</span>
            </button>

            <button
              onClick={onRestoreLedger}
              className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Health Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
            verificationResult.valid
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          {verificationResult.valid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono tracking-wide">
                {verificationResult.valid
                  ? 'LEDGER INTEGRITY VERIFIED (ALL HASHES MATCHED)'
                  : 'TAMPER ALERT: CRYPTOGRAPHIC CONSENSUS BREACHED'}
              </h4>
              <span className="text-[10px] font-mono opacity-70">
                Audited {verificationResult.checkedBlocksCount} Blocks
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {verificationResult.valid
                ? 'All parent hashes and Merkle root trees match exact SHA-256 cryptographic signatures. No unauthorized data modifications detected.'
                : verificationResult.reason}
            </p>
          </div>
        </div>

        {/* Search Bar for Blocks & Hashes */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search block hash, previous hash, validator node, or batch ID..."
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Blocks Strip & Detailed Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chain Blocks Navigation List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider px-1">
            Mined Consortium Blocks ({blockchain.length})
          </h3>

          <div className="space-y-2.5">
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlockIndex === block.index;
              const isTampered = block.isTampered;
              return (
                <div
                  key={block.index}
                  onClick={() => setSelectedBlockIndex(block.index)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isTampered
                      ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400'
                      : isSelected
                      ? 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        Block #{block.index}
                      </span>
                      {block.index === 0 && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-neutral-900 text-white rounded">
                          Genesis
                        </span>
                      )}
                      {isTampered && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-red-600 text-white rounded font-bold animate-pulse">
                          Tampered!
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                      {block.transactions.length} txs
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-neutral-600 truncate mt-1">
                    Hash: <span className={isTampered ? 'text-red-700 font-bold' : 'text-neutral-900'}>{block.hash}</span>
                  </p>

                  <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="truncate max-w-[200px]">{block.validator.name}</span>
                    <span className="font-mono">{block.timestampIso.split('T')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Block Deep Inspector */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs font-mono text-neutral-500">BLOCK DETAILS</span>
              <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">
                Block #{activeBlock.index} Inspector
              </h3>
            </div>
            <span className="px-3 py-1 text-xs font-mono bg-neutral-100 text-neutral-800 rounded-lg">
              Nonce: {activeBlock.nonce}
            </span>
          </div>

          {/* Cryptographic Parameters Grid */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">Block Hash (SHA-256)</span>
              <p className={`font-semibold break-all text-xs ${activeBlock.isTampered ? 'text-red-700' : 'text-emerald-900'}`}>
                {activeBlock.hash}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">Previous Block Parent Hash</span>
              <p className="font-semibold break-all text-xs text-neutral-700">
                {activeBlock.previousHash}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">Transactions Merkle Root</span>
              <p className="font-semibold break-all text-xs text-neutral-800">
                {activeBlock.merkleRoot}
              </p>
            </div>
          </div>

          {/* Validator Node Signature */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-900">
                VALIDATOR CONSENSUS NODE
              </span>
              <span className="text-[10px] font-mono text-emerald-700">
                {activeBlock.validator.nodeId}
              </span>
            </div>
            <p className="font-bold text-neutral-900">{activeBlock.validator.name}</p>
            <p className="text-neutral-600 text-[11px]">{activeBlock.validator.institution}</p>
            <p className="text-[10px] font-mono text-neutral-500 truncate pt-1">
              Sig: {activeBlock.validator.signature}
            </p>
          </div>

          {/* Transactions in Block */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-neutral-700 uppercase">
              Transactions & Consignment Events ({activeBlock.transactions.length})
            </h4>

            <div className="space-y-2">
              {activeBlock.transactions.map((tx, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTx(tx)}
                  className="p-3.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5 truncate mr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">
                        {tx.batchId}
                      </span>
                      <span className="text-[10px] font-mono bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded">
                        {tx.stage}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 truncate">{tx.productName}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{tx.details}</p>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs shrink-0">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Inspection Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-neutral-900 font-mono">
                  Tx: {selectedTx.txHash.slice(0, 16)}...
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 text-[10px] font-mono">BATCH ID</span>
                <p className="font-bold text-neutral-900 font-mono text-sm">{selectedTx.batchId}</p>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] font-mono">PRODUCT</span>
                <p className="font-semibold text-neutral-900">{selectedTx.productName}</p>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] font-mono">ACTOR</span>
                <p className="text-neutral-800">{selectedTx.actor}</p>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] font-mono">DETAILS</span>
                <p className="text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200 leading-relaxed">
                  {selectedTx.details}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] font-mono">DIGITAL SIGNATURE</span>
                <p className="font-mono text-[10px] text-neutral-600 break-all bg-neutral-100 p-2 rounded">
                  {selectedTx.signature}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
