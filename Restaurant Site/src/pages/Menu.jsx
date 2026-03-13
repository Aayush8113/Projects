import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Utensils } from "lucide-react";
import CategoryFilter from "../components/CategoryFilter";
import DishCard from "../components/DishCard";
import dishes from "../data/dishes";

export default function Menu() {
  const [selected, setSelected] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["All", "Burger", "Pasta", "Pizza", "Bowls", "High-Protein", "Snacks", "Desserts", "Drinks"];

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesCategory = selected === "All" || dish.category === selected;
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selected, searchTerm]);

  return (
    <div className="min-h-screen px-6 pt-32 pb-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl italic font-black tracking-tighter uppercase md:text-7xl"
          >
            The <span className="text-amber-500">Menu</span>
          </motion.h1>
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-white/30 group-focus-within:text-amber-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for flavors..."
              className="w-full py-4 pl-12 pr-4 text-sm transition-all border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <CategoryFilter categories={categories} selected={selected} setSelected={setSelected} />

        <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </AnimatePresence>
        </div>

        {filteredDishes.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Utensils size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold">No dishes found for your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}