import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth || 320;
    const h = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 1000);
    camera.position.z = 2.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.6);
    light.position.set(5, 3, 8);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xaad4f5, 0.9));

    const geo = new THREE.SphereGeometry(1, 64, 64);
    const loader = new THREE.TextureLoader();

    // Try to load globe texture; fall back to procedural on error
    loader.load(
      '/globe.jpg',
      (tex) => {
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.65,
          metalness: 0.05,
        });
        const globe = new THREE.Mesh(geo, mat);
        scene.add(globe);
        const animate = () => {
          globe.rotation.y += 0.0025;
          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        };
        animate();
      },
      undefined,
      () => {
        // Fallback: procedural ocean + land look
        const mat = new THREE.MeshStandardMaterial({ color: 0x3a8fd1, roughness: 0.7 });
        const globe = new THREE.Mesh(geo, mat);
        scene.add(globe);
        const animate = () => {
          globe.rotation.y += 0.0025;
          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
    );

    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="weather-globe-container">
      <div
        ref={containerRef}
        className="weather-globe-canvas"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Globe;
