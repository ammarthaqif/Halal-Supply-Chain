import { 
  BlockchainBlock, 
  BatchItem, 
  HalalTransaction, 
  ChainVerificationResult,
  HalalCheckpointEvent 
} from '../types/blockchain';

// Fallback SHA-256 implementation if crypto.subtle is unavailable
function fallbackSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
  }

  for (j = 0; j < words[lengthProperty]; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);

      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0, a, hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export function calculateSha256(data: string): string {
  return fallbackSha256(data);
}

// Merkle Root Calculator
export function calculateMerkleRoot(transactions: HalalTransaction[]): string {
  if (transactions.length === 0) {
    return calculateSha256('EMPTY_BLOCK');
  }

  let hashes = transactions.map((tx) => tx.txHash || calculateSha256(JSON.stringify(tx)));

  while (hashes.length > 1) {
    if (hashes.length % 2 !== 0) {
      hashes.push(hashes[hashes.length - 1]);
    }
    const newLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      newLevel.push(calculateSha256(hashes[i] + hashes[i + 1]));
    }
    hashes = newLevel;
  }

  return hashes[0];
}

// Compute Block Hash
export function computeBlockHash(
  index: number,
  timestamp: number,
  previousHash: string,
  merkleRoot: string,
  nonce: number
): string {
  const content = `${index}|${timestamp}|${previousHash}|${merkleRoot}|${nonce}`;
  return calculateSha256(content);
}

// Initial Sample Batches Data (Authentic Malaysian Halal Supply Chain)
export const INITIAL_BATCHES: BatchItem[] = [
  {
    id: 'batch-01',
    batchNumber: 'MY-BEEF-2026-PERAK-0418',
    sku: 'HL-BF-RIB-PRK',
    name: 'Perak Grass-Fed Brahman Prime Ribeye',
    category: 'BEEF',
    subCategory: 'Chilled Fresh Cuts',
    weightKg: 85.0,
    unitPriceMYR: 78.5,
    stockAvailableKg: 85.0,
    originFarm: 'Ladang Hijau Agro Farm, Sungai Siput',
    stateOrRegion: 'Perak Darul Ridzuan',
    slaughterhouse: 'Rumah Penyembelihan Halal Zon Utara (RPA Ipoh)',
    jakimCertRef: 'JAKIM/(S)/(22.00)/492/2/1 018-04',
    slaughtererId: 'MY-HAL-SL-441',
    slaughtererName: 'Ustaz Ahmad Khairuddin bin Hashim',
    slaughterDate: '2026-11-02T05:30:00Z',
    storageType: 'CHILLED_0_4C',
    currentTemperatureC: 1.8,
    image: '/src/assets/images/halal_farm_livestock_1793807995810.jpg',
    toyyibanRating: 'A+',
    verifiedStatus: 'VERIFIED',
    description: 'Pasture-raised Brahman beef fed on 100% organic Napier grass and mineral supplements with zero porcine or non-halal animal proteins. Certified DVS healthy livestock, slaughtered strictly in accordance with MS 1500:2019.',
    events: [
      {
        stage: 'FARM_ORIGIN',
        title: 'Livestock Husbandry & Veterinary Health Clearance',
        stageNameMalay: 'Asal-Usul Ladang & Kesihatan Ternakan',
        location: 'Ladang Hijau Agro, Sungai Siput, Perak',
        actorName: 'Dato’ Dr. Rosli Ismail',
        actorRole: 'Livestock Breeder & DVS Accredited Vet',
        timestamp: '2026-10-28 09:00 MYT',
        jakimComplianceProof: 'DVS Health Permit #DVS-PRK-88219 / Feed Halal Cert #JAKIM-FD-2025-091',
        details: 'Ear-Tag RFID #PRK-8422 verified. Diet: Organic Napier grass, palm kernel cake (halal certified). Blood test negative for prohibited hormones and animal by-products.',
        telemetry: {
          feedCertification: 'Zero porcine meal / 100% plant & mineral based',
          gps: { lat: 4.8192, lng: 101.0734 },
        },
        hash: calculateSha256('EVENT_FARM_MY-BEEF-2026-PERAK-0418'),
        signature: '0x8849b2c4189e3fa0982d77bc3a912e7741f',
      },
      {
        stage: 'HALAL_SLAUGHTER',
        title: 'Islamic Halal Slaughter (Dhabh Shari’ah)',
        stageNameMalay: 'Penyembelihan Halal Patuh Syariah',
        location: 'Rumah Penyembelihan Halal Zon Utara, Ipoh',
        actorName: 'Ustaz Ahmad Khairuddin bin Hashim',
        actorRole: 'Certified Halal Slaughterer (JAKIM Reg: MY-HAL-SL-441)',
        timestamp: '2026-11-02 05:30 MYT',
        jakimComplianceProof: 'JAKIM Slaughter License #JAKIM/(S)/(22.00)/492/2/1 018-04',
        details: 'Manual halal cut without stunning. Tasmiyah ("Bismillahi Allahu Akbar") continuously recited. Complete severance of Halkum (trachea), Mari’ (esophagus), and both Wadajain (jugular & carotid). Bleed-out duration: 6 minutes 45 seconds.',
        telemetry: {
          slaughtererId: 'MY-HAL-SL-441',
          slaughtererName: 'Ustaz Ahmad Khairuddin bin Hashim',
          cutDetails: 'Full severance of Halkum, Mari, and both Wadajain vessels verified by on-site Halal Inspector',
        },
        hash: calculateSha256('EVENT_SLAUGHTER_MY-BEEF-2026-PERAK-0418'),
        signature: '0x4981fae929bba80031dc912a7732bb812c',
      },
      {
        stage: 'COLD_CHAIN',
        title: 'Halal Dedicated Refrigerated Logistics',
        stageNameMalay: 'Logistik Rantaian Sejuk Halal Khusus',
        location: 'PLUS North-South Expressway -> Klang Valley',
        actorName: 'SwiftHalal Cold-Chain Logistics (Fleet Unit H-14)',
        actorRole: 'Cold-Chain Logistics Carrier (MS 2400 Certified)',
        timestamp: '2026-11-02 14:15 MYT',
        jakimComplianceProof: 'MS 2400:2019 Halal Supply Chain Cert #MS2400-SWIFT-0994',
        details: 'Reefer truck cargo hold cleansed via Sertu/Samak procedure before loading. Zero co-loading with non-halal items. Live IoT temperature telemetry logged continuously at +1.8°C (Threshold: 0°C to +4°C).',
        telemetry: {
          tempC: 1.8,
          humidity: 84,
          vehiclePlate: 'WXX 8921 H',
          sealNumber: 'SEAL-MY-JAKIM-99814',
          sanitizationId: 'SERTU-REG-2026-11-01-A',
        },
        hash: calculateSha256('EVENT_COLD_MY-BEEF-2026-PERAK-0418'),
        signature: '0x1034fead924911ba84732100cb9219488a',
      },
      {
        stage: 'DISTRIBUTION',
        title: 'Central Halal Wholesale Intake & QR Tagging',
        stageNameMalay: 'Penerimaan Hab Pengedaran Halal Shah Alam',
        location: 'Shah Alam Halal Distribution Park, Section 22',
        actorName: 'HalalChain Central Distribution Hub',
        actorRole: 'Consortium Logistics Validator',
        timestamp: '2026-11-03 08:30 MYT',
        jakimComplianceProof: 'Batch Consignment ID #MY-BEEF-2026-PERAK-0418-QR',
        details: 'Tamper seal intact. Carcass core temperature verified at +2.1°C. QR smart passport minted on blockchain. Ready for restaurant procurement.',
        telemetry: {
          tempC: 2.1,
          humidity: 82,
          sealNumber: 'SEAL-MY-JAKIM-99814',
        },
        hash: calculateSha256('EVENT_DIST_MY-BEEF-2026-PERAK-0418'),
        signature: '0xaa948123bc0912fa89bca71253648910cd',
      },
      {
        stage: 'RESTAURANT_KITCHEN',
        title: 'Restaurant Owner QR Verification & Kitchen Intake',
        stageNameMalay: 'Pengesahan Dapur Restoran & Jamuan Halal',
        location: 'Restoran Makmor Steak & Grill, Bangsar Baru, Kuala Lumpur',
        actorName: 'Chef Ammar Thaqif (Executive Chef & Halal Supervisor)',
        actorRole: 'Restaurant Kitchen & Halal Committee',
        timestamp: '2026-11-03 16:45 MYT',
        jakimComplianceProof: 'Restoran Halal SPHM Cert #JAKIM/(S)/(22.00)/492/1 042-01',
        details: 'Delivered directly to kitchen cold room. Chef scanned batch QR code, verified block Merkle proof on HalalChain, logged into SPHM restaurant audit book.',
        telemetry: {
          tempC: 2.0,
        },
        hash: calculateSha256('EVENT_REST_MY-BEEF-2026-PERAK-0418'),
        signature: '0xcc19284ba009384758210984920aa9128b',
      },
    ],
  },
  {
    id: 'batch-02',
    batchNumber: 'MY-CHK-2026-SEL-0922',
    sku: 'HL-POULTRY-KPG',
    name: 'Ayam Kampung Organik Selangor (Whole Chilled)',
    category: 'POULTRY',
    subCategory: 'Free-Range Organic Poultry',
    weightKg: 120.0,
    unitPriceMYR: 26.0,
    stockAvailableKg: 120.0,
    originFarm: 'Bukit Cherakah Eco Poultry Farm, Kuala Selangor',
    stateOrRegion: 'Selangor Darul Ehsan',
    slaughterhouse: 'Pusat Penyembelihan Unggas Halal Klang (RPA Klang)',
    jakimCertRef: 'JAKIM/(S)/(22.00)/492/2/1 094-11',
    slaughtererId: 'MY-HAL-SL-812',
    slaughtererName: 'Mohd Fadzil bin Sulaiman',
    slaughterDate: '2026-11-03T04:00:00Z',
    storageType: 'CHILLED_0_4C',
    currentTemperatureC: 2.3,
    image: '/src/assets/images/halal_abattoir_facility_1793807996477.jpg',
    toyyibanRating: 'A+',
    verifiedStatus: 'VERIFIED',
    description: 'Free-range kampung chicken naturally raised without antibiotic growth promoters or synthetic hormones. Hand-slaughtered by certified Muslim personnel with strict tracheal-esophageal severance checks.',
    events: [
      {
        stage: 'FARM_ORIGIN',
        title: 'Organic Husbandry & Natural Foraging',
        stageNameMalay: 'Ternakan Organik Bebas Sangkar',
        location: 'Bukit Cherakah, Kuala Selangor',
        actorName: 'Hj. Ismail Kassim',
        actorRole: 'Poultry Farm Director',
        timestamp: '2026-10-30 08:00 MYT',
        jakimComplianceProof: 'myOrganic Certificate #ORG-MY-SL-2291 / DVS Poultry Permit #DVS-SEL-712',
        details: 'Broiler flock raised for 75 days. Probiotic fermented corn & bran diet. Zero animal tallow or bone meal.',
        telemetry: {
          feedCertification: '100% Plant Grain & Probiotic Feed',
        },
        hash: calculateSha256('EVENT_FARM_MY-CHK-2026-SEL-0922'),
        signature: '0x993184ab81923fae8812cba912440182bc',
      },
      {
        stage: 'HALAL_SLAUGHTER',
        title: 'Manual Islamic Halal Poultry Dhabh',
        stageNameMalay: 'Penyembelihan Ayam Halal Secara Manual',
        location: 'Pusat Penyembelihan Unggas Halal Klang',
        actorName: 'Mohd Fadzil bin Sulaiman',
        actorRole: 'JAKIM Certified Poultry Slaughterer',
        timestamp: '2026-11-03 04:00 MYT',
        jakimComplianceProof: 'JAKIM Poultry Slaughter License #JAKIM/(S)/(22.00)/492/2/1 094-11',
        details: 'Non-stunned halal manual hand slaughter. Razor-sharp knife exceeding 4x neck diameter. Tasmiyah recited. Scalding tank temperature maintained strictly at 58°C to prevent carcass contamination.',
        telemetry: {
          slaughtererId: 'MY-HAL-SL-812',
          slaughtererName: 'Mohd Fadzil bin Sulaiman',
          cutDetails: 'Complete cut of windpipe, gullet and jugular veins.',
        },
        hash: calculateSha256('EVENT_SLAUGHTER_MY-CHK-2026-SEL-0922'),
        signature: '0x55192847ba92019b88273645192a00918c',
      },
      {
        stage: 'COLD_CHAIN',
        title: 'Chilled Air Blast & Cold Storage Transfer',
        stageNameMalay: 'Penyejukan Udara Pantas & Pengangkutan Sejuk',
        location: 'Klang -> Petaling Jaya Logistics Route',
        actorName: 'Halal Express Chilled Fleet (Unit V-03)',
        actorRole: 'Cold-Chain Logistics Carrier',
        timestamp: '2026-11-03 07:15 MYT',
        jakimComplianceProof: 'MS 2400:2019 Clean Transport Cert #MS2400-HEXP-104',
        details: 'Air chill cooling to +2°C within 45 mins. Tamper seal attached. Transit to PJ distribution depot.',
        telemetry: {
          tempC: 2.3,
          humidity: 80,
          vehiclePlate: 'BQU 9182',
          sealNumber: 'SEAL-SEL-0922-POULTRY',
        },
        hash: calculateSha256('EVENT_COLD_MY-CHK-2026-SEL-0922'),
        signature: '0x12948019aa9238472910394875618290bc',
      },
    ],
  },
  {
    id: 'batch-03',
    batchNumber: 'MY-WAGYU-2026-QLD-1102',
    sku: 'HL-IMP-WGY-MB7',
    name: 'Australian Halal Black Angus Wagyu Striploin MB7+',
    category: 'BEEF',
    subCategory: 'Imported Premium Halal Beef',
    weightKg: 60.0,
    unitPriceMYR: 195.0,
    stockAvailableKg: 60.0,
    originFarm: 'Darling Downs Pastoral, Queensland (DVS Approved)',
    stateOrRegion: 'Queensland, Australia (Imported)',
    slaughterhouse: 'Teys Australia Abattoir (HCAA Halal Certified #HCAA-319)',
    jakimCertRef: 'JAKIM Recognized FHCB / MAQIS Import Permit #MAQIS-IMP-2026-4412',
    slaughtererId: 'HCAA-SL-1092',
    slaughtererName: 'Br. Zayd Mansoor',
    slaughterDate: '2026-10-18T08:00:00Z',
    storageType: 'FROZEN_NEG_18C',
    currentTemperatureC: -19.2,
    image: '/src/assets/images/halal_restaurant_chef_1793807997665.jpg',
    toyyibanRating: 'A+',
    verifiedStatus: 'VERIFIED',
    description: 'Genuine Wagyu beef imported from JAKIM-recognized Foreign Halal Certification Body (Halal Certification Authority Australia - HCAA). Cleared by MAQIS & DVS at Port Klang container terminal with strict cold-chain quarantine logs.',
    events: [
      {
        stage: 'FARM_ORIGIN',
        title: 'Australian Wagyu Breeding & DVS Quarantine Audit',
        stageNameMalay: 'Pembiakan Wagyu Australia & Audit Kuarantin DVS',
        location: 'Darling Downs, Queensland, Australia',
        actorName: 'Darling Downs Livestock Trust',
        actorRole: 'Accredited Export Cattle Station',
        timestamp: '2026-10-10 10:00 AEST',
        jakimComplianceProof: 'Australian Government AQIS Health Certificate #AQIS-EX-99120',
        details: 'Full bloodline Wagyu with NLIS electronic ear tags. Grain finishing on non-animal formulated rations.',
        telemetry: {
          feedCertification: 'Australian Certified Halal Grain Rations',
        },
        hash: calculateSha256('EVENT_FARM_MY-WAGYU-2026-QLD-1102'),
        signature: '0x44910284758192a091823746591028374a',
      },
      {
        stage: 'HALAL_SLAUGHTER',
        title: 'JAKIM-Recognized FHCB Halal Slaughter',
        stageNameMalay: 'Penyembelihan Halal Badan Diiktiraf JAKIM Luar Negara',
        location: 'Teys Australia Certified Abattoir, QLD',
        actorName: 'Br. Zayd Mansoor (HCAA Registered)',
        actorRole: 'HCAA Certified Muslim Slaughterman',
        timestamp: '2026-10-18 08:00 AEST',
        jakimComplianceProof: 'HCAA Halal Meat Certificate #HCAA-319 / JAKIM Mutual Recognition List #04',
        details: 'Slaughtered individually under the direct supervision of Halal Certification Authority Australia (JAKIM recognized FHCB). Continuous Tasmiyah.',
        telemetry: {
          slaughtererId: 'HCAA-SL-1092',
          slaughtererName: 'Br. Zayd Mansoor',
        },
        hash: calculateSha256('EVENT_SLAUGHTER_MY-WAGYU-2026-QLD-1102'),
        signature: '0x772184903847562910384756192038471b',
      },
      {
        stage: 'COLD_CHAIN',
        title: 'Ocean Reefer Container to Port Klang & MAQIS Clearance',
        stageNameMalay: 'Kontena Sejuk Beku Ke Pelabuhan Klang & Pemeriksaan MAQIS',
        location: 'Port Klang Container Terminal -> Shah Alam Central Cold Hub',
        actorName: 'Malaysian Quarantine & Inspection Services (MAQIS) & Trans-Ocean Cold',
        actorRole: 'Border Inspection Agency & Logistics Carrier',
        timestamp: '2026-10-31 11:20 MYT',
        jakimComplianceProof: 'MAQIS Import Clearance #MAQIS-IMP-2026-4412',
        details: 'Continuous temperature logging throughout 12-day maritime journey at -19.4°C. DVS physical carcass inspection and Halal seal verification completed at Port Klang gate.',
        telemetry: {
          tempC: -19.2,
          humidity: 70,
          sealNumber: 'MAQIS-SEAL-PORTKLANG-8812',
          vehiclePlate: 'BNC 4410',
        },
        hash: calculateSha256('EVENT_COLD_MY-WAGYU-2026-QLD-1102'),
        signature: '0x339102847561928374659102837465192c',
      },
    ],
  },
  {
    id: 'batch-04',
    batchNumber: 'MY-SPICE-2026-PNG-0104',
    sku: 'HL-GROC-SPC-PNG',
    name: 'Penang Artisanal Halal Spice & Sambal Paste Hub',
    category: 'GROCERY',
    subCategory: 'Halal Seasonings & Bulk Spices',
    weightKg: 250.0,
    unitPriceMYR: 18.0,
    stockAvailableKg: 250.0,
    originFarm: 'Balik Pulau Organic Agro Estate, Pulau Pinang',
    stateOrRegion: 'Pulau Pinang',
    slaughterhouse: 'Halal Food Processing Hub Bayan Lepas',
    jakimCertRef: 'JAKIM/(S)/(22.00)/492/1 002-09',
    slaughtererId: 'N/A (Plant-Based Certified)',
    slaughtererName: 'Puan Halimah binti Ramli (Halal Executive)',
    slaughterDate: '2026-11-01T10:00:00Z',
    storageType: 'AMBIENT',
    currentTemperatureC: 24.5,
    image: '/src/assets/images/halal_grocery_wholesale_1793807997179.jpg',
    toyyibanRating: 'A+',
    verifiedStatus: 'VERIFIED',
    description: 'Pure heritage turmeric, dried chilies, lemongrass, and natural palm oil paste batch. Formulated with zero non-halal emulsifiers, zero pork gelatin, zero cochineal (E120), and 100% natural botanical ingredients.',
    events: [
      {
        stage: 'FARM_ORIGIN',
        title: 'Agricultural Harvesting & Botanical Purity Test',
        stageNameMalay: 'Tuaian Pertanian & Ujian Ketulenan Botani',
        location: 'Balik Pulau, Pulau Pinang',
        actorName: 'Warisan Rempah Pulau Pinang',
        actorRole: 'Estate Cultivator',
        timestamp: '2026-10-25 08:30 MYT',
        jakimComplianceProof: 'Jabatan Pertanian Malaysia MyGAP Cert #MYGAP-PNG-110',
        details: 'Organic harvesting of bird’s eye chili, turmeric rhizomes, and fresh galangal without chemical residue.',
        telemetry: {
          feedCertification: 'MyGAP Good Agricultural Practice Certified',
        },
        hash: calculateSha256('EVENT_FARM_MY-SPICE-2026-PNG-0104'),
        signature: '0x881294875619283746591028374651928d',
      },
      {
        stage: 'DISTRIBUTION',
        title: 'Halal Formulation & Tamper-Evident Packaging',
        stageNameMalay: 'Formulasi Halal & Pembungkusan Kedap Udara',
        location: 'Bayan Lepas Halal Industrial Park, Penang',
        actorName: 'Puan Halimah binti Ramli (Halal Executive)',
        actorRole: 'Certified Halal Executive (HPB Registered)',
        timestamp: '2026-11-01 10:00 MYT',
        jakimComplianceProof: 'JAKIM SPHM Product Certificate #JAKIM/(S)/(22.00)/492/1 002-09',
        details: 'Lab tested for alcohol content (<0.5% natural threshold, zero intoxicating additive). All food contact surfaces certified Halal Toyyiban compliant.',
        telemetry: {
          tempC: 24.5,
          humidity: 55,
          sealNumber: 'SEAL-PNG-SPICE-0104',
        },
        hash: calculateSha256('EVENT_PROC_MY-SPICE-2026-PNG-0104'),
        signature: '0x992019283746519283746519283746519e',
      },
    ],
  },
];

// Pre-seeded Blockchain Blocks
export function createInitialBlockchain(): BlockchainBlock[] {
  // Block 0: Genesis Block
  const genesisTimestamp = 1793700000000;
  const genesisTx: HalalTransaction[] = [
    {
      txHash: calculateSha256('GENESIS_TX_CONSORTIUM_ESTABLISHMENT'),
      batchId: 'GENESIS-MY-CONSORTIUM-2026',
      productName: 'HalalChain Malaysia Genesis Root Block',
      stage: 'DISTRIBUTION',
      actor: 'JAKIM & DVS National Halal Traceability Node',
      details: 'Genesis Consortium Anchor: Initialized with Malaysian Halal Standard MS 1500:2019 & MS 2400:2019 parameters.',
      signature: '0x0000000000000000000000000000000000000000000000000000000000000000',
      toyyibanStatus: 'COMPLIANT',
      timestamp: new Date(genesisTimestamp).toISOString(),
    },
  ];
  const genesisMerkle = calculateMerkleRoot(genesisTx);
  const genesisHash = computeBlockHash(0, genesisTimestamp, '0000000000000000000000000000000000000000000000000000000000000000', genesisMerkle, 1024);

  const block0: BlockchainBlock = {
    index: 0,
    timestamp: genesisTimestamp,
    timestampIso: new Date(genesisTimestamp).toISOString(),
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: genesisHash,
    merkleRoot: genesisMerkle,
    nonce: 1024,
    validator: {
      name: 'JAKIM National Root Node #01',
      nodeId: 'NODE-JAKIM-PUTRAJAYA',
      institution: 'Jabatan Kemajuan Islam Malaysia (JAKIM)',
      signature: '0xjakimrootvalidator998124',
    },
    transactions: genesisTx,
  };

  // Block 1: Perak Beef Batch Farm & Slaughter Events
  const b1Timestamp = genesisTimestamp + 3600000 * 24;
  const b1Tx: HalalTransaction[] = [
    {
      txHash: calculateSha256('TX_MY-BEEF-2026-PERAK-0418_ORIGIN'),
      batchId: 'MY-BEEF-2026-PERAK-0418',
      productName: 'Perak Grass-Fed Brahman Prime Ribeye',
      stage: 'FARM_ORIGIN',
      actor: 'Ladang Hijau Agro Farm (DVS-PRK-88219)',
      details: 'Livestock origin, organic feed verification, RFID ear-tag PRK-8422 recorded.',
      signature: '0x8849b2c4189e3fa0982d77bc3a912e7741f',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-10-28T01:00:00Z',
    },
    {
      txHash: calculateSha256('TX_MY-BEEF-2026-PERAK-0418_SLAUGHTER'),
      batchId: 'MY-BEEF-2026-PERAK-0418',
      productName: 'Perak Grass-Fed Brahman Prime Ribeye',
      stage: 'HALAL_SLAUGHTER',
      actor: 'Rumah Penyembelihan Halal Zon Utara (Ustaz Ahmad Khairuddin)',
      details: 'Islamic Dhabh, continuous Basmalah, complete windpipe/gullet severance confirmed.',
      signature: '0x4981fae929bba80031dc912a7732bb812c',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-11-02T05:30:00Z',
    },
  ];
  const b1Merkle = calculateMerkleRoot(b1Tx);
  const b1Hash = computeBlockHash(1, b1Timestamp, block0.hash, b1Merkle, 4291);
  const block1: BlockchainBlock = {
    index: 1,
    timestamp: b1Timestamp,
    timestampIso: new Date(b1Timestamp).toISOString(),
    previousHash: block0.hash,
    hash: b1Hash,
    merkleRoot: b1Merkle,
    nonce: 4291,
    validator: {
      name: 'Perak State Veterinary Authority Node',
      nodeId: 'NODE-DVS-PERAK-02',
      institution: 'Jabatan Perkhidmatan Veterinar Perak',
      signature: '0xdvsperaknodesig8841',
    },
    transactions: b1Tx,
  };

  // Block 2: Cold-Chain Logistics & Distribution Events
  const b2Timestamp = b1Timestamp + 3600000 * 12;
  const b2Tx: HalalTransaction[] = [
    {
      txHash: calculateSha256('TX_MY-BEEF-2026-PERAK-0418_LOGISTICS'),
      batchId: 'MY-BEEF-2026-PERAK-0418',
      productName: 'Perak Grass-Fed Brahman Prime Ribeye',
      stage: 'COLD_CHAIN',
      actor: 'SwiftHalal Cold-Chain Fleet Unit H-14',
      details: 'Sertu sanitization valid, dedicated halal carrier, temperature stable at +1.8°C.',
      signature: '0x1034fead924911ba84732100cb9219488a',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-11-02T14:15:00Z',
    },
    {
      txHash: calculateSha256('TX_MY-CHK-2026-SEL-0922_ALL'),
      batchId: 'MY-CHK-2026-SEL-0922',
      productName: 'Ayam Kampung Organik Selangor (Whole Chilled)',
      stage: 'HALAL_SLAUGHTER',
      actor: 'Pusat Penyembelihan Unggas Halal Klang',
      details: 'Hand-slaughtered poultry, no non-halal cross contact, scalding temp 58°C verified.',
      signature: '0x55192847ba92019b88273645192a00918c',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-11-03T04:00:00Z',
    },
  ];
  const b2Merkle = calculateMerkleRoot(b2Tx);
  const b2Hash = computeBlockHash(2, b2Timestamp, block1.hash, b2Merkle, 8820);
  const block2: BlockchainBlock = {
    index: 2,
    timestamp: b2Timestamp,
    timestampIso: new Date(b2Timestamp).toISOString(),
    previousHash: block1.hash,
    hash: b2Hash,
    merkleRoot: b2Merkle,
    nonce: 8820,
    validator: {
      name: 'Selangor Halal Logistics Oversight Node',
      nodeId: 'NODE-JAIS-HALAL-04',
      institution: 'Jabatan Agama Islam Selangor (JAIS)',
      signature: '0xjaishalalnodesig1029',
    },
    transactions: b2Tx,
  };

  // Block 3: Australian Wagyu Import & Port Klang Customs Inspection
  const b3Timestamp = b2Timestamp + 3600000 * 18;
  const b3Tx: HalalTransaction[] = [
    {
      txHash: calculateSha256('TX_MY-WAGYU-2026-QLD-1102_CUSTOMS'),
      batchId: 'MY-WAGYU-2026-QLD-1102',
      productName: 'Australian Halal Black Angus Wagyu Striploin MB7+',
      stage: 'COLD_CHAIN',
      actor: 'MAQIS Port Klang & Trans-Ocean Cold Hub',
      details: 'MAQIS import clearance #MAQIS-IMP-2026-4412, HCAA foreign halal body verified.',
      signature: '0x339102847561928374659102837465192c',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-10-31T11:20:00Z',
    },
    {
      txHash: calculateSha256('TX_MY-SPICE-2026-PNG-0104_PACK'),
      batchId: 'MY-SPICE-2026-PNG-0104',
      productName: 'Penang Artisanal Halal Spice & Sambal Paste Hub',
      stage: 'DISTRIBUTION',
      actor: 'Bayan Lepas Halal Industrial Hub',
      details: 'Pure botanical harvest, certified 0% alcohol/porcine emulsifiers, JAKIM SPHM cert active.',
      signature: '0x992019283746519283746519283746519e',
      toyyibanStatus: 'COMPLIANT',
      timestamp: '2026-11-01T10:00:00Z',
    },
  ];
  const b3Merkle = calculateMerkleRoot(b3Tx);
  const b3Hash = computeBlockHash(3, b3Timestamp, block2.hash, b3Merkle, 12044);
  const block3: BlockchainBlock = {
    index: 3,
    timestamp: b3Timestamp,
    timestampIso: new Date(b3Timestamp).toISOString(),
    previousHash: block2.hash,
    hash: b3Hash,
    merkleRoot: b3Merkle,
    nonce: 12044,
    validator: {
      name: 'MAQIS Quarantine Gateway Node',
      nodeId: 'NODE-MAQIS-PORTKLANG-01',
      institution: 'Malaysian Quarantine & Inspection Services',
      signature: '0xmaqisportklangvalidator771',
    },
    transactions: b3Tx,
  };

  return [block0, block1, block2, block3];
}

// Full cryptographic chain integrity audit
export function verifyBlockchainIntegrity(chain: BlockchainBlock[]): ChainVerificationResult {
  if (!chain || chain.length === 0) {
    return {
      valid: false,
      reason: 'Ledger contains zero blocks.',
      checkedBlocksCount: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Genesis block check
  const genesis = chain[0];
  const expectedGenesisMerkle = calculateMerkleRoot(genesis.transactions);
  const expectedGenesisHash = computeBlockHash(
    genesis.index,
    genesis.timestamp,
    genesis.previousHash,
    expectedGenesisMerkle,
    genesis.nonce
  );

  if (genesis.hash !== expectedGenesisHash) {
    return {
      valid: false,
      brokenAtIndex: 0,
      reason: `Genesis block hash mismatch! Found: ${genesis.hash.slice(0, 12)}..., Expected: ${expectedGenesisHash.slice(0, 12)}...`,
      checkedBlocksCount: 1,
      timestamp: new Date().toISOString(),
    };
  }

  // Verify all subsequent blocks
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const prev = chain[i - 1];

    // Check 1: Previous Hash linkage
    if (current.previousHash !== prev.hash) {
      return {
        valid: false,
        brokenAtIndex: i,
        reason: `Cryptographic link severed at Block #${i}! Previous hash reference does not match parent Block #${i - 1} hash.`,
        checkedBlocksCount: i + 1,
        timestamp: new Date().toISOString(),
      };
    }

    // Check 2: Merkle Root integrity
    const calculatedMerkle = calculateMerkleRoot(current.transactions);
    if (current.merkleRoot !== calculatedMerkle) {
      return {
        valid: false,
        brokenAtIndex: i,
        reason: `Merkle Root corruption in Block #${i}! The transactions payload has been modified.`,
        checkedBlocksCount: i + 1,
        timestamp: new Date().toISOString(),
      };
    }

    // Check 3: Current Block Hash recalculation
    const calculatedHash = computeBlockHash(
      current.index,
      current.timestamp,
      current.previousHash,
      calculatedMerkle,
      current.nonce
    );

    if (current.hash !== calculatedHash) {
      return {
        valid: false,
        brokenAtIndex: i,
        reason: `Block #${i} hash validation failed! Stored hash: ${current.hash.slice(0, 12)}... Recalculated: ${calculatedHash.slice(0, 12)}... Data altered!`,
        checkedBlocksCount: i + 1,
        timestamp: new Date().toISOString(),
      };
    }
  }

  return {
    valid: true,
    checkedBlocksCount: chain.length,
    timestamp: new Date().toISOString(),
  };
}

// Mint new block with custom transactions
export function mineNewBlock(
  chain: BlockchainBlock[],
  transactions: HalalTransaction[],
  validatorNode: { name: string; nodeId: string; institution: string }
): BlockchainBlock {
  const prevBlock = chain[chain.length - 1];
  const newIndex = chain.length;
  const timestamp = Date.now();
  const merkleRoot = calculateMerkleRoot(transactions);
  
  // Simulated proof-of-authority nonce
  const nonce = Math.floor(Math.random() * 90000) + 1000;
  const hash = computeBlockHash(newIndex, timestamp, prevBlock.hash, merkleRoot, nonce);

  return {
    index: newIndex,
    timestamp,
    timestampIso: new Date(timestamp).toISOString(),
    previousHash: prevBlock.hash,
    hash,
    merkleRoot,
    nonce,
    validator: {
      ...validatorNode,
      signature: '0x' + calculateSha256(`VALIDATOR_${validatorNode.nodeId}_${newIndex}`).slice(0, 40),
    },
    transactions,
  };
}
