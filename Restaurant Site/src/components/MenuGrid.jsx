import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import DishCard from "./DishCard";
import dishes from "../data/dishes";

export default function MenuGrid({ limit }) {
  // Show only featured dishes or a specific limit for the homepage
  const displayedDishes = limit ? dishes.slice(0, limit) : dishes;

  return (
    <section className="py-24 px-6 bg-[#050505]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 mb-16 md:flex-row">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full bg-amber-500/10 border-amber-500/20">
              <Sparkles className="text-amber-500" size={14} />
              <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.3em]">Chef's Selection</span>
            </div>
            <h2 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-7xl">
              Signature <span className="text-amber-500">Tastes</span>
            </h2>
          </div>
          
          {limit && (
            <Link to="/menu" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-amber-500 transition-all">
              View Full Menu <ArrowRight className="transition-transform group-hover:translate-x-2" size={16} />
            </Link>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  );
}