import { useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const CYLINDER_VERTEX = `
#define PI 3.141592653589793
uniform float uScrollSpeed;
uniform float uCurveStrength;
uniform float uCurveFrequency;
varying vec2 vUv;

void main() {
  vec3 tPosition = transformed;
  float xDisplacement = uCurveStrength * cos(tPosition.y * uCurveFrequency);
  tPosition.x += xDisplacement - uCurveStrength;
  float yDisplacement = -sin(uv.x * PI) * uScrollSpeed;
  tPosition.y += yDisplacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(tPosition, 1.0);
  vUv = uv;
}
`;

const IMAGE_FRAGMENT = `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;
varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  vec3 finalColor = texture2D(uTexture, uv).rgb;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface CarouselMeshProps {
  texturePath: string;
  position: [number, number, number];
  index: number;
  groupRef: React.RefObject<THREE.Group | null>;
}

function CarouselMesh({ texturePath, position, index, groupRef }: CarouselMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, texturePath);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uScrollSpeed: { value: 0 },
    uPlaneSizes: { value: new THREE.Vector2(1, 1.33) },
    uImageSizes: { value: new THREE.Vector2(texture.image?.width || 600, texture.image?.height || 800) },
    uCurveStrength: { value: 2.0 },
    uCurveFrequency: { value: 0.4 },
  }), [texture]);

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    const mesh = meshRef.current;
    const velocity = (mesh.userData as Record<string, number>).scrollVelocity || 0;
    (mesh.userData as Record<string, number>).currentScroll = THREE.MathUtils.lerp(
      (mesh.userData as Record<string, number>).currentScroll || 0,
      velocity,
      0.1
    );

    const mat = mesh.material as THREE.ShaderMaterial;
    if (mat.uniforms) {
      mat.uniforms.uScrollSpeed.value = (mesh.userData as Record<string, number>).currentScroll;
    }

    mesh.position.x += (mesh.userData as Record<string, number>).currentScroll * delta;

    const worldX = mesh.position.x + groupRef.current.position.x;
    if (worldX > 6) {
      mesh.position.x -= 12;
    } else if (worldX < -6) {
      mesh.position.x += 12;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      userData={{ baseX: position[0], currentScroll: 0, scrollVelocity: 0, index }}
    >
      <planeGeometry args={[1, 1.33, 32, 32]} />
      <shaderMaterial
        vertexShader={CYLINDER_VERTEX}
        fragmentShader={IMAGE_FRAGMENT}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CarouselScene() {
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(0.002);

  const carouselProducts = useMemo(() => {
    const carouselItems = products.filter(p => p.images.length > 0).slice(0, 8);
    return carouselItems;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += velocityRef.current;
  });

  // Mouse drag to spin
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const handlePointerDown = useCallback((e: THREE.Event) => {
    isDragging.current = true;
    lastX.current = (e as unknown as PointerEvent).clientX;
  }, []);

  const handlePointerMove = useCallback((e: THREE.Event) => {
    if (!isDragging.current) return;
    const clientX = (e as unknown as PointerEvent).clientX;
    const delta = (clientX - lastX.current) * 0.001;
    velocityRef.current = delta;
    lastX.current = clientX;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    // Decay back to idle rotation
    const decay = () => {
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0.002, 0.02);
      if (Math.abs(velocityRef.current - 0.002) > 0.0001) {
        requestAnimationFrame(decay);
      }
    };
    decay();
  }, []);

  return (
    <group
      ref={groupRef}
      position={[0, -0.5, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {carouselProducts.map((product, i) => {
        const total = carouselProducts.length;
        const spacing = 12 / total;
        const xPos = (i - (total - 1) / 2) * spacing;
        return (
          <CarouselMesh
            key={product.id}
            texturePath={product.images[0]}
            position={[xPos, 0, 0]}
            index={i}
            groupRef={groupRef}
          />
        );
      })}
    </group>
  );
}

export default function CylinderCarousel() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselProducts = products.filter(p => p.images.length > 0).slice(0, 8);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] bg-raius-bg">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.2} />
          <Suspense fallback={null}>
            <CarouselScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute bottom-[10vh] left-[8vw] z-10">
        <p className="text-micro text-raius-text-tertiary">
          01 / {String(carouselProducts.length).padStart(2, '0')}
        </p>
        <p className="text-base font-medium text-raius-text mt-1 uppercase tracking-wide">
          {carouselProducts[0]?.name || 'Oversized Hoodie'}
        </p>
        <p className="text-lg font-semibold text-raius-text mt-1">
          {formatPrice(carouselProducts[0]?.price || 189)}
        </p>
        <button
          onClick={() => carouselProducts[0] && navigate(`/product/${carouselProducts[0].id}`)}
          className="text-micro text-raius-warm mt-3 flex items-center gap-2 hover:underline"
        >
          VIEW <span className="text-lg">&rarr;</span>
        </button>
      </div>

      {/* Section Title */}
      <div className="absolute top-20 left-[8vw] z-10">
        <p className="text-micro text-raius-text-tertiary tracking-[0.2em]">EXPLORE</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-raius-text mt-2">
          The Collection
        </h2>
      </div>
    </section>
  );
}
