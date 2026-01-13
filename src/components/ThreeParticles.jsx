import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ThreeParticles({ interactionState, handPosition, initialPositions }) {
    // interactionState: 'idle' | 'attract' | 'repel'
    // handPosition: [x, y, z] normalized to roughly [-1, 1] range in view
    // initialPositions: array of {x, y, z} from image sampling

    const count = initialPositions ? initialPositions.length : 1500;
    const mesh = useRef();

    // Initialize particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            let x, y, z;

            if (initialPositions && initialPositions[i]) {
                // Start exactly at image position
                x = initialPositions[i].x;
                y = initialPositions[i].y;
                z = initialPositions[i].z;
            } else {
                x = (Math.random() - 0.5) * 12;
                y = (Math.random() - 0.5) * 12;
                z = (Math.random() - 0.5) * 6;
            }

            // Varied size: mostly small, some larger for accents
            // Varied size: some very small, some quite large for contrast
            // range 0.01 to 0.10 standard size (was 0.02-0.06)
            // Varied size: smaller overall for finer detail
            // range 0.008 to 0.04 (was 0.01-0.10)
            const baseScale = 0.008 + (Math.random() * 0.032);

            temp.push({
                x, y, z,
                originalX: x, originalY: y, originalZ: z,
                vx: 0, vy: 0, vz: 0,
                baseScale: baseScale
            });
        }
        return temp;
    }, [initialPositions, count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // Target position (hand or center)
        const targetX = handPosition ? handPosition[0] * 6 : 0;
        const targetY = handPosition ? -handPosition[1] * 6 : 0;
        const targetZ = 0;

        particles.forEach((particle, i) => {
            let { x, y, z, originalX, originalY, originalZ, vx, vy, vz, baseScale } = particle;

            if (interactionState === 'attract') {
                // Attract to hand -> Form a tight sphere/circle
                const dx = targetX - x;
                const dy = targetY - y;
                const dz = targetZ - z;
                const distSq = dx * dx + dy * dy + dz * dz;
                const dist = Math.sqrt(distSq);

                // Normalizing vectors for consistent speed
                if (dist > 0.1) {
                    const force = 60.0; // Reduced locally to 60 for better control
                    vx += (dx / dist) * force * delta;
                    vy += (dy / dist) * force * delta;
                    vz += (dz / dist) * force * delta;
                }

                // Strong damping to make them stop at the center
                vx *= 0.80;
                vy *= 0.80;
                vz *= 0.80;

            } else if (interactionState === 'repel') {
                // Repel from hand -> Expanding Sphere
                const dx = x - targetX;
                const dy = y - targetY;
                const dz = z - targetZ;
                const distSq = dx * dx + dy * dy + dz * dz;
                const dist = Math.sqrt(distSq);

                if (dist < 0.1) {
                    // If too close/at center, give random direction to start expansion
                    vx += (Math.random() - 0.5) * 80 * delta;
                    vy += (Math.random() - 0.5) * 80 * delta;
                    vz += (Math.random() - 0.5) * 80 * delta;
                } else if (dist < 10) { // Range of influence
                    // Radial Outward Force - Uniform to keep shape
                    const force = 120.0; // Increased repulsion speed
                    vx += (dx / dist) * force * delta;
                    vy += (dy / dist) * force * delta;
                    vz += (dz / dist) * force * delta;
                }

                // Less damping for repel so they fly out
                vx *= 0.95;
                vy *= 0.95;
                vz *= 0.95;

            } else {
                // IDLE: Return to Image Shape (originalX, originalY)
                const dx = originalX - x;
                const dy = originalY - y;
                const dz = originalZ - z;

                // Stronger stiffness to return within ~2 seconds
                const stiffness = 3.0;
                vx += dx * stiffness * delta * 60;
                vy += dy * stiffness * delta * 60;
                vz += dz * stiffness * delta * 60;

                // Heavily damped to prevent shaking/overshoot (Visual Stability)
                vx *= 0.80;
                vy *= 0.80;
                vz *= 0.80;
            }

            x += vx * delta;
            y += vy * delta;
            z += vz * delta;

            particle.x = x;
            particle.y = y;
            particle.z = z;
            particle.vx = vx;
            particle.vy = vy;
            particle.vz = vz;

            dummy.position.set(x, y, z);
            // Use randomized base scale + subtle breathing
            const scale = baseScale * (1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.1);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[1, 8, 8]} /> {/* Lower poly for performance */}
            <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1.0}
                roughness={0.0}
                metalness={0.0}
            />
        </instancedMesh>
    );
}
