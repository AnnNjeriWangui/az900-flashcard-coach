import { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  calculateCompositeSLA,
  ARCHITECTURE_PRESETS,
  CAPEX_VS_OPEX,
  type ArchitecturePreset,
} from '@/utils/slaCalculator';

interface CustomService {
  id: string;
  name: string;
  sla: number;
}

export default function SlaCalculatorView() {
  const [services, setServices] = useState<CustomService[]>([
    { id: '1', name: 'Azure App Service (PaaS)', sla: 99.95 },
    { id: '2', name: 'Azure SQL Database', sla: 99.99 },
  ]);

  const slaPercentages = useMemo(() => services.map((s) => s.sla), [services]);
  const result = useMemo(() => calculateCompositeSLA(slaPercentages), [slaPercentages]);

  function handleAddService() {
    const id = Date.now().toString();
    setServices((prev) => [...prev, { id, name: `Service ${prev.length + 1}`, sla: 99.9 }]);
  }

  function handleRemoveService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function handleUpdateService(id: string, name: string, sla: number) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name, sla: Math.min(100, Math.max(0, sla)) } : s))
    );
  }

  function handleApplyPreset(preset: ArchitecturePreset) {
    setServices(
      preset.services.map((s, idx) => ({
        id: (idx + 1).toString(),
        name: s.name,
        sla: s.sla,
      }))
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-sky-950 p-8 sm:p-10 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-3 border border-white/10">
          <Calculator className="w-3.5 h-3.5" /> High Availability & Cloud Economics
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Composite SLA & Downtime Calculator
        </h1>
        <p className="text-slate-200 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          When services depend on each other in series, their composite availability is the product of each individual SLA (<code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">SLA_1 × SLA_2</code>). The resulting overall SLA is always lower than any single service!
        </p>

        {/* Real-time Calculation Hero Result */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="text-xs uppercase font-semibold text-sky-200">Composite SLA</span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {result.compositeSLA.toFixed(3)}%
            </div>
            <span className="text-[11px] text-sky-300">Overall Availability</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="text-xs uppercase font-semibold text-amber-200">Annual Max Downtime</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {result.downtimePerYear}
            </div>
            <span className="text-[11px] text-amber-200">Across 365 Days</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="text-xs uppercase font-semibold text-sky-200">Monthly Expected</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {result.downtimePerMonth}
            </div>
            <span className="text-[11px] text-sky-300">Permitted Outage Window</span>
          </div>
        </div>
      </div>

      {/* Preset Architecture Buttons */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-navy-100 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
          Load Sample Architecture Presets:
        </span>
        <div className="grid sm:grid-cols-3 gap-3">
          {ARCHITECTURE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all text-xs group"
            >
              <div className="font-bold text-navy-900 group-hover:text-sky-700 transition-colors">
                {preset.name}
              </div>
              <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chained Services Configurator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Configured Series Services</h2>
            <p className="text-xs text-slate-500">Add or adjust each component’s official Microsoft SLA</p>
          </div>
          <button
            type="button"
            onClick={handleAddService}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>

        <div className="space-y-3">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={srv.name}
                  onChange={(e) => handleUpdateService(srv.id, e.target.value, srv.sla)}
                  className="font-bold text-navy-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">SLA:</span>
                  <input
                    type="number"
                    step="0.001"
                    min="90"
                    max="100"
                    value={srv.sla}
                    onChange={(e) =>
                      handleUpdateService(srv.id, srv.name, parseFloat(e.target.value) || 0)
                    }
                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-right text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveService(srv.id)}
                  disabled={services.length <= 1}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove component"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CapEx vs. OpEx Deep Dive */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
            AZ-900 Exam Concept
          </span>
          <h2 className="text-xl font-bold text-navy-900 mt-1">
            Capital Expenditure (CapEx) vs. Operational Expenditure (OpEx)
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            Understanding cloud economics is a core objective on the AZ-900 certification exam.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {CAPEX_VS_OPEX.map((concept) => (
            <div
              key={concept.type}
              className={`rounded-2xl p-5 border flex flex-col justify-between ${
                concept.type === 'OpEx'
                  ? 'bg-sky-50/70 border-sky-200 text-sky-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    concept.type === 'OpEx'
                      ? 'bg-sky-200 text-sky-900 border-sky-300'
                      : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {concept.type}
                </span>
                <h3 className="font-bold text-base mt-2">{concept.title}</h3>
                <p className="text-xs mt-1.5 leading-relaxed opacity-90">{concept.description}</p>

                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                    Real-World Examples:
                  </span>
                  <ul className="list-disc list-inside text-xs space-y-0.5 opacity-90">
                    {concept.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 text-xs font-medium">
                <span className="font-bold">Azure Context: </span>
                <span>{concept.azureRelevance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
