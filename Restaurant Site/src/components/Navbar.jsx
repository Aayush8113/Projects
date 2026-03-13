import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Menu", path: "/menu" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-xl py-3 shadow-2xl" : "bg-transparent py-6"}`}>
      <div className="flex items-center justify-between px-6 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center gap-2 group">
          <UtensilsCrossed className="transition-transform duration-300 text-amber-500 group-hover:rotate-12" size={28} />
          <span className="text-2xl italic font-black tracking-tighter uppercase">La Mansa</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="items-center hidden gap-8 md:flex">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors ${location.pathname === link.path ? "text-amber-500" : "text-white/70"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <Link to="/cart" className="relative p-2 transition-colors hover:text-amber-500">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/reservationForm" className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95">
            Book Table
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="p-2 text-white md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute left-0 flex flex-col w-full gap-6 p-8 border-t top-full bg-black/95 backdrop-blur-2xl border-white/5 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMobileMenu(false)} className="pb-4 text-xl font-bold border-b border-white/5">
              {link.name}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMobileMenu(false)} className="flex justify-between text-xl font-bold">
            Cart <span>({cartCount})</span>
          </Link>
          <Link to="/reservationForm" onClick={() => setMobileMenu(false)} className="py-4 font-black text-center text-black uppercase bg-amber-500 rounded-xl">
            Book a Table
          </Link>
        </div>
      )}
    </nav>
  );
}