import React, { useState, useMemo } from 'react';
import Controls from './components/Controls';
import ADCChart from './components/ADCChart';
import { generateSimulationData } from './services/signalGenerator';
import { ADCConfig, SignalType } from './types';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // Initial Configuration
  const [config, setConfig] = useState<ADCConfig>({
    signalType: SignalType.SINE,
    amplitude: 5,
    frequency: 1,
    samplingRate: 20,
    resolution: 3,
    duration: 2.0,
    dacEnabled: false,
    dacCutoffMultiplier: 0.5
  });

  const [viewOptions, setViewOptions] = useState({
    showAnalog: true,
    showDigital: true,
    showError: false
  });

  // Generate data whenever config changes
  const simulation = useMemo(() => generateSimulationData(config), [config]);
  const { data, stats } = simulation;

  // Nyquist Check
  const isAliasingLikely = config.signalType === SignalType.SINE && config.samplingRate < 2 * config.frequency;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Simulador ADC / DAC</h1>
              <p className="text-xs text-slate-400">Convertidor Analógico-Digital Interactivo</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
             <span>Simulación en tiempo real</span>
             <span className="px-2 py-1 bg-slate-700 rounded text-xs">v1.1.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-3">
            <Controls config={config} setConfig={setConfig} />
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-9 flex flex-col space-y-6">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-xs font-medium uppercase mb-1">Voltaje LSB (Paso)</div>
                <div className="text-2xl font-mono font-bold text-amber-400">{stats.lsb.toFixed(3)} V</div>
                <div className="text-xs text-slate-500 mt-1">Resolución de voltaje mínima</div>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-xs font-medium uppercase mb-1">Niveles Discretos</div>
                <div className="text-2xl font-mono font-bold text-indigo-400">{stats.levels}</div>
                <div className="text-xs text-slate-500 mt-1">2^{config.resolution} estados posibles</div>
              </div>

              <div className={`p-4 rounded-xl border shadow-sm ${isAliasingLikely ? 'bg-red-900/20 border-red-700/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center space-x-2 mb-1">
                    <div className="text-slate-400 text-xs font-medium uppercase">Estado de Nyquist</div>
                    {isAliasingLikely ? <AlertTriangle className="w-3 h-3 text-red-500" /> : <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                
                <div className={`text-sm font-semibold ${isAliasingLikely ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isAliasingLikely ? 'Aliasing Detectado' : 'Muestreo Adecuado'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    {isAliasingLikely 
                        ? `Fs (${config.samplingRate}Hz) < 2 * Freq (${2 * config.frequency}Hz)` 
                        : `Fs > 2 * Frecuencia de señal`
                    }
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-1 relative min-h-[500px] flex flex-col">
                <div className="absolute top-4 right-4 z-10 flex space-x-2 bg-slate-900/80 p-1.5 rounded-lg backdrop-blur-sm border border-slate-700">
                    <button 
                        onClick={() => setViewOptions(v => ({...v, showAnalog: !v.showAnalog}))}
                        className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${viewOptions.showAnalog ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Entrada
                    </button>
                    <button 
                        onClick={() => setViewOptions(v => ({...v, showDigital: !v.showDigital}))}
                        className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${viewOptions.showDigital ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Digital (ADC)
                    </button>
                    {config.dacEnabled && (
                        <div className="px-3 py-1 text-xs rounded-md font-medium bg-pink-500/20 text-pink-400 cursor-default">
                           Salida DAC
                        </div>
                    )}
                    <button 
                        onClick={() => setViewOptions(v => ({...v, showError: !v.showError}))}
                        className={`px-3 py-1 text-xs rounded-md transition-colors font-medium ${viewOptions.showError ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Error
                    </button>
                </div>

                <div className="flex-1 p-2">
                    <ADCChart 
                        data={data} 
                        showAnalog={viewOptions.showAnalog}
                        showDigital={viewOptions.showDigital}
                        showError={viewOptions.showError}
                        showDAC={config.dacEnabled}
                    />
                </div>
                
                <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                    <div className="flex items-start space-x-3 text-slate-400 text-sm">
                        <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <p>
                            El gráfico muestra la conversión completa: Entrada Analógica (Azul) → Digitalización ADC (Ámbar) → Reconstrucción DAC (Rosa, si está activo).
                            {config.dacEnabled && " La línea rosa muestra cómo el filtro de reconstrucción suaviza la señal escalonada."}
                        </p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;