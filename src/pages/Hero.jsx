import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import GlassesModel from "./GlassesModel";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 pt-32 gap-20">
      {/* LEFT */}

      <div className="flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl lg:text-8xl font-black leading-tight"
        >
          Your Face,
          <br />
          Your Stage.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-gray-500 text-lg max-w-xl"
        >
          Experience premium AI powered virtual eyewear with immersive 3D
          visualization.
        </motion.p>

        {/* FEATURES */}

        <div className="mt-10 flex flex-col gap-5">
          <div className="bg-white shadow-xl rounded-2xl p-5 w-full md:w-[350px]">
            ✔ Precision 3D Mapping
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-5 w-full md:w-[350px]">
            ✔ AI Face Detection
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-5 w-full md:w-[350px]">
            ✔ Real-Time Lens Refraction
          </div>
        </div>

        <button className="mt-10 px-8 py-5 rounded-2xl bg-black text-white font-semibold shadow-2xl hover:scale-105 duration-300">
          Launch Virtual Try-On
        </button>
      </div>

      {/* RIGHT 3D */}

      <div className="flex-1 h-[700px] w-full">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={2} />
          <directionalLight position={[2, 2, 2]} />

          <Float speed={3} rotationIntensity={2} floatIntensity={2}>
            <GlassesModel />
          </Float>

          <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
        </Canvas>
      </div>
    </section>
  );
}

export default Hero;
