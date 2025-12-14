import { ADCConfig, DataPoint, SignalType, SimulationStats } from '../types';

export const generateSimulationData = (config: ADCConfig): { data: DataPoint[], stats: SimulationStats } => {
  const { signalType, amplitude, frequency, samplingRate, resolution, duration, dacEnabled, dacCutoffMultiplier } = config;

  // 1. Calculate quantization parameters
  const levels = Math.pow(2, resolution);
  const fullRange = 2 * amplitude;
  const lsb = fullRange / levels;

  // 2. Setup simulation time
  const analogStep = 0.001; // 1ms resolution for "continuous" signal
  const totalPoints = Math.ceil(duration / analogStep);
  
  const data: DataPoint[] = [];

  // Helper for signal value
  const getSignalValue = (t: number): number => {
    switch (signalType) {
      case SignalType.SINE:
        return amplitude * Math.sin(2 * Math.PI * frequency * t);
      case SignalType.COMPLEX:
        // Educational Signal: Carrier + High Frequency Detail
        // This is designed to show how "details" (high freq) are lost during Sampling/DAC
        // if Fs is not high enough.
        
        const wMain = 2 * Math.PI * frequency;
        // The detail is 8 times faster than the main signal
        const wDetail = 2 * Math.PI * (frequency * 8); 

        // Composition: 85% Fundamental, 15% Detail
        // This makes the "nuance" visible but clearly distinct from the main shape
        return amplitude * (0.85 * Math.sin(wMain * t) + 0.15 * Math.sin(wDetail * t));

      case SignalType.RAMP:
        const period = 1 / frequency;
        const phase = (t % period) / period; 
        return (phase * 2 * amplitude) - amplitude;
      case SignalType.TRIANGLE:
        return (2 * amplitude / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
      case SignalType.SQUARE:
        return Math.sign(Math.sin(2 * Math.PI * frequency * t)) * amplitude;
      case SignalType.IMPULSE:
        const center = duration / 2;
        const width = 0.1;
        if (t > center - width/2 && t < center + width/2) return amplitude;
        return -amplitude;
      default:
        return 0;
    }
  };

  // Quantization function
  const quantize = (val: number): number => {
    const normalized = (val + amplitude) / fullRange; 
    let stepIndex = Math.round(normalized * (levels - 1));
    if (stepIndex < 0) stepIndex = 0;
    if (stepIndex >= levels) stepIndex = levels - 1;
    return (stepIndex / (levels - 1)) * fullRange - amplitude;
  };

  // Generate Data Loop
  let nextSampleTime = 0;
  const sampleInterval = 1 / samplingRate;
  let currentDigitalValue = quantize(getSignalValue(0));

  for (let i = 0; i <= totalPoints; i++) {
    const t = i * analogStep;
    const analogVal = getSignalValue(t);
    
    if (t >= nextSampleTime) {
      currentDigitalValue = quantize(analogVal);
      nextSampleTime += sampleInterval;
    }

    data.push({
      time: parseFloat(t.toFixed(3)),
      analog: analogVal,
      digital: currentDigitalValue,
      error: analogVal - currentDigitalValue
    });
  }

  // 3. DAC Reconstruction Simulation (Low Pass Filter)
  if (dacEnabled) {
    // Cutoff frequency for the reconstruction filter
    const fc = samplingRate * dacCutoffMultiplier;
    // RC Time constant: tau = 1 / (2 * pi * fc)
    const rc = 1 / (2 * Math.PI * fc);
    // Discrete Low Pass Filter Alpha: alpha = dt / (tau + dt)
    const alpha = analogStep / (rc + analogStep);

    let prevReconstructed = data[0].digital;

    for (let i = 0; i < data.length; i++) {
      const input = data[i].digital;
      // y[i] = y[i-1] + alpha * (x[i] - y[i-1])
      const filtered = prevReconstructed + alpha * (input - prevReconstructed);
      
      data[i].reconstructed = filtered;
      prevReconstructed = filtered;
    }
  }

  return {
    data,
    stats: {
      lsb,
      levels,
      samplingInterval: sampleInterval,
      nyquistFrequency: samplingRate / 2
    }
  };
};