import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import Cart3DBag from '../components/Cart3DBag';


const Cart = () => {
    const { formatPrice } = useCurrency();
    const dispatch = useDispatch();
    const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors max-w-md w-full"
                >
                    <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 transition-colors">
                        <ShoppingBag size={48} className="text-slate-300 dark:text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Your Cart is Empty</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="inline-flex w-full justify-center items-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-md hover:shadow-lg">
                        Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart <span className="text-slate-400 dark:text-slate-500 font-bold text-2xl">({totalQuantity} items)</span></h1>
                </div>

                {/* 3D bag — only shown when items exist */}
                <div className="mb-8">
                    <Cart3DBag items={items} />
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* ── Item list ── */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Items in your Cart</h2>
                            <button
                                onClick={() => dispatch({ type: 'cart/clearCart' })}
                                className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-800/50 transition-colors flex items-center"
                            >
                                <Trash2 size={14} className="mr-1.5" /> Clear Cart
                            </button>
                        </div>

                        <div className="space-y-3" style={{ perspective: '1200px' }}>
                            {items.map((item, index) => {
                                const accentColors = ['#2563eb', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
                                const accent = accentColors[index % accentColors.length];
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, rotateX: -8 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        whileHover={{ y: -3, rotateX: 2, scale: 1.01 }}
                                        transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                                        key={item.id}
                                        className="relative bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50"
                                        style={{
                                            boxShadow: `0 0 0 0 transparent, 0 4px 16px rgba(0,0,0,0.07)`,
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        {/* Coloured LEFT accent strip */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                                            style={{ background: accent }} />

                                        <div className="flex items-center gap-4 p-4 pl-5">
                                            {/* Glossy image thumbnail with accent glow */}
                                            <div className="flex-shrink-0 relative">
                                                <div
                                                    className="w-[76px] h-[76px] rounded-xl overflow-hidden border-2 bg-slate-50 dark:bg-slate-800"
                                                    style={{ borderColor: `${accent}50`, boxShadow: `0 0 18px ${accent}30, 0 2px 8px rgba(0,0,0,0.12)` }}
                                                >
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-full object-contain p-1.5"
                                                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                        />
                                                    ) : null}
                                                    <div className={`absolute inset-0 ${item.image ? 'hidden' : 'flex'} items-center justify-center`}>
                                                        <Package size={28} className="text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                </div>
                                                {/* Qty badge on image */}
                                                <div
                                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-white dark:border-slate-900"
                                                    style={{ background: accent }}
                                                >
                                                    {item.quantity}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <div className="min-w-0 flex-1">
                                                        {item.category && (
                                                            <span
                                                                className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                                                                style={{ color: accent, background: `${accent}18` }}
                                                            >
                                                                {item.category}
                                                            </span>
                                                        )}
                                                        <Link
                                                            to={`/products/${item.id}`}
                                                            className="block text-sm font-bold text-slate-900 dark:text-white leading-tight mt-1 line-clamp-1 hover:underline"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                                            {formatPrice(item.price)} each
                                                        </p>
                                                    </div>
                                                    {/* Total */}
                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="text-base font-black text-slate-900 dark:text-white" style={{ textShadow: 'none' }}>
                                                            {formatPrice(item.totalPrice)}
                                                        </p>
                                                        <p className="text-[9px] uppercase tracking-widest font-black" style={{ color: accent }}>total</p>
                                                    </div>
                                                </div>

                                                {/* Controls row */}
                                                <div className="flex items-center justify-between">
                                                    {/* Pill stepper with inner shadow */}
                                                    <div
                                                        className="flex items-center h-8 rounded-full px-0.5"
                                                        style={{
                                                            background: `${accent}10`,
                                                            border: `1.5px solid ${accent}30`,
                                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-all hover:scale-110 active:scale-95"
                                                            style={{ color: accent }}
                                                        >−</button>
                                                        <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white select-none">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-all hover:scale-110 active:scale-95"
                                                            style={{ color: accent }}
                                                        >+</button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 size={12} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>

                    {/* ── Order Summary ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="lg:col-span-4 mt-8 lg:mt-0"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 sticky top-24 transition-colors">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Order Summary</h2>

                            <dl className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex justify-between font-medium">
                                    <dt>Subtotal ({totalQuantity} items)</dt>
                                    <dd className="text-slate-900 dark:text-white font-bold">{formatPrice(totalAmount)}</dd>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <dt>Shipping</dt>
                                    <dd className="text-emerald-600 dark:text-emerald-400 font-bold">Free</dd>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <dt>Estimated Tax (8%)</dt>
                                    <dd className="text-slate-900 dark:text-white font-bold">{formatPrice(totalAmount * 0.08)}</dd>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between">
                                    <dt className="text-lg font-black text-slate-900 dark:text-white">Total</dt>
                                    <dd className="text-xl font-black text-slate-900 dark:text-white">{formatPrice(totalAmount * 1.08)}</dd>
                                </div>
                            </dl>

                            <div className="mt-8 space-y-4">
                                <Link to="/checkout" className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all transform active:scale-95">
                                    Proceed to Checkout <ArrowRight size={18} className="ml-2" />
                                </Link>
                                <div className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    🔒 Secure Checkout
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
