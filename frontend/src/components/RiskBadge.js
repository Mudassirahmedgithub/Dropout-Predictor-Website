import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const RiskBadge = ({ level, score, className = '' }) => {
  const getRiskConfig = (level) => {
    switch (level?.toLowerCase()) {
      case 'green':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Low Risk'
        };
      case 'yellow':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertCircle,
          label: 'Medium Risk'
        };
      case 'red':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          label: 'High Risk'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const config = getRiskConfig(level);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-2 text-xs">({Math.round(score)}%)</span>
      )}
    </div>
  );
};

export default RiskBadge;