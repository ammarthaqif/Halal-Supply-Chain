import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileSearch, 
  Thermometer, 
  HelpCircle,
  Building,
  RotateCcw
} from 'lucide-react';

interface AuditResult {
  complianceStatus: 'COMPLIANT' | 'WARNING_FLAGGED' | 'NON_COMPLIANT' | 'INSUFFICIENT_DATA';
  halalanToyyibanScore: number;
  summary: string;
  criticalIngredientsOrFactors?: Array<{
    item: string;
    halalRisk: string;
    notes: string;
  }>;
  coldChainAssessment?: string;
  jakimStandardsReferenced?: string[];
  recommendedActionForRestaurant: string;
}

export const AIHalalAuditorView: React.FC = () => {
  const [auditType, setAuditType] = useState<string>('INGREDIENT_SCREENING');
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PRESETS = [
    {
      title: 'Screen Meat Marinade & E-Numbers',
      type: 'INGREDIENT_SCREENING',
      text: 'Supplier: Sauces & Spices Sdn Bhd. Product: Premium BBQ Ribeye Marinade. Ingredients list: Water, Brown Sugar, Soy Sauce, Mono- and di-glycerides of fatty acids (E471), Gelatin, Modified Starch, Natural Flavoring, Carmel Color (E150d), Preservative E202, 0.4% ethanol solvent. Check for non-halal animal fats, pork DNA risks, and JAKIM alcohol threshold.',
    },
    {
      title: 'Analyze Cold-Chain Thermal Excursion',
      type: 'COLD_CHAIN_ANOMALY',
      text: 'Consignment: Chilled Fresh Wagyu Ribeye Lot #MY-BEEF-2026. Required temperature: 0°C to +4°C. IoT Sensor log: Temperature spiked to +8.4°C between 11:30 AM and 02:45 PM (approx 3 hours 15 mins) during highway traffic jam on PLUS Expressway due to reefer compressor failure. Ambient humidity was 89%. Assess microbiological safety and Halalan-Toyyiban integrity under MS 2400.',
    },
    {
      title: 'Verify Foreign Halal Body (FHCB)',
      type: 'FHCB_VERIFICATION',
      text: 'Certificate issuer: Halal Certification Authority Australia (HCAA), abattoir Teys Australia, export certificate #HCAA-319. Check whether HCAA is currently accredited by JAKIM Malaysia for beef slaughter, and what MAQIS / DVS import documentation our Malaysian restaurant needs to verify upon container arrival.',
    },
  ];

  const handleRunAudit = async (customPayload?: string, customType?: string) => {
    const payload = customPayload || inputText;
    const type = customType || auditType;

    if (!payload.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/halal-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditType: type, payload }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Audit request failed');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to connect to the Halal Assurance AI engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            POWERED BY GEMINI 3.8 FLASH
          </span>
          <span className="text-xs text-neutral-500">
            Malaysian Halal Standard MS 1500:2019 & MS 2400 Engine
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900">
          AI Halal Compliance & Ingredient Risk Auditor
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Local restaurant owners can paste supplier invoices, ingredient lists, or cold-chain sensor readings. The AI screens for hidden animal derivatives, unauthorized emulsifiers (e.g., porcine E471), thermal breaches, and JAKIM accreditation compliance.
        </p>

        {/* Preset Quick Starters */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-neutral-700 mb-2">
            Click a Real-World Malaysian Restaurant Scenario to Test:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(preset.text);
                  setAuditType(preset.type);
                  handleRunAudit(preset.text, preset.type);
                }}
                className="p-3 text-left bg-neutral-50 hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 rounded-lg transition-colors flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-neutral-900 block line-clamp-1">
                  {preset.title}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono mt-1">
                  Run Instant Audit →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900">
            Audit Query / Ingredient Specification / Telemetry Log
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Category:</span>
            <select
              value={auditType}
              onChange={(e) => setAuditType(e.target.value)}
              className="p-1 bg-neutral-100 rounded text-neutral-800 text-xs font-medium"
            >
              <option value="INGREDIENT_SCREENING">Ingredient Screening</option>
              <option value="COLD_CHAIN_ANOMALY">Cold-Chain Log Audit</option>
              <option value="FHCB_VERIFICATION">Foreign Halal Body Check</option>
            </select>
          </div>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste ingredients, supplier invoice text, E-number list, or IoT reefer logs..."
          className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white leading-relaxed font-mono"
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setResult(null);
            }}
            className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800"
          >
            Clear Text
          </button>

          <button
            type="button"
            disabled={loading || !inputText.trim()}
            onClick={() => handleRunAudit()}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            {loading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Auditing with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Halal Compliance Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Audit Service Notice</p>
            <p className="mt-0.5 text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Structured Result Display */}
      {result && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md ${
                    result.complianceStatus === 'COMPLIANT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : result.complianceStatus === 'WARNING_FLAGGED'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  STATUS: {result.complianceStatus}
                </span>
                <span className="text-xs text-neutral-500">
                  MS 1500:2019 Standard
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mt-1.5">
                Halal Assurance Evaluation Report
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
              <div>
                <p className="text-[10px] font-mono text-neutral-500 text-right">TOYYIBAN SCORE</p>
                <p className="text-2xl font-black text-emerald-700 font-mono text-right tabular-nums">
                  {result.halalanToyyibanScore}/100
                </p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
              Executive Findings
            </h4>
            <p className="text-xs text-neutral-800 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              {result.summary}
            </p>
          </div>

          {/* Critical Ingredients Breakdown */}
          {result.criticalIngredientsOrFactors && result.criticalIngredientsOrFactors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
                Critical Ingredient Risk Breakdown
              </h4>
              <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="p-3">Ingredient / Factor</th>
                      <th className="p-3">Risk Level</th>
                      <th className="p-3">Assessment & Shari'ah Guidance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {result.criticalIngredientsOrFactors.map((item, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="p-3 font-semibold text-neutral-900">{item.item}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              item.halalRisk.toLowerCase() === 'high'
                                ? 'bg-red-100 text-red-800'
                                : item.halalRisk.toLowerCase() === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.halalRisk}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-600 leading-relaxed">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cold Chain Assessment */}
          {result.coldChainAssessment && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
                Cold-Chain & Hygiene (Halalan-Toyyiban) Evaluation
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                {result.coldChainAssessment}
              </p>
            </div>
          )}

          {/* Actionable Guidance for Restaurant Owner */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Action for Restaurant Kitchen:</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {result.recommendedActionForRestaurant}
            </p>
          </div>

          {/* JAKIM Standards */}
          {result.jakimStandardsReferenced && result.jakimStandardsReferenced.length > 0 && (
            <div className="pt-2 text-[11px] text-neutral-500 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-neutral-700">Standards Referenced:</span>
              {result.jakimStandardsReferenced.map((std, i) => (
                <span key={i} className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                  {std}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
