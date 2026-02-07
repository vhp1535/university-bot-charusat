import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedBlobProps {
  mouseX: number;
  mouseY: number;
}

const ScrapbookBlob: React.FC<AnimatedBlobProps> = ({ mouseX, mouseY }) => {
  const mainBlobRef = useRef<THREE.Mesh>(null);
  const secondaryBlobRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mainBlobRef.current || !secondaryBlobRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Main blob - organic floating motion
    mainBlobRef.current.position.y = Math.sin(time * 0.6) * 0.3;
    mainBlobRef.current.position.x = Math.cos(time * 0.4) * 0.2;
    
    // Secondary blob - counter-motion
    secondaryBlobRef.current.position.y = Math.cos(time * 0.5) * 0.2;
    secondaryBlobRef.current.position.x = Math.sin(time * 0.3) * 0.15;
    
    // Mouse interaction with dampening
    const targetRotX = mouseY * 0.08;
    const targetRotY = mouseX * 0.08;
    
    mainBlobRef.current.rotation.x = THREE.MathUtils.lerp(
      mainBlobRef.current.rotation.x,
      targetRotX,
      0.03
    );
    mainBlobRef.current.rotation.y = THREE.MathUtils.lerp(
      mainBlobRef.current.rotation.y,
      targetRotY,
      0.03
    );
    
    // Secondary blob reacts inversely
    secondaryBlobRef.current.rotation.x = THREE.MathUtils.lerp(
      secondaryBlobRef.current.rotation.x,
      -targetRotX * 0.5,
      0.02
    );
    secondaryBlobRef.current.rotation.y = THREE.MathUtils.lerp(
      secondaryBlobRef.current.rotation.y,
      -targetRotY * 0.5,  
      0.02
    );
  });

  const primaryGradient = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#60a5fa'); // Light blue
    gradient.addColorStop(0.5, '#a78bfa'); // Purple  
    gradient.addColorStop(1, '#f472b6'); // Pink
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  const secondaryGradient = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, '#c084fc'); // Light purple
    gradient.addColorStop(0.5, '#fb7185'); // Rose
    gradient.addColorStop(1, '#fbbf24'); // Amber
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Sparkles for magical effect */}
      <Sparkles 
        count={20} 
        scale={4} 
        size={2} 
        speed={0.4}
        color="#a78bfa"
      />
      
      {/* Main floating blob */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <Sphere ref={mainBlobRef} args={[1.2, 32, 32]} position={[1.5, 0, 0]}>
          <MeshDistortMaterial
            map={primaryGradient}
            distort={0.5}
            speed={2}
            roughness={0.2}
            metalness={0.6}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </Float>
      
      {/* Secondary smaller blob */}
      <Float
        speed={2}
        rotationIntensity={0.15}
        floatIntensity={0.2}
      >
        <Sphere ref={secondaryBlobRef} args={[0.7, 24, 24]} position={[-0.8, 1, -0.5]}>
          <MeshDistortMaterial
            map={secondaryGradient}
            distort={0.3}
            speed={1.8}
            roughness={0.3}
            metalness={0.4}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>
    </group>
  );
};

interface Floating3DProps {
  className?: string;
}

export const Floating3D: React.FC<Floating3DProps> = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    // CSS fallback for reduced motion
    return (
      <div className={`${className} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-full blur-xl" />
        <div className="absolute inset-4 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full" />
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[-10, -10, 5]} intensity={0.6} color="#a78bfa" />
        <ScrapbookBlob mouseX={mousePosition.x} mouseY={mousePosition.y} />
      </Canvas>
    </div>
  );
};