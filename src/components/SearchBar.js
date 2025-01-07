import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const mountRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const containerWidth = currentMount.offsetWidth;
    const containerHeight = currentMount.offsetHeight;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Position canvas
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '1';

    // Create glowing ring
    const geometry = new THREE.TorusGeometry(1.2, 0.03, 16, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0x2193b0,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.y = 0;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Add particles around the ring
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i += 3) {
      const angle = (Math.random() * Math.PI * 2);
      const radius = 1.2 + (Math.random() - 0.5) * 0.2;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = 0;
      positions[i + 2] = Math.sin(angle) * radius;

      velocities[i] = (Math.random() - 0.5) * 0.005;
      velocities[i + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.005;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x6dd5ed,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Position camera to center the ring
    camera.position.z = 3;
    camera.position.y = 0;

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate ring
      ring.rotation.z += 0.005;

      // Animate particles
      const positions = particlesGeometry.attributes.position.array;
      for(let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Reset particles that move too far
        const distance = Math.sqrt(
          positions[i] ** 2 + 
          positions[i + 1] ** 2 + 
          positions[i + 2] ** 2
        );

        if (distance > 1.2) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.8;
          positions[i] = Math.cos(angle) * radius;
          positions[i + 1] = Math.sin(angle) * radius;
          positions[i + 2] = 0;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Scale effect on focus
      const targetScale = isFocused ? 1.1 : 1;
      ring.scale.x += (targetScale - ring.scale.x) * 0.1;
      ring.scale.y += (targetScale - ring.scale.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = currentMount.offsetWidth;
      const newHeight = currentMount.offsetHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [isFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
      setLocation('');
      setIsFocused(false);
    }
  };

  return (
    <div className="search-container" ref={mountRef}>
      <form onSubmit={handleSubmit} className={`search-bar ${isFocused ? 'focused' : ''}`}>
        <input
          ref={searchRef}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter city name..."
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;