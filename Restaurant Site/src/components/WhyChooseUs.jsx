import { motion } from "framer-motion";
import { ShieldCheck, Zap, Heart, UtensilsCrossed } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <UtensilsCrossed size={32} />,
      title: "Master Artisans",
      desc: "Our culinary team consists of Michelin-trained chefs dedicated to the craft."
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Purity First",
      desc: "100% organic, locally sourced ingredients harvested at their peak."
    },
    {
      icon: <Heart size={32} />,
      title: "Soulful Service",
      desc: "An atmosphere designed to make every guest feel like the only guest."
    },
    {
      icon: <Zap size={32} />,
      title: "Zero Delay",
      desc: "Precision timing from kitchen to table to ensure perfect temperature."
    }
  ];

  return (
    <section className="relative px-6 py-24 overflow-hidden bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:border-amber-500/30 transition-all group"
            >
              <div className="mb-6 transition-transform duration-500 text-amber-500 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="mb-4 text-xl italic font-bold tracking-tight uppercase">{item.title}</h3>
              <p className="text-sm font-light leading-relaxed text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}