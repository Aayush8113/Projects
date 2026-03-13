import { motion, useScroll, useTransform } from "framer-motion";
import heroImg from "../assets/gallary/hero.jpg";

export default function Hero() {
  const { scrollY } = useScroll();

  const textY = useTransform(scrollY, [0, 500], [0, 160]);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.25]);

  return (
    <section className="relative h-[110vh] overflow-hidden bg-black">
      {/* Background */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
      >
        <span className="mb-6 text-[10px] tracking-[0.6em] font-black uppercase text-amber-500">
          A Symphony of Mediterranean Flavors
        </span>

        <h1 className="text-7xl md:text-[11rem] font-black italic uppercase leading-[0.85]">
          La <span className="text-amber-500">Mansa</span>
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="relative py-6 mt-16 overflow-hidden border rounded-full px-14 border-white/10 group"
        >
          <span className="relative z-10 text-[10px] tracking-[0.4em] font-black uppercase transition-colors group-hover:text-black">
            Discover the Journey
          </span>

          <motion.div
            className="absolute inset-0 bg-amber-500"
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.button>
      </motion.div>

      {/* Accent */}
      <div className="absolute -translate-x-1/2 bottom-20 left-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-amber-500 to-transparent" />
      </div>
    </section>
  );
}
