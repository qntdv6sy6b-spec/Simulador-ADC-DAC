export enum SignalType {
  SINE = 'Senoidal',
  COMPLEX = 'Senoidal + Detalle (Alta Frec.)',
  RAMP = 'Rampa',
  TRIANGLE = 'Triangular',
  SQUARE = 'Cuadrada',
  IMPULSE = 'Impulso',
}

export interface ADCConfig {
  signalType: SignalType;
  amplitude: number;      // Volts
  frequency: number;      // Hz (for periodic signals)
  samplingRate: number;   // Hz
  resolution: number;     // Bits
  duration: number;       // Seconds
  // DAC Simulation
  dacEnabled: boolean;
  dacCutoffMultiplier: number; // Multiplier of Sampling Rate (e.g. 0.5 * Fs)
}

export interface DataPoint {
  time: number;
  analog: number;
  digital: number; // Removed null type for stricter typed calculation, generator provides values
  reconstructed?: number; // DAC Output
  error?: number;
}

export interface SimulationStats {
  lsb: number;            // Least Significant Bit value (Volts)
  levels: number;         // Number of quantization levels
  samplingInterval: number;
  nyquistFrequency: number;
}