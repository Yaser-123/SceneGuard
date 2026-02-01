'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Use centralized SceneAnalysisResponse type from ./types
import type { SceneAnalysisResponse } from './types';

interface AnalysisContextType {
  analysis: SceneAnalysisResponse | null;
  setAnalysis: (analysis: SceneAnalysisResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<SceneAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
