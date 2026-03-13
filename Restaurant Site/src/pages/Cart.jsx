import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cartItems, increment, decrement, removeItem, getTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <ShoppingBag size={80} className="mb-6 text-white/5" />
        <h2 className="mb-4 text-4xl italic font-black uppercase">Empty <span className="text-amber-500">Bag</span></h2>
        <Link to="/menu" className="px-8 py-4 text-xs font-black tracking-widest text-black uppercase rounded-full bg-amber-500">Explore Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl min-h-screen px-6 pt-32 pb-20 mx-auto">
      <h1 className="mb-12 text-6xl italic font-black tracking-tighter uppercase">My <span className="text-amber-500">Order</span></h1>
      
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]"
              >
                <img src={item.image} className="object-cover w-24 h-24 rounded-2xl" alt="" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="font-bold text-amber-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-4 p-2 bg-black border rounded-xl border-white/5">
                  <button onClick={() => decrement(item.id)}><Minus size={16}/></button>
                  <span className="w-4 font-bold text-center">{item.quantity}</span>
                  <button onClick={() => increment(item.id)}><Plus size={16}/></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-white/20 hover:text-red-500"><Trash2 size={20}/></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] sticky top-32">
            <h3 className="mb-6 text-xl italic font-black tracking-tight uppercase">Summary</h3>
            <div className="mb-8 space-y-4">
              <div className="flex justify-between text-white/40"><span>Subtotal</span><span>${getTotal()}.00</span></div>
              <div className="flex justify-between text-white/40"><span>Delivery</span><span className="text-emerald-500 uppercase text-[10px] font-bold">Free</span></div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex justify-between text-2xl font-black text-amber-500"><span>Total</span><span>${getTotal()}.00</span></div>
            </div>
            <button className="flex items-center justify-center w-full gap-2 py-5 text-xs font-black tracking-widest text-black uppercase bg-amber-500 rounded-2xl">
              Checkout <ArrowRight size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}