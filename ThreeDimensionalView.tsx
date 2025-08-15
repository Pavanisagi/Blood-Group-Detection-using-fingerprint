import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box, Typography } from '@mui/material';

interface ThreeDimensionalViewProps {
  data: any;
}

const ThreeDimensionalView: React.FC<ThreeDimensionalViewProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Create fingerprint visualization
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(data.points.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.x += 0.01;
      points.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [data]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        3D Fingerprint Visualization
      </Typography>
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '400px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </Box>
  );
};

export default ThreeDimensionalView; 