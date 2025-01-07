import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Background3D({ weatherCondition, temperature }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Position the canvas
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.pointerEvents = 'none';

    // Create multiple particle systems
    const createParticleSystem = (count, size, speed, color) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      for(let i = 0; i < count * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        // Velocity
        velocities[i] = (Math.random() - 0.5) * speed;
        velocities[i + 1] = (Math.random() - 0.5) * speed;
        velocities[i + 2] = (Math.random() - 0.5) * speed;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      const system = new THREE.Points(geometry, material);
      scene.add(system);

      return {
        system,
        geometry,
        material,
        velocities
      };
    };

    // Get weather-based parameters
    const getWeatherParams = () => {
      const condition = weatherCondition?.toLowerCase() || '';
      const temp = temperature || 20;

      if (condition.includes('rain')) {
        return {
          count: 3000,
          size: 0.02,
          speed: 0.02,
          color: 0x4444ff,
          rotationSpeed: 0.0001
        };
      } else if (condition.includes('snow')) {
        return {
          count: 2000,
          size: 0.03,
          speed: 0.01,
          color: 0xffffff,
          rotationSpeed: 0.0002
        };
      } else if (condition.includes('cloud')) {
        return {
          count: 1500,
          size: 0.04,
          speed: 0.005,
          color: 0x888888,
          rotationSpeed: 0.0003
        };
      } else if (condition.includes('clear') || condition.includes('sunny')) {
        return {
          count: 1000,
          size: 0.05,
          speed: 0.015,
          color: 0xffdd00,
          rotationSpeed: 0.0004
        };
      }
      return {
        count: 1500,
        size: 0.03,
        speed: 0.01,
        color: 0x4444ff,
        rotationSpeed: 0.0002
      };
    };

    const params = getWeatherParams();
    const particleSystems = [
      createParticleSystem(params.count, params.size, params.speed, params.color),
      createParticleSystem(Math.floor(params.count / 2), params.size * 1.5, params.speed * 0.5, params.color)
    ];

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particleSystems.forEach((ps, index) => {
        const positions = ps.geometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i += 3) {
          positions[i] += ps.velocities[i];
          positions[i + 1] += ps.velocities[i + 1];
          positions[i + 2] += ps.velocities[i + 2];

          // Reset particles that go out of bounds
          if (Math.abs(positions[i]) > 5) positions[i] = (Math.random() - 0.5) * 10;
          if (Math.abs(positions[i + 1]) > 5) positions[i + 1] = (Math.random() - 0.5) * 10;
          if (Math.abs(positions[i + 2]) > 5) positions[i + 2] = (Math.random() - 0.5) * 10;
        }

        ps.geometry.attributes.position.needsUpdate = true;
        ps.system.rotation.x += params.rotationSpeed * (index + 1);
        ps.system.rotation.y += params.rotationSpeed * (index + 1);
      });

      // Camera movement based on mouse position
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

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

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      particleSystems.forEach(ps => {
        ps.material.dispose();
        ps.geometry.dispose();
        scene.remove(ps.system);
      });
      
      renderer.dispose();
      currentMount?.removeChild(renderer.domElement);
    };
  }, [weatherCondition, temperature]);

  return <div ref={mountRef} />;
}

export default Background3D;