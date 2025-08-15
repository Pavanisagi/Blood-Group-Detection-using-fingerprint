import React, { useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Tooltip, Stack, Chip } from '@mui/material';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SpeedIcon from '@mui/icons-material/Speed';
import Slider from '@mui/material/Slider';

interface BloodGroupInfo {
  type: string;
  color: string | number;
  size: number;
  count: number;
  pattern: string;
  description: string;
  compatibility: {
    canReceiveFrom: string[];
    canDonateTo: string[];
  };
  characteristics: {
    antigenPresence: string[];
    antibodyPresence: string[];
    healthRisks: string[];
    rhFactor: string;
  };
  statistics: {
    globalPercentage: number;
    donationFrequency: string;
    storageLife: number;
  };
}

interface VisualizationContainerProps {
  title: string;
  subtitle: string;
  bloodType: string;
  compareBloodType?: string;
  bloodGroups: BloodGroupInfo[];
  showHealthMetrics?: boolean;
  showCompatibility?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onAutoRotate?: () => void;
  onSpeedChange?: (speed: number) => void;
}

interface BloodCellInfo {
  size: number;
  count: number;
  color: string;
  pattern: string;
  characteristics: {
    antigenPresence: boolean[];
    antibodyPresence: boolean[];
    healthRisks: string[];
    compatibility: {
      canDonateTo: string[];
      canReceiveFrom: string[];
    };
  };
}

interface Props {
  title: string;
  subtitle: string;
  bloodType: string;
  compareBloodType?: string;
  showHealthMetrics?: boolean;
  showCompatibility?: boolean;
  info: BloodCellInfo;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  title,
  subtitle,
  bloodType,
  compareBloodType,
  bloodGroups,
  showHealthMetrics = false,
  showCompatibility = false,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onAutoRotate,
  onSpeedChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const bloodCellsRef = useRef<THREE.Mesh[]>([]);
  const [isAutoRotating, setIsAutoRotating] = React.useState(false);
  const [rotationSpeed, setRotationSpeed] = React.useState(0.5);
  const [showControls, setShowControls] = React.useState(false);
  const theme = useTheme();

  const createBloodCells = (info: BloodGroupInfo, offset: number = 0) => {
    const cells: THREE.Mesh[] = [];
    const { size, count, color, pattern, characteristics } = info;

    // Convert string color to number if needed
    let colorValue = color;
    if (typeof color === 'string') {
      // Remove the # if present and convert to number
      const hexColor = color.startsWith('#') ? color.substring(1) : color;
      colorValue = parseInt(hexColor, 16);
    }

    // Create main blood cell
    const mainGeometry = new THREE.SphereGeometry(size, 32, 32);
    const mainMaterial = new THREE.MeshPhongMaterial({
      color: colorValue,
      shininess: 100,
      specular: 0x444444,
    });
    const mainCell = new THREE.Mesh(mainGeometry, mainMaterial);
    mainCell.position.x = offset;
    cells.push(mainCell);

    // Add antigens based on blood type
    if (characteristics.antigenPresence.length > 0) {
      characteristics.antigenPresence.forEach((antigen, index) => {
        const antigenGeometry = new THREE.SphereGeometry(size * 0.2, 16, 16);
        const antigenMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shininess: 50,
        });
        const antigenMesh = new THREE.Mesh(antigenGeometry, antigenMaterial);
        
        // Position antigens around the main cell
        const angle = (index / characteristics.antigenPresence.length) * Math.PI * 2;
        antigenMesh.position.x = Math.cos(angle) * size * 1.2 + offset;
        antigenMesh.position.y = Math.sin(angle) * size * 1.2;
        cells.push(antigenMesh);
      });
    }

    // Add antibodies
    if (characteristics.antibodyPresence.length > 0) {
      characteristics.antibodyPresence.forEach((antibody, index) => {
        const antibodyGeometry = new THREE.ConeGeometry(size * 0.15, size * 0.3, 8);
        const antibodyMaterial = new THREE.MeshPhongMaterial({
          color: 0xffff00,
          shininess: 30,
        });
        const antibodyMesh = new THREE.Mesh(antibodyGeometry, antibodyMaterial);
        
        // Position antibodies around the main cell
        const angle = (index / characteristics.antibodyPresence.length) * Math.PI * 2;
        antibodyMesh.position.x = Math.cos(angle) * size * 1.5 + offset;
        antibodyMesh.position.y = Math.sin(angle) * size * 1.5;
        antibodyMesh.rotation.z = angle;
        cells.push(antibodyMesh);
      });
    }

    // Add Rh factor indicator
    if (characteristics.rhFactor === 'positive') {
      const rhGeometry = new THREE.TorusGeometry(size * 0.3, size * 0.05, 16, 32);
      const rhMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 80,
      });
      const rhMesh = new THREE.Mesh(rhGeometry, rhMaterial);
      rhMesh.position.x = offset;
      rhMesh.rotation.x = Math.PI / 2;
      cells.push(rhMesh);
    }

    return cells;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    // Get container dimensions
    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerWidth, containerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0); // Set the target to the center of the scene

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate blood cells
      bloodCellsRef.current.forEach((cell, index) => {
        const time = Date.now() * 0.001;
        cell.rotation.y += 0.005;
        
        // Add subtle floating motion
        cell.position.y += Math.sin(time + index) * 0.001;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing blood cells
    bloodCellsRef.current.forEach(cell => sceneRef.current?.remove(cell));
    bloodCellsRef.current = [];

    const selectedInfo = bloodGroups.find(bg => bg.type === bloodType);
    if (selectedInfo) {
      const cells = createBloodCells(selectedInfo);
      
      // Center the blood cells in the scene
      const group = new THREE.Group();
      cells.forEach(cell => group.add(cell));
      sceneRef.current.add(group);
      bloodCellsRef.current = cells;

      // Add health metrics visualization if enabled
      if (showHealthMetrics) {
        const healthMetrics = createHealthMetricsVisualization(selectedInfo);
        healthMetrics.forEach(metric => sceneRef.current?.add(metric));
        bloodCellsRef.current = [...bloodCellsRef.current, ...healthMetrics];
      }

      // Add compatibility visualization if enabled
      if (showCompatibility) {
        const compatibility = createCompatibilityVisualization(selectedInfo);
        compatibility.forEach(comp => sceneRef.current?.add(comp));
        bloodCellsRef.current = [...bloodCellsRef.current, ...compatibility];
      }
    }

    if (compareBloodType) {
      const compareInfo = bloodGroups.find(bg => bg.type === compareBloodType);
      if (compareInfo) {
        const cells = createBloodCells(compareInfo, 4);
        cells.forEach(cell => sceneRef.current?.add(cell));
        bloodCellsRef.current = [...bloodCellsRef.current, ...cells];
      }
    }
  }, [bloodType, compareBloodType, bloodGroups, showHealthMetrics, showCompatibility]);

  const createHealthMetricsVisualization = (info: BloodGroupInfo) => {
    const metrics: THREE.Mesh[] = [];
    const { characteristics, statistics } = info;

    // Create health risk indicators
    characteristics.healthRisks.forEach((risk, index) => {
      const riskGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const riskMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
      });
      const riskMesh = new THREE.Mesh(riskGeometry, riskMaterial);
      riskMesh.position.x = 2 + index * 0.3;
      riskMesh.position.y = 1;
      metrics.push(riskMesh);
    });

    // Create storage life indicator
    const storageGeometry = new THREE.CylinderGeometry(0.1, 0.1, statistics.storageLife * 0.1, 32);
    const storageMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7,
    });
    const storageMesh = new THREE.Mesh(storageGeometry, storageMaterial);
    storageMesh.position.x = 2;
    storageMesh.position.y = -1;
    metrics.push(storageMesh);

    return metrics;
  };

  const createCompatibilityVisualization = (info: BloodGroupInfo) => {
    const compatibility: THREE.Mesh[] = [];
    const { compatibility: comp } = info;

    // Create compatibility indicators
    comp.canDonateTo.forEach((type, index) => {
      const compGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
      const compMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.7,
      });
      const compMesh = new THREE.Mesh(compGeometry, compMaterial);
      compMesh.position.x = -2 + index * 0.3;
      compMesh.position.y = 1;
      compatibility.push(compMesh);
    });

    return compatibility;
  };

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
      setIsAutoRotating(!isAutoRotating);
      onAutoRotate?.();
    }
  };

  const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
    const speed = newValue as number;
    setRotationSpeed(speed);
    if (controlsRef.current) {
      controlsRef.current.autoRotateSpeed = speed * 2;
    }
    onSpeedChange?.(speed);
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <BloodtypeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        </motion.div>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box
        ref={mountRef}
        sx={{
          position: 'relative',
          height: 'calc(100% - 80px)',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Blood Type Labels */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <Chip
            icon={<BloodtypeIcon />}
            label={bloodType}
            color="primary"
            variant="outlined"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
          />
          {compareBloodType && (
            <Chip
              icon={<BloodtypeIcon />}
              label={compareBloodType}
              color="secondary"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
            />
          )}
        </Stack>

        {/* Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 16,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1,
            pointerEvents: 'none', // This makes the container transparent to mouse events
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <IconButton 
              onClick={onZoomIn} 
              size="small"
              sx={{ 
                pointerEvents: 'auto', // Re-enable mouse events for the button
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton 
              onClick={onZoomOut} 
              size="small"
              sx={{ 
                pointerEvents: 'auto',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <IconButton 
              onClick={onRotateLeft} 
              size="small"
              sx={{ 
                pointerEvents: 'auto',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <RotateLeftIcon />
            </IconButton>
            <IconButton 
              onClick={onRotateRight} 
              size="small"
              sx={{ 
                pointerEvents: 'auto',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <RotateRightIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <IconButton
              onClick={handleToggleAutoRotate}
              size="small"
              sx={{ 
                pointerEvents: 'auto',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                color: isAutoRotating ? "primary.main" : "inherit"
              }}
            >
              {isAutoRotating ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton 
              onClick={handleResetView} 
              size="small"
              sx={{ 
                pointerEvents: 'auto',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VisualizationContainer; 