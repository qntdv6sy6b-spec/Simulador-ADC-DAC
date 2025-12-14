import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import { DataPoint } from '../types';

interface ADCChartProps {
  data: DataPoint[];
  showAnalog: boolean;
  showDigital: boolean;
  showError: boolean;
  showDAC: boolean;
}

const ADCChart: React.FC<ADCChartProps> = ({ data, showAnalog, showDigital, showError, showDAC }) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            stroke="#94a3b8" 
            label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -10, fill: '#94a3b8' }}
            tickFormatter={(val) => val.toFixed(2)}
          />
          <YAxis 
            stroke="#94a3b8" 
            label={{ value: 'Amplitud (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
            itemStyle={{ color: '#e2e8f0' }}
            labelFormatter={(label) => `Tiempo: ${label}s`}
            formatter={(value: number) => value.toFixed(3) + ' V'}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {showError && (
             <Area 
               type="monotone" 
               dataKey="error" 
               fill="#ef4444" 
               fillOpacity={0.2} 
               stroke="none" 
               name="Error de Cuantización" 
             />
          )}

          {showAnalog && (
            <Line
              type="monotone"
              dataKey="analog"
              stroke="#38bdf8" // Sky blue
              strokeWidth={2}
              dot={false}
              name="Entrada Analógica"
              isAnimationActive={false}
            />
          )}

          {showDigital && (
            <Line
              type="stepAfter" // Creates the stair-step look
              dataKey="digital"
              stroke="#fbbf24" // Amber
              strokeWidth={2}
              dot={{ r: 2, fill: '#fbbf24' }} // Small dots at sample points
              activeDot={{ r: 6 }}
              name="Salida Digital (ADC)"
              isAnimationActive={false}
            />
          )}

          {showDAC && (
            <Line
              type="monotone"
              dataKey="reconstructed"
              stroke="#ec4899" // Pink
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Reconstrucción DAC (Filtrada)"
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ADCChart;