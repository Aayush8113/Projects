import { motion } from "framer-motion";
import { Plus, Star, Leaf } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function DishCard({ dish }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-amber-500/20"
    >
      <div className="relative overflow-hidden h-60">
        <img 
          src={dish.image} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          alt={dish.name} 
        />
        <div className="absolute flex gap-2 top-4 left-4">
          {dish.category === "High-Protein" && (
             <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Power</span>
          )}
          <span className="bg-black/60 backdrop-blur-md p-1.5 rounded-full text-emerald-400"><Leaf size={14}/></span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold tracking-tight">{dish.name}</h3>
          <span className="font-black text-amber-500">${dish.price}</span>
        </div>
        
        <div className="flex items-center gap-1 mb-6 text-xs text-white/40">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span>4.9 (120+ reviews)</span>
        </div>

        <button 
          onClick={() => addItem(dish)}
          className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-amber-500 flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add To Order
        </button>
      </div>
    </motion.div>
  );
}