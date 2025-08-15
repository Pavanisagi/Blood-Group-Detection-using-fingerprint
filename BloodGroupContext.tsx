import React, { createContext, useContext, useState } from 'react';

interface BloodGroupData {
  type: string;
  size: number;
  count: number;
  pattern: string;
  compatibility: {
    canReceiveFrom: string[];
    canDonateTo: string[];
  };
  analysis?: {
    healthScore?: number;
    dnaAnalysis?: {
      confidence: number;
    };
    healthAnalysis?: {
      stressLevel: number;
      riskFactors: string[];
    };
  };
}

interface BloodGroupContextType {
  bloodGroupData: BloodGroupData | null;
  setBloodGroupData: (data: BloodGroupData | null) => void;
}

const BloodGroupContext = createContext<BloodGroupContextType | undefined>(undefined);

export const BloodGroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bloodGroupData, setBloodGroupData] = useState<BloodGroupData | null>(null);

  return (
    <BloodGroupContext.Provider value={{ bloodGroupData, setBloodGroupData }}>
      {children}
    </BloodGroupContext.Provider>
  );
};

export const useBloodGroup = () => {
  const context = useContext(BloodGroupContext);
  if (context === undefined) {
    throw new Error('useBloodGroup must be used within a BloodGroupProvider');
  }
  return context;
}; 