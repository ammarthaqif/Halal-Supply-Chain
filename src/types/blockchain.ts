export type SupplyChainStage = 
  | 'FARM_ORIGIN'
  | 'HALAL_SLAUGHTER'
  | 'COLD_CHAIN'
  | 'DISTRIBUTION'
  | 'RESTAURANT_KITCHEN';

export type StorageType = 'CHILLED_0_4C' | 'FROZEN_NEG_18C' | 'AMBIENT';

export interface HalalCheckpointEvent {
  stage: SupplyChainStage;
  title: string;
  stageNameMalay: string;
  location: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  jakimComplianceProof: string;
  details: string;
  telemetry: {
    tempC?: number;
    humidity?: number;
    gps?: { lat: number; lng: number };
    sealNumber?: string;
    vehiclePlate?: string;
    sanitizationId?: string;
    slaughtererId?: string;
    slaughtererName?: string;
    cutDetails?: string;
    feedCertification?: string;
  };
  hash: string;
  signature: string;
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  sku: string;
  name: string;
  category: 'BEEF' | 'POULTRY' | 'LAMB' | 'GROCERY' | 'SEAFOOD';
  subCategory: string;
  weightKg: number;
  unitPriceMYR: number;
  stockAvailableKg: number;
  originFarm: string;
  stateOrRegion: string;
  slaughterhouse: string;
  jakimCertRef: string;
  slaughtererId: string;
  slaughtererName: string;
  slaughterDate: string;
  storageType: StorageType;
  currentTemperatureC: number;
  image: string;
  toyyibanRating: 'A+' | 'A';
  verifiedStatus: 'VERIFIED' | 'FLAGGED';
  description: string;
  events: HalalCheckpointEvent[];
}

export interface HalalTransaction {
  txHash: string;
  batchId: string;
  productName: string;
  stage: SupplyChainStage;
  actor: string;
  details: string;
  signature: string;
  toyyibanStatus: 'COMPLIANT' | 'FLAGGED';
  timestamp: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: number;
  timestampIso: string;
  previousHash: string;
  hash: string;
  merkleRoot: string;
  nonce: number;
  validator: {
    name: string;
    nodeId: string;
    institution: string;
    signature: string;
  };
  transactions: HalalTransaction[];
  isTampered?: boolean;
}

export interface ChainVerificationResult {
  valid: boolean;
  brokenAtIndex?: number;
  reason?: string;
  checkedBlocksCount: number;
  timestamp: string;
}

export interface EscrowContract {
  id: string;
  batchId: string;
  productName: string;
  restaurantName: string;
  supplierName: string;
  quantityKg: number;
  totalMYR: number;
  status: 'LOCKED_IN_ESCROW' | 'RELEASED_TO_SUPPLIER' | 'REFUNDED_BREACH';
  conditions: {
    maxTempAllowedC: number;
    sealMustMatch: string;
    tempBreached: boolean;
    sealVerified: boolean;
  };
  createdAt: string;
}
