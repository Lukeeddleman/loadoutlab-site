"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FirearmType = "rifle" | "pistol" | "shotgun";
export type RifleType = "ar15" | "ar10" | "bolt-action";
export type PistolType = "striker" | "hammer" | "single-action";
export type ShotgunType = "pump" | "semi-auto" | "break-action";

export type FirearmConfiguration = {
  firearmType: FirearmType;
  subType: RifleType | PistolType | ShotgunType;
};

export type Part = {
  id: string;
  name: string;
  brand: string;
  price: number;
  color: string;
  compatibility: PartCompatibility;
  description?: string;
};

export type PartCompatibility = {
  firearmTypes: FirearmType[];
  subTypes?: (RifleType | PistolType | ShotgunType)[];
  excludeSubTypes?: (RifleType | PistolType | ShotgunType)[];
};

interface ForgeContextType {
  configuration: FirearmConfiguration | null;
  setConfiguration: (config: FirearmConfiguration) => void;
  selectedLower: Part | null;
  setSelectedLower: (lower: Part | null) => void;
  isPartCompatible: (compatibility: PartCompatibility) => boolean;
  resetConfiguration: () => void;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export function useForgeContext() {
  const context = useContext(ForgeContext);
  if (context === undefined) {
    throw new Error('useForgeContext must be used within a ForgeProvider');
  }
  return context;
}

interface ForgeProviderProps {
  children: ReactNode;
}

export function ForgeProvider({ children }: ForgeProviderProps) {
  const [configuration, setConfiguration] = useState<FirearmConfiguration | null>(null);
  const [selectedLower, setSelectedLower] = useState<Part | null>(null);

  const isPartCompatible = (compatibility: PartCompatibility): boolean => {
    if (!configuration) return true; // Show all parts if no configuration is set
    
    // Check if part supports this firearm type
    if (!compatibility.firearmTypes.includes(configuration.firearmType)) {
      return false;
    }

    // If part has subType restrictions, check them
    if (compatibility.subTypes) {
      if (!compatibility.subTypes.includes(configuration.subType)) {
        return false;
      }
    }

    // If part explicitly excludes certain subTypes, check them
    if (compatibility.excludeSubTypes) {
      if (compatibility.excludeSubTypes.includes(configuration.subType)) {
        return false;
      }
    }

    return true;
  };

  const resetConfiguration = () => {
    setConfiguration(null);
    setSelectedLower(null);
  };

  const value: ForgeContextType = {
    configuration,
    setConfiguration,
    selectedLower,
    setSelectedLower,
    isPartCompatible,
    resetConfiguration,
  };

  return (
    <ForgeContext.Provider value={value}>
      {children}
    </ForgeContext.Provider>
  );
}

// Utility function to filter parts based on current configuration
export function filterCompatibleParts<T extends { compatibility: PartCompatibility }>(
  parts: T[], 
  configuration: FirearmConfiguration | null
): T[] {
  if (!configuration) return parts;
  
  return parts.filter(part => {
    // Check if part supports this firearm type
    if (!part.compatibility.firearmTypes.includes(configuration.firearmType)) {
      return false;
    }

    // If part has subType restrictions, check them
    if (part.compatibility.subTypes) {
      if (!part.compatibility.subTypes.includes(configuration.subType)) {
        return false;
      }
    }

    // If part explicitly excludes certain subTypes, check them
    if (part.compatibility.excludeSubTypes) {
      if (part.compatibility.excludeSubTypes.includes(configuration.subType)) {
        return false;
      }
    }

    return true;
  });
}