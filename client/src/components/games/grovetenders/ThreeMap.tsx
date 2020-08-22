import React, { useEffect, useState, useRef } from 'react';
import {
  GroveGameState,
  GrovePlayer,
} from '@server/store/games/grovetenders/types';
import styles from './CanvasMap.module.css';
import { Canvas, useFrame, ReactThreeFiber } from 'react-three-fiber';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import THREE from 'three';

export interface GroveMapProps {
  game: GroveGameState;
}

export interface MapOccupant {
  player: GrovePlayer;
  type: 'active' | 'hidden' | 'previous';
}

const GroveMap: React.FC<GroveMapProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  return (
    <div>
      <Canvas>
        <pointLight position={[10, 10, 10]} />
        <BallMesh />
      </Canvas>
    </div>
  );
};

const BallMesh = () => {
  const ballRef = useRef<any>(null);

  useFrame(() => {
    ballRef.current.position.x += 0.01;
    ballRef.current.rotation.x += 0.01;
    ballRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={ballRef} position={[0, 0, 0]}>
      <dodecahedronBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color="hotpink" />
    </mesh>
  );
};

export default GroveMap;
