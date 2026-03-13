import { motion } from "framer-motion";
import { Utensils, Wine, Music, PartyPopper, Camera, Users } from "lucide-react";

export default function Service() {
  const experiences = [
    { icon: <Utensils />, title: "Fine Dining", desc: "A curated 7-course journey through Mediterranean flavors." },
    { icon: <Wine />, title: "Private Cellar", desc: "Exclusive wine tasting sessions with our master sommelier." },
    { icon: <PartyPopper />, title: "Grand Events", desc: "Bespoke catering and ambiance for your most precious moments." },
    { icon: <Music />, title: "Live Jazz", desc: "Evening performances by world-class musicians every weekend." },
  ];

  return (
    <div className="bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="mx-auto mb-20 text-center max-w-7xl">
        <h1 className="mb-6 text-6xl italic font-black tracking-tighter uppercase md:text-8xl">
          Beyond <span className="text-amber-500">Dining</span>
        </h1>
        <p className="max-w-2xl mx-auto font-light text-white/40">We offer more than just a meal; we provide a full-sensory immersion into luxury hospitality.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {experiences.map((exp, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white/[0.03] border border-white/5 p-10 rounded-[2.5rem] text-center group hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-all bg-amber-500/10 text-amber-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-black">
              {exp.icon}
            </div>
            <h3 className="mb-4 text-xl font-bold tracking-tight uppercase">{exp.title}</h3>
            <p className="text-sm font-light leading-relaxed text-white/40">{exp.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}