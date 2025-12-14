import React from 'react';
import { ADCConfig, SignalType } from '../types';
import { Settings, Activity, Clock, Cpu, Waves, ArrowRightLeft } from 'lucide-react';

interface ControlsProps {
  config: ADCConfig;
  setConfig: React.Dispatch<React.SetStateAction<ADCConfig>>;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig }) => {
  
  const handleChange = <K extends keyof ADCConfig>(key: K, value: ADCConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-8 h-full overflow-y-auto">
      <div className="flex items-center space-x-2 border-b border-slate-700 pb-4">
        <Settings className="text-indigo-400 w-6 h-6" />
        <h2 className="text-xl font-bold text-slate-100">Configuración</h2>
      </div>

      {/* Tipo de Señal */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-slate-300">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          Tipo de Señal
        </label>
        <select
          value={config.signalType}
          onChange={(e) => handleChange('signalType', e.target.value as SignalType)}
          className="w-full bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          {Object.values(SignalType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Frecuencia de la Señal */}
      <div className="space-y-3">
        <div className="flex justify-between">
            <label className="flex items-center text-sm font-medium text-slate-300">
            <Waves className="w-4 h-4 mr-2 text-indigo-400" />
            Frecuencia Entrada (Hz)
            </label>
            <span className="text-sm font-mono text-indigo-300">{config.frequency} Hz</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={config.frequency}
          onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
          disabled={config.signalType === SignalType.IMPULSE}
          className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 ${config.signalType === SignalType.IMPULSE ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Amplitud */}
      <div className="space-y-3">
        <div className="flex justify-between">
            <label className="flex items-center text-sm font-medium text-slate-300">
            <Activity className="w-4 h-4 mr-2 text-indigo-400" />
            Amplitud (V)
            </label>
            <span className="text-sm font-mono text-indigo-300">±{config.amplitude} V</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={config.amplitude}
          onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <div className="border-t border-slate-700 pt-4"></div>

      {/* Frecuencia de Muestreo */}
      <div className="space-y-3">
        <div className="flex justify-between">
            <label className="flex items-center text-sm font-medium text-slate-300">
            <Clock className="w-4 h-4 mr-2 text-emerald-400" />
            Tiempo/Frec. Muestreo
            </label>
            <span className="text-sm font-mono text-emerald-300">{config.samplingRate} Hz ({ (1000/config.samplingRate).toFixed(1) } ms)</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={config.samplingRate}
          onChange={(e) => handleChange('samplingRate', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <p className="text-xs text-slate-500">
          Nyquist: La señal se reconstruye si Fs &gt; {2 * config.frequency} Hz
        </p>
      </div>

      {/* Resolución */}
      <div className="space-y-3">
        <div className="flex justify-between">
            <label className="flex items-center text-sm font-medium text-slate-300">
            <Cpu className="w-4 h-4 mr-2 text-amber-400" />
            Resolución (Bits)
            </label>
            <span className="text-sm font-mono text-amber-300">{config.resolution} bits ({Math.pow(2, config.resolution)} niveles)</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          step="1"
          value={config.resolution}
          onChange={(e) => handleChange('resolution', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="border-t border-slate-700 pt-4"></div>
      
      {/* DAC Control */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <label className="flex items-center text-sm font-medium text-slate-300">
              <ArrowRightLeft className="w-4 h-4 mr-2 text-pink-400" />
              Simulación DAC
           </label>
           <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                <input 
                    type="checkbox" 
                    name="toggle" 
                    id="dac-toggle" 
                    checked={config.dacEnabled}
                    onChange={(e) => handleChange('dacEnabled', e.target.checked)}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                    style={{ right: config.dacEnabled ? '0' : '50%', borderColor: config.dacEnabled ? '#ec4899' : '#94a3b8' }}
                />
                <label 
                    htmlFor="dac-toggle" 
                    className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer border border-slate-600 ${config.dacEnabled ? 'bg-pink-500' : 'bg-slate-700'}`}
                ></label>
            </div>
        </div>
        
        {config.dacEnabled && (
            <div className="space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Filtro Reconstrucción (Cutoff)</span>
                    <span className="text-xs font-mono text-pink-300">{config.dacCutoffMultiplier.toFixed(1)} x Fs</span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={config.dacCutoffMultiplier}
                    onChange={(e) => handleChange('dacCutoffMultiplier', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <p className="text-[10px] text-slate-500 leading-tight">
                    Frecuencias más bajas suavizan más (menos ruido) pero pierden detalle rápido. Fs/2 (0.5) es el límite teórico.
                </p>
            </div>
        )}
      </div>

    </div>
  );
};

export default Controls;