import { Link } from "react-router-dom";
import { 
  Instagram, Facebook, Twitter, Mail, 
  MapPin, Phone, UtensilsCrossed, ArrowUpRight,
  Send, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Newsletter / Top Section */}
        <div className="grid items-center gap-12 pb-16 mb-20 border-b lg:grid-cols-2 border-white/5">
          <div>
            <h3 className="mb-4 text-3xl italic font-black tracking-tighter uppercase md:text-4xl">
              Join the <span className="text-amber-500">Inner Circle</span>
            </h3>
            <p className="max-w-md font-light text-white/40">
              Receive exclusive invitations to tasting events and seasonal menu launches.
            </p>
          </div>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-400 text-black px-6 rounded-xl transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
              Join <Send size={14} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 mb-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand & Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <UtensilsCrossed className="transition-transform duration-500 text-amber-500 group-hover:rotate-12" size={32} />
              <span className="text-2xl italic font-black tracking-tighter uppercase">La Mansa</span>
            </Link>
            <p className="text-sm italic font-light leading-relaxed text-white/40">
              "Cooking is not just about recipes; it's about the soul of the ingredients."
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  whileHover={{ y: -5, scale: 1.1 }}
                  href="#" 
                  className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:border-amber-500/40 hover:text-amber-500 transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Luxury Links */}
          <div className="lg:pl-10">
            <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-2">
              <Sparkles size={12} /> Menu
            </h4>
            <ul className="space-y-4">
              {["Signature Bowls", "Classic Pizza", "Handcrafted Pasta", "Vegan Selection"].map((item) => (
                <li key={item}>
                  <Link to="/menu" className="block text-sm font-medium transition-colors duration-300 text-white/40 hover:text-white hover:pl-2">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Reservations</h4>
            <div className="space-y-6">
              <div className="cursor-pointer group">
                <p className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Location</p>
                <p className="text-sm transition-colors text-white/60 group-hover:text-amber-500">21st Avenue, Manhattan, NY</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Phone</p>
                <p className="text-sm transition-colors text-white/60 group-hover:text-amber-500">+1 (234) 567 890</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-[10px] uppercase font-black text-white/20 mb-1 tracking-widest">Email</p>
                <p className="text-sm transition-colors text-white/60 group-hover:text-amber-500">concierge@lamansa.com</p>
              </div>
            </div>
          </div>

          {/* Experience / Hours */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-2">
               Service Hours
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-white/30 font-bold">Lunch</span>
                <span className="text-xs font-black text-amber-500">11:00 — 15:00</span>
              </div>
              <div className="h-[1px] bg-white/5 w-full" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-white/30 font-bold">Dinner</span>
                <span className="text-xs font-black text-amber-500">18:00 — 23:00</span>
              </div>
              <Link 
                to="/reservationForm" 
                className="mt-4 w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
              >
                Book Now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Final Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-8 pt-10 border-t border-white/5 md:flex-row">
          <div className="flex items-center gap-6">
            <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">
              © {currentYear} La Mansa
            </p>
            <div className="hidden gap-6 md:flex">
              <a href="#" className="text-white/20 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/20 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-500/40 transition-all"
          >
            Scroll to Top
            <ArrowUpRight size={14} className="-rotate-45 text-amber-500" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}