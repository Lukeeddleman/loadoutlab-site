'use client';

import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Group, Vector3 } from 'three';

// Part configuration with GLTF paths and positioning
const partConfig = {
  barrel: {
    options: [
      { id: 'standard', name: '16" Standard Barrel', path: '/models/barrels/standard-16.gltf' },
      { id: 'carbine', name: '14.5" Carbine Barrel', path: '/models/barrels/carbine-14.gltf' },
      { id: 'heavy', name: '20" Heavy Barrel', path: '/models/barrels/heavy-20.gltf' }
    ],
    position: new Vector3(0, 0, 0),
    rotation: [0, 0, 0] as [number, number, number]
  },
  handguard: {
    options: [
      { id: 'mlok', name: 'M-LOK Handguard', path: '/models/handguards/mlok-standard.gltf' },
      { id: 'quad', name: 'Quad Rail', path: '/models/handguards/quad-rail.gltf' },
      { id: 'keymod', name: 'KeyMod Handguard', path: '/models/handguards/keymod.gltf' }
    ],
    position: new Vector3(0, 0, -0.3),
    rotation: [0, 0, 0] as [number, number, number]
  },
  optic: {
    options: [
      { id: 'none', name: 'No Optic', path: null },
      { id: 'red-dot', name: 'Red Dot Sight', path: '/models/optics/red-dot.gltf' },
      { id: 'scope', name: '3-9x Scope', path: '/models/optics/scope-3-9.gltf' },
      { id: 'holo', name: 'Holographic Sight', path: '/models/optics/holographic.gltf' }
    ],
    position: new Vector3(0, 0.15, -0.2),
    rotation: [0, 0, 0] as [number, number, number]
  }
};

// Individual part component with GLTF loading
interface PartProps {
  partType: keyof typeof partConfig;
  selectedOption: string;
}

function Part({ partType, selectedOption }: PartProps) {
  const config = partConfig[partType];
  const selectedPart = config.options.find(opt => opt.id === selectedOption);
  
  if (!selectedPart || !selectedPart.path) {
    return null;
  }

  // Use a fallback placeholder model if GLTF doesn't exist
  const { scene } = useGLTF(selectedPart.path, true);
  
  return (
    <group
      position={config.position}
      rotation={config.rotation}
    >
      <primitive object={scene.clone()} />
    </group>
  );
}

// Fallback placeholder models for development
function PlaceholderPart({ partType, selectedOption }: PartProps) {
  const config = partConfig[partType];
  
  const getGeometry = () => {
    switch (partType) {
      case 'barrel':
        return <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />;
      case 'handguard':
        return <boxGeometry args={[0.06, 0.06, 0.4]} />;
      case 'optic':
        if (selectedOption === 'none') return null;
        return <boxGeometry args={[0.08, 0.04, 0.12]} />;
      default:
        return <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
  };

  const geometry = getGeometry();
  if (!geometry) return null;

  return (
    <group
      position={config.position}
      rotation={config.rotation}
    >
      <mesh>
        {geometry}
        <meshStandardMaterial color={partType === 'barrel' ? '#2a2a2a' : '#444444'} />
      </mesh>
    </group>
  );
}

// Main rifle assembly
interface RifleAssemblyProps {
  selectedParts: Record<keyof typeof partConfig, string>;
}

function RifleAssembly({ selectedParts }: RifleAssemblyProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base receiver (placeholder) */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.2, 0.08, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Modular parts - using placeholders for now */}
      {Object.entries(selectedParts).map(([partType, selectedOption]) => (
        <Suspense 
          key={partType}
          fallback={
            <PlaceholderPart 
              partType={partType as keyof typeof partConfig} 
              selectedOption={selectedOption} 
            />
          }
        >
          <PlaceholderPart 
            partType={partType as keyof typeof partConfig} 
            selectedOption={selectedOption} 
          />
        </Suspense>
      ))}
    </group>
  );
}

// Part selection UI panel
interface PartSelectorProps {
  selectedParts: Record<keyof typeof partConfig, string>;
  onPartChange: (partType: keyof typeof partConfig, optionId: string) => void;
}

function PartSelector({ selectedParts, onPartChange }: PartSelectorProps) {
  return (
    <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 min-w-[280px]">
      <h2 className="text-xl font-mono text-cyan-400 mb-4">RIFLE BUILDER</h2>
      
      {Object.entries(partConfig).map(([partType, config]) => (
        <div key={partType} className="mb-4">
          <label className="block text-sm font-mono text-gray-300 mb-2 uppercase">
            {partType}
          </label>
          <select
            value={selectedParts[partType as keyof typeof partConfig]}
            onChange={(e) => onPartChange(partType as keyof typeof partConfig, e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-cyan-500 focus:outline-none"
          >
            {config.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// Main 3D rifle builder component
export default function RifleBuilder3D() {
  const [selectedParts, setSelectedParts] = useState<Record<keyof typeof partConfig, string>>({
    barrel: 'standard',
    handguard: 'mlok',
    optic: 'red-dot'
  });

  const handlePartChange = (partType: keyof typeof partConfig, optionId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [partType]: optionId
    }));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [2, 1, 2],
          fov: 50,
          near: 0.1,
          far: 100
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Environment */}
        <Environment preset="warehouse" />
        
        {/* Rifle Assembly */}
        <Suspense fallback={null}>
          <RifleAssembly selectedParts={selectedParts} />
        </Suspense>
        
        {/* Ground shadow */}
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.3} 
          scale={3} 
          blur={2} 
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={10}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* UI Panel */}
      <PartSelector
        selectedParts={selectedParts}
        onPartChange={handlePartChange}
      />
      
      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 max-w-xs">
        <p className="text-sm text-gray-300 font-mono">
          • Left click + drag to rotate<br />
          • Scroll to zoom<br />
          • Right click + drag to pan<br />
          • Select parts from the left panel
        </p>
      </div>
    </div>
  );
}