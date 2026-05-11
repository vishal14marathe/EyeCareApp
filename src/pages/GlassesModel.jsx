function GlassesModel() {
  return (
    <group>
      {/* LEFT GLASS */}

      <mesh position={[-0.9, 0, 0]}>
        <torusGeometry args={[0.5, 0.07, 16, 100]} />

        <meshStandardMaterial color="black" metalness={1} roughness={0.2} />
      </mesh>

      {/* RIGHT GLASS */}

      <mesh position={[0.9, 0, 0]}>
        <torusGeometry args={[0.5, 0.07, 16, 100]} />

        <meshStandardMaterial color="black" metalness={1} roughness={0.2} />
      </mesh>

      {/* CENTER */}

      <mesh>
        <boxGeometry args={[0.6, 0.06, 0.05]} />

        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

export default GlassesModel;
