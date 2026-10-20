"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ProceduralAvatarCanvasProps {
  explodeFactor: number;
  isSpeaking: boolean;
  activeModel: "PHOENIX-S4" | "RAVEN-S1" | "SPARROW-S1";
  accentColor?: string;
}

export default function ProceduralAvatarCanvas({
  explodeFactor,
  isSpeaking,
  activeModel,
}: ProceduralAvatarCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const explodeRef = useRef<number>(explodeFactor);
  const speakingRef = useRef<boolean>(isSpeaking);
  const modelRef = useRef<string>(activeModel);

  useEffect(() => {
    explodeRef.current = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    speakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    modelRef.current = activeModel;
  }, [activeModel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0709, 0.065);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting — Sovereign Studio Rig
    const ambientLight = new THREE.AmbientLight(0xffd6e6, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff6183, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    const underLight = new THREE.PointLight(0xa855f7, 2.0, 12);
    underLight.position.set(0, -3, 2);
    scene.add(underLight);

    // Master Root Assembly
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    // Materials
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x160f13,
      metalness: 0.88,
      roughness: 0.22,
    });

    const sovereignPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff6183,
      emissive: 0xff2a5f,
      emissiveIntensity: 0.55,
      metalness: 0.65,
      roughness: 0.18,
    });

    const cyanMatrixMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      metalness: 0.8,
      roughness: 0.15,
    });

    const wireframeHoloMat = new THREE.MeshBasicMaterial({
      color: 0xffb4c5,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    // =========================================================================
    // 1. CHASSIS & CRANIAL SHELL GROUP (LatheGeometry + ExtrudeGeometry)
    // =========================================================================
    const chassisGroup = new THREE.Group();
    chassisGroup.userData.explodeVector = new THREE.Vector3(0, -1.1, -0.8);

    const lathePoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const radius = 0.65 + Math.sin(t * Math.PI) * 0.42 - t * 0.18;
      const y = (t - 0.5) * 2.1;
      lathePoints.push(new THREE.Vector2(radius, y));
    }
    const cranialLatheGeo = new THREE.LatheGeometry(lathePoints, 32);
    const cranialShell = new THREE.Mesh(cranialLatheGeo, wireframeHoloMat);
    chassisGroup.add(cranialShell);

    // Custom 2D Shape Extrusion for Sovereign Collar Base
    const collarShape = new THREE.Shape();
    collarShape.absarc(0, 0, 1.15, 0, Math.PI * 2, false);
    const collarHole = new THREE.Path();
    collarHole.absarc(0, 0, 0.78, 0, Math.PI * 2, true);
    collarShape.holes.push(collarHole);

    const collarGeo = new THREE.ExtrudeGeometry(collarShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, obsidianMat);
    collarMesh.position.y = -1.15;
    chassisGroup.add(collarMesh);

    rootAssembly.add(chassisGroup);

    // =========================================================================
    // 2. NEURAL CORE GROUP (Icosahedron + Inner Harmonic Nucleus)
    // =========================================================================
    const neuralCoreGroup = new THREE.Group();
    neuralCoreGroup.userData.explodeVector = new THREE.Vector3(0, 0.9, 0.4);

    const coreGeo = new THREE.IcosahedronGeometry(0.68, 2);
    const coreMesh = new THREE.Mesh(coreGeo, sovereignPinkMat);
    neuralCoreGroup.add(coreMesh);

    const innerShellGeo = new THREE.OctahedronGeometry(0.88, 1);
    const innerShellMesh = new THREE.Mesh(
      innerShellGeo,
      new THREE.MeshBasicMaterial({
        color: 0xff6183,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );
    neuralCoreGroup.add(innerShellMesh);

    rootAssembly.add(neuralCoreGroup);

    // =========================================================================
    // 3. OPTIC PERCEPTION VISOR GROUP (Raven-S1 Multimodal Array)
    // =========================================================================
    const opticVisorGroup = new THREE.Group();
    opticVisorGroup.userData.explodeVector = new THREE.Vector3(0, 0.25, 1.45);

    const visorGeo = new THREE.TorusGeometry(0.82, 0.055, 16, 48, Math.PI * 0.85);
    const visorMesh = new THREE.Mesh(visorGeo, cyanMatrixMat);
    visorMesh.rotation.x = Math.PI * 0.05;
    visorMesh.rotation.z = Math.PI * 0.075;
    visorMesh.position.set(0, 0.22, 0.28);
    opticVisorGroup.add(visorMesh);

    // Dual Optic Sensors
    const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, cyanMatrixMat);
    leftEye.position.set(-0.34, 0.24, 0.95);
    const rightEye = new THREE.Mesh(eyeGeo, cyanMatrixMat);
    rightEye.position.set(0.34, 0.24, 0.95);
    opticVisorGroup.add(leftEye, rightEye);

    rootAssembly.add(opticVisorGroup);

    // =========================================================================
    // 4. ACOUSTIC HARMONIC & TUBE SPLINE GROUP (Sparrow-S1 Timing Ring)
    // =========================================================================
    const acousticGroup = new THREE.Group();
    acousticGroup.userData.explodeVector = new THREE.Vector3(-1.2, 0, 0.6);

    const outerRingGeo = new THREE.TorusGeometry(1.42, 0.025, 16, 96);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, sovereignPinkMat);
    outerRingMesh.rotation.x = Math.PI / 2.6;
    acousticGroup.add(outerRingMesh);

    const secondaryRingGeo = new THREE.TorusGeometry(1.68, 0.018, 12, 96);
    const secondaryRingMesh = new THREE.Mesh(secondaryRingGeo, cyanMatrixMat);
    secondaryRingMesh.rotation.y = Math.PI / 3;
    acousticGroup.add(secondaryRingMesh);

    // Procedural Tube Spline Conduits
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      curvePoints.push(
        new THREE.Vector3(
          Math.cos(angle) * 1.18,
          Math.sin(angle * 3) * 0.28,
          Math.sin(angle) * 1.18
        )
      );
    }
    const splineCurve = new THREE.CatmullRomCurve3(curvePoints, true);
    const splineGeo = new THREE.TubeGeometry(splineCurve, 96, 0.018, 8, true);
    const splineMesh = new THREE.Mesh(splineGeo, cyanMatrixMat);
    acousticGroup.add(splineMesh);

    rootAssembly.add(acousticGroup);

    // =========================================================================
    // 5. PERFORMANCE INSTANCING: 48 ORBITAL SYNAPTIC FASTENERS (InstancedMesh)
    // =========================================================================
    const fastenersGroup = new THREE.Group();
    fastenersGroup.userData.explodeVector = new THREE.Vector3(1.25, 0.3, -0.5);

    const instanceCount = 48;
    const nodeGeo = new THREE.BoxGeometry(0.055, 0.055, 0.14);
    const instancedNodes = new THREE.InstancedMesh(
      nodeGeo,
      sovereignPinkMat,
      instanceCount
    );
    const dummy = new THREE.Object3D();

    for (let i = 0; i < instanceCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / instanceCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.25;
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    fastenersGroup.add(instancedNodes);

    rootAssembly.add(fastenersGroup);

    const subAssemblies = [
      chassisGroup,
      neuralCoreGroup,
      opticVisorGroup,
      acousticGroup,
      fastenersGroup,
    ];

    // =========================================================================
    // TRIGONOMETRIC KINEMATICS LOOP (Zero Keyframes — Pure Mathematical Rig)
    // =========================================================================
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const exp = explodeRef.current;
      const speaking = speakingRef.current;
      const model = modelRef.current;

      // Model-specific color resonance
      if (model === "PHOENIX-S4") {
        sovereignPinkMat.color.setHex(0xff6183);
        sovereignPinkMat.emissive.setHex(0xff2a5f);
      } else if (model === "RAVEN-S1") {
        sovereignPinkMat.color.setHex(0x38bdf8);
        sovereignPinkMat.emissive.setHex(0x0284c7);
      } else {
        sovereignPinkMat.color.setHex(0xa855f7);
        sovereignPinkMat.emissive.setHex(0x7e22ce);
      }

      // Apply Exploded View Translation Vectors smoothly
      for (const group of subAssemblies) {
        const targetVec = (group.userData.explodeVector as THREE.Vector3)
          .clone()
          .multiplyScalar(exp);
        group.position.lerp(targetVec, 0.12);
      }

      // Trigonometric Kinematics: Vocal & Neural Pulse
      const vocalPulse = speaking
        ? 1 + Math.sin(t * 18) * 0.14 + Math.cos(t * 29) * 0.08
        : 1 + Math.sin(t * 2.5) * 0.04;
      coreMesh.scale.setScalar(vocalPulse);
      innerShellMesh.rotation.y = -t * 0.65;
      innerShellMesh.rotation.z = Math.sin(t * 1.2) * 0.35;

      // Slider-crank harmonic nodding & eye tracking for Optic Visor
      opticVisorGroup.rotation.y = Math.sin(t * 1.1) * 0.22;
      opticVisorGroup.rotation.x = Math.cos(t * 0.85) * 0.08;

      // Acoustic rings counter-rotation
      outerRingMesh.rotation.z = t * 0.55;
      secondaryRingMesh.rotation.x = -t * 0.42 + Math.sin(t) * 0.2;
      splineMesh.rotation.y = t * 0.35;

      // Update InstancedMesh radial breathing using trigonometric phase
      for (let i = 0; i < instanceCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / instanceCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i + t * 0.25;
        const r =
          1.25 +
          Math.sin(t * (speaking ? 10 : 2.2) + i * 0.45) *
            (speaking ? 0.16 : 0.05);
        dummy.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
        dummy.lookAt(0, 0, 0);
        dummy.updateMatrix();
        instancedNodes.setMatrixAt(i, dummy.matrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;

      // Gentle holistic rotation
      rootAssembly.rotation.y = Math.sin(t * 0.35) * 0.32;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 560;
      const newH = container.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[320px] relative select-none"
      aria-label="Procedural 3D Sovereign SI Core generated at runtime"
    />
  );
}
