import { motion } from "framer-motion";
import { ChefHat, Award, Leaf, History, Star } from "lucide-react";
import aboutImg from "../assets/gallary/hero.jpg"; 

export default function About() {
  const stats = [
    { label: "Years of Heritage", value: "25+" },
    { label: "Master Chefs", value: "12" },
    { label: "Michelin Mentions", value: "4" },
    { label: "Happy Guests", value: "50K+" },
  ];

  return (
    <div className="bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Story Section */}
        <div className="grid items-center gap-16 mb-32 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full bg-amber-500/10 border-amber-500/20">
              <History className="text-amber-500" size={14} />
              <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.3em]">Our Legacy</span>
            </div>
            <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-7xl">
              The Soul of <br /><span className="text-amber-500">La Mansa</span>
            </h1>
            <p className="text-lg font-light leading-relaxed text-white/50">
              Founded in 1998, La Mansa began as a small family kitchen in the heart of Rome. 
              Today, it stands as a testament to the timeless art of Italian gastronomy, 
              reimagined for the modern connoisseur.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              {stats.map((stat, i) => (
                <div key={i} className="pl-6 border-l border-amber-500/30">
                  <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src={aboutImg} className="object-cover w-full h-full" alt="Heritage" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-amber-500 text-black p-10 rounded-[2rem] hidden md:block shadow-2xl">
              <Star size={40} className="mb-4" />
              <p className="text-2xl italic font-black tracking-tighter uppercase">Authentic <br />Experience</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}