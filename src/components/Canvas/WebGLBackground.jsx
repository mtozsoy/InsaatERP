import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function WebGLBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particles
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#0ea5e9'),
      new THREE.Color('#94a3b8'),
      new THREE.Color('#cbd5e1'),
      new THREE.Color('#64748b'),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Grid lines
    const gridGroup = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.08,
    });

    for (let i = -10; i <= 10; i += 2) {
      const hGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-60, i * 3, -20),
        new THREE.Vector3(60, i * 3, -20),
      ]);
      const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 6, -30, -20),
        new THREE.Vector3(i * 6, 30, -20),
      ]);
      gridGroup.add(new THREE.Line(hGeo, lineMaterial));
      gridGroup.add(new THREE.Line(vGeo, lineMaterial));
    }
    scene.add(gridGroup);

    // Floating orbs
    const orbGeometry = new THREE.SphereGeometry(2, 32, 32);
    const orbs = [];

    const orbColors = ['#e2e8f0', '#f1f5f9', '#cbd5e1'];
    orbColors.forEach((col, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.06,
        wireframe: false,
      });
      const orb = new THREE.Mesh(orbGeometry, mat);
      orb.position.set((i - 1) * 25, Math.sin(i) * 10, -15);
      scene.add(orb);
      orbs.push(orb);
    });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let frameId;
    const startTime = Date.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (Date.now() - startTime) / 1000;

      particles.rotation.y = t * 0.03 + mouseX * 0.05;
      particles.rotation.x = mouseY * 0.03;

      gridGroup.rotation.y = Math.sin(t * 0.05) * 0.1;

      orbs.forEach((orb, i) => {
        orb.position.y = Math.sin(t * 0.4 + i * 2) * 8;
        orb.rotation.y = t * 0.2;
        orb.material.opacity = 0.03 + Math.sin(t * 0.5 + i) * 0.02;
      });

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
