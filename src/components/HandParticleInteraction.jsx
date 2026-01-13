import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import ThreeParticles from './ThreeParticles';

export default function HandParticleInteraction() {
    const videoRef = useRef(null);
    const [interactionState, setInteractionState] = useState('idle'); // 'idle', 'attract', 'repel'
    const [handPosition, setHandPosition] = useState(null); // [x, y, z] normalized
    const [modelLoaded, setModelLoaded] = useState(false);
    const handLandmarkerRef = useRef(null);
    let animationFrameId = null;

    const [initialPositions, setInitialPositions] = useState(null);

    useEffect(() => {
        // Load the target image and sample positions
        const img = new Image();
        img.src = '/target_image.jpg';
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Resize for performance (limit particle count)
            // Aspect ratio maintenance
            const maxDimension = 140; // Increased from 100 for better detail (~2x particles)
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDimension) {
                    height *= maxDimension / width;
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width *= maxDimension / height;
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const positions = [];

            // Scan pixels
            // Map 2D grid to 3D space centered at 0,0
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const alpha = data[index + 3];

                    // Simple luminance
                    const brightness = (r + g + b) / 3;

                    // IF DARK (Black parts of image), create pixel
                    // Threshold < 100 (approx dark grey)
                    if (alpha > 128 && brightness < 100) {
                        // Reduced scale factor from 10 to 6 for smaller image
                        const nX = (x / width - 0.5) * 6;
                        const nY = -(y / height - 0.5) * 6 * (height / width);
                        const nZ = 0;

                        positions.push({ x: nX, y: nY, z: nZ });
                    }
                }
            }
            console.log(`Generated ${positions.length} particles from image.`);
            setInitialPositions(positions);
        };
    }, []);

    // ... (keep startWebcam as is, no changes needed there, assuming it's correct in context) ...
    // Note: Since I am using replace_file_content on a block, I need to be careful to match the context.
    // The previous edit block ended at setInitialPositions.
    // I will target the specific blocks.

    // Actually, I'll use multi_replace for clarity since I need to touch logic lower down too.


    useEffect(() => {
        let landmarker = null;

        const setupMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );
                landmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                handLandmarkerRef.current = landmarker;
                setModelLoaded(true);
                startWebcam();
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                alert("Failed to load AI Model. Please check your connection.");
            }
        };

        setupMediaPipe();

        return () => {
            if (landmarker) landmarker.close();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const startWebcam = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: {
                    width: 640,
                    height: 480
                }
            };

            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('loadeddata', predictWebcam);
                }
            }).catch((err) => {
                console.error("Webcam access denied:", err);
                alert("Camera access is required for hand interaction.");
            });
        }
    };

    const predictWebcam = () => {
        const video = videoRef.current;
        const landmarker = handLandmarkerRef.current;

        if (video && landmarker) {
            let startTimeMs = performance.now();
            if (video.currentTime > 0) {
                const results = landmarker.detectForVideo(video, startTimeMs);

                if (results.landmarks && results.landmarks.length > 0) {
                    const landmarks = results.landmarks[0];
                    const wrist = landmarks[0];
                    const middleMcp = landmarks[9];
                    const palmX = (wrist.x + middleMcp.x) / 2;
                    const palmY = (wrist.y + middleMcp.y) / 2;
                    const palmZ = (wrist.z + middleMcp.z) / 2;

                    const normX = (palmX - 0.5) * 2 * -1; // Flip X
                    const normY = (palmY - 0.5) * 2;
                    const normZ = palmZ;

                    setHandPosition([normX, normY, normZ]);

                    const tip = landmarks[12];
                    const dX = tip.x - wrist.x;
                    const dY = tip.y - wrist.y;
                    const distToTip = Math.sqrt(dX * dX + dY * dY);

                    // Adaptive scaling for robustness
                    const sX = middleMcp.x - wrist.x;
                    const sY = middleMcp.y - wrist.y;
                    const palmScale = Math.sqrt(sX * sX + sY * sY) || 0.1;

                    const ratio = distToTip / palmScale;

                    if (ratio < 1.4) {
                        setInteractionState('attract');
                    } else {
                        // Open Hand or Idle -> Return to Image
                        setInteractionState('idle');
                    }

                } else {
                    setInteractionState('idle');
                    setHandPosition(null);
                }
            }
            animationFrameId = requestAnimationFrame(predictWebcam);
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: false }}>
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                {initialPositions && (
                    <ThreeParticles
                        interactionState={interactionState}
                        handPosition={handPosition}
                        initialPositions={initialPositions}
                    />
                )}
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>

            {/* Video Feed for debugging */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute bottom-4 left-4 w-48 h-36 border-2 border-white/20 rounded-lg z-50 opacity-50 hover:opacity-100 transition-opacity"
                style={{ transform: 'scaleX(-1)' }}
            />

            {/* Removed blocking loading overlay */}

            <div className="absolute top-4 left-4 text-white z-50 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Hand Interaction
                    {!modelLoaded && (
                        <span className="text-xs font-normal text-yellow-400 animate-pulse bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">
                            Loading AI...
                        </span>
                    )}
                </h2>
                <p>State: <span className="font-mono text-cyan-400 uppercase">{interactionState}</span></p>
                <div className="text-sm text-gray-400 mt-2">
                    <p>🖐️ Open Hand: Return to Image</p>
                    <p>👊 Fist: Gather Particles</p>
                </div>
                {/* Debug Info */}
                {handPosition && <div className="text-xs text-gray-500 mt-1">Hand Detected</div>}
            </div>
        </div>
    );
}
