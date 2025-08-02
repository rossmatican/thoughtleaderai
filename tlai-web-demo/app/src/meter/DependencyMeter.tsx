import React from 'react';
import { useStore } from '../state/useStore';

export function DependencyMeter() {
  const { analysisResult, isAnalysisEnabled, setAnalysisEnabled } = useStore();
  
  const score = analysisResult?.score ?? 0;
  
  // Determine color based on score
  const getColor = (score: number) => {
    if (score < 0.4) return { color: 'text-success-600', bg: 'bg-success-500', stroke: '#059669' };
    if (score <= 0.7) return { color: 'text-warning-600', bg: 'bg-warning-500', stroke: '#d97706' };
    return { color: 'text-danger-600', bg: 'bg-danger-500', stroke: '#dc2626' };
  };
  
  const color = getColor(score);
  const percentage = Math.round(score * 100);
  
  // SVG circle calculations
  const radius = 45;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${score * circumference} ${circumference}`;
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-medium text-gray-800">AI Dependency</h3>
        <button
          onClick={() => setAnalysisEnabled(!isAnalysisEnabled)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            isAnalysisEnabled
              ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isAnalysisEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
      
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${color.color}`}>
              {percentage}%
            </div>
            <div className="text-xs text-gray-500">dependency</div>
          </div>
        </div>
      </div>
      
      {analysisResult && (
        <div className="w-full space-y-2">
          <div className="text-sm font-medium text-gray-700">Breakdown:</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Ideation</span>
              <span className="font-medium">{Math.round(analysisResult.breakdown.ideation * 100)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Structure</span>
              <span className="font-medium">{Math.round(analysisResult.breakdown.structure * 100)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Expression</span>
              <span className="font-medium">{Math.round(analysisResult.breakdown.expression * 100)}%</span>
            </div>
          </div>
        </div>
      )}
      
      {!isAnalysisEnabled && (
        <div className="text-xs text-gray-500 text-center">
          Analysis disabled
        </div>
      )}
    </div>
  );
}