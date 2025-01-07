import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Background3D({ weatherCondition, temperature }) {
  const mountRef = useRef(null);

  useEffect(() => {
    console.log('Background3D Props:', { weatherCondition, temperature }); // Debug log
    
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    // Get weather-based colors and parameters
    const getWeatherParams = () => {
      const condition = weatherCondition?.toLowerCase() || '';
      const temp = temperature || 20;
      
      console.log('Processing weather:', { condition, temp }); // Debug log

      if (condition.includes('thunder')) {
        return {
          mainColor: 0x222222,
          particleColor: 0xffffaa,
          particleCount: 2000,
          speed: 0.02,
          size: 0.05
        };
      } else if (condition.includes('rain')) {
        return {
          mainColor: 0x4444ff,
          particleColor: 0x6666ff,
          particleCount: 3000,
          speed: 0.08,
          size: 0.02
        };
      } else if (condition.includes('snow')) {
        return {
          mainColor: 0xffffff,
          particleColor: 0xeeeeff,
          particleCount: 2000,
          speed: 0.02,
          size: 0.04
        };
      } else if (condition.includes('cloud')) {
        return {
          mainColor: 0x888888,
          particleColor: 0x999999,
          particleCount: 1500,
          speed: 0.01,
          size: 0.04
        };
      } else {
        // Clear/sunny weather
        const warmthColor = temp > 30 ? 0xff8800 : 
                           temp > 20 ? 0xffdd00 : 
                           temp > 10 ? 0xffee88 : 0xffffee;
        console.log('Using warmth color:', warmthColor.toString(16)); // Debug log
        return {
          mainColor: warmthColor,
          particleColor: 0xffaa00,
          particleCount: 1000,
          speed: 0.015,
          size: 0.03
        };
      }
    };

    const params = getWeatherParams();
    console.log('Weather params:', params); // Debug log
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.pointerEvents = 'none';

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.particleCount * 3);
    const velocities = new Float32Array(params.particleCount * 3);

    for(let i = 0; i < params.particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;

      velocities[i] = (Math.random() - 0.5) * params.speed;
      velocities[i + 1] = (Math.random() - 0.5) * params.speed;
      velocities[i + 2] = (Math.random() - 0.5) * params.speed;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: params.size,
      color: params.mainColor,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add secondary particles for effect
    const secondaryGeometry = new THREE.BufferGeometry();
    const secondaryPositions = new Float32Array(params.particleCount * 3);
    
    for(let i = 0; i < params.particleCount * 3; i += 3) {
      secondaryPositions[i] = (Math.random() - 0.5) * 15;
      secondaryPositions[i + 1] = (Math.random() - 0.5) * 15;
      secondaryPositions[i + 2] = (Math.random() - 0.5) * 15;
    }

    secondaryGeometry.setAttribute('position', new THREE.BufferAttribute(secondaryPositions, 3));

    const secondaryMaterial = new THREE.PointsMaterial({
      size: params.size * 0.5,
      color: params.particleColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const secondaryParticles = new THREE.Points(secondaryGeometry, secondaryMaterial);
    scene.add(secondaryParticles);

    camera.position.z = 5;

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const positions = particlesGeometry.attributes.position.array;
      const secondaryPos = secondaryGeometry.attributes.position.array;

      for(let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        if (Math.abs(positions[i]) > 5) positions[i] = (Math.random() - 0.5) * 10;
        if (Math.abs(positions[i + 1]) > 5) positions[i + 1] = (Math.random() - 0.5) * 10;
        if (Math.abs(positions[i + 2]) > 5) positions[i + 2] = (Math.random() - 0.5) * 10;

        // Animate secondary particles more slowly
        secondaryPos[i] += velocities[i] * 0.5;
        secondaryPos[i + 1] += velocities[i + 1] * 0.5;
        secondaryPos[i + 2] += velocities[i + 2] * 0.5;

        if (Math.abs(secondaryPos[i]) > 7.5) secondaryPos[i] = (Math.random() - 0.5) * 15;
        if (Math.abs(secondaryPos[i + 1]) > 7.5) secondaryPos[i + 1] = (Math.random() - 0.5) * 15;
        if (Math.abs(secondaryPos[i + 2]) > 7.5) secondaryPos[i + 2] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      secondaryGeometry.attributes.position.needsUpdate = true;

      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0005;
      secondaryParticles.rotation.x += 0.0003;
      secondaryParticles.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      secondaryGeometry.dispose();
      secondaryMaterial.dispose();
      
      renderer.dispose();
      currentMount?.removeChild(renderer.domElement);
    };
  }, [weatherCondition, temperature]); // Add dependencies here

  return <div ref={mountRef} />;
}

export default Background3D;
