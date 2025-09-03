"use client";

import React, { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { filterCompatibleParts } from "./ForgeContext";
import { useForgeContext } from "./ForgeContext";

type Part = {
  id: string;
  name: string;
  brand: string;
  price: number;
  color: string;
  compatibility: any;
  description?: string;
};

interface PartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (part: Part) => void;
  parts: Part[];
  categoryName: string;
  categoryIcon: string;
  selectedPart?: Part | null;
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function PartSelectionModal({
  isOpen,
  onClose,
  onSelect,
  parts,
  categoryName,
  categoryIcon,
  selectedPart
}: PartSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const { configuration } = useForgeContext();

  if (!isOpen) return null;

  // Filter parts based on search, brands, price, and compatibility
  const filteredParts = filterCompatibleParts(parts, configuration).filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(part.brand);
    const matchesPrice = part.price >= priceRange[0] && part.price <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const availableBrands = [...new Set(filterCompatibleParts(parts, configuration).map(part => part.brand))].sort();
  const maxPrice = Math.max(...filterCompatibleParts(parts, configuration).map(part => part.price));

  const handlePartSelection = (part: Part) => {
    onSelect(part);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white">Select {categoryName}</h2>
              <p className="text-gray-400 font-mono text-sm">CHOOSE YOUR COMPONENT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Current Selection */}
        {selectedPart && selectedPart.id !== "none" && (
          <div className="p-4 bg-cyan-500/10 border-b border-cyan-500/30">
            <div className="text-sm text-cyan-400 font-mono mb-1">CURRENTLY SELECTED</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold">{selectedPart.name}</div>
                <div className="text-gray-300 text-sm">{selectedPart.brand} • {money(selectedPart.price)}</div>
              </div>
              <div className="text-cyan-400 font-mono text-sm">SELECTED</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${categoryName.toLowerCase()}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="min-w-48">
              <label className="block text-xs text-gray-400 font-mono mb-1">PRICE RANGE</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                <span>$0</span>
                <span>{money(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 1 && (
            <div>
              <label className="block text-xs text-gray-400 font-mono mb-2">FILTER BY BRAND</label>
              <div className="flex flex-wrap gap-2">
                {availableBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      if (selectedBrands.includes(brand)) {
                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      } else {
                        setSelectedBrands([...selectedBrands, brand]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                      selectedBrands.includes(brand)
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Parts List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {filteredParts.map((part) => (
              <button
                key={part.id}
                onClick={() => handlePartSelection(part)}
                className={`w-full p-4 text-left rounded-xl transition-all duration-300 hover:scale-[1.01] border ${
                  selectedPart?.id === part.id
                    ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50"
                    : part.id === "none"
                    ? "bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border-gray-600"
                    : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-cyan-600/20 hover:to-blue-600/20 border-gray-700 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{part.name}</h3>
                      <span className="text-cyan-400 font-mono text-sm">{part.brand}</span>
                      {selectedPart?.id === part.id && (
                        <span className="px-2 py-1 bg-cyan-500 text-white text-xs font-mono rounded">SELECTED</span>
                      )}
                    </div>
                    {part.description && (
                      <p className="text-sm text-gray-400 mb-2">{part.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-white">{money(part.price)}</span>
                      {part.id !== "none" && categoryName.toLowerCase().includes("lower") && (
                        <span className="text-xs text-red-400 font-mono">⚠ FFL REQUIRED</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400 font-mono">
            {filteredParts.length} {categoryName.toLowerCase()}(s) available
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white font-mono text-sm transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}