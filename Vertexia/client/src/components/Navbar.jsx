import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import VertexiaLogo from './VertexiaLogo';
import { Search, Tag, Moon, Sun, User, ShoppingCart, Sparkles, LayoutDashboard, Truck, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

const HUDModule = ({ children, className = "", title = "" }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 300 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

    return (
        <motion.div
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
                mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
            }}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`hud-panel island-shadow rounded-2xl p-2 transition-all duration-500 hover:scale-[1.02] border-cyan-500/20 dark:border-white/10 ${className}`}
        >
            <div className="hud-scan-line opacity-30 group-hover:opacity-100 transition-opacity" />

            {/* HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40 rounded-br-lg" />

            <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex items-center justify-center">
                {children}
            </div>
            {title && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase tracking-[0.4em] text-slate-900/40 dark:text-cyan-400/50 pointer-events-none whitespace-nowrap">
                    {title}
                </div>
            )}
        </motion.div>
    );
};

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { user } = useSelector((state) => state.auth || {});
    const { totalQuantity } = useSelector((state) => state.cart || { totalQuantity: 0 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartJiggle, setCartJiggle] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        if (totalQuantity > 0) {
            setCartJiggle(true);
            const timer = setTimeout(() => setCartJiggle(false), 400);
            return () => clearTimeout(timer);
        }
    }, [totalQuantity]);

    const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');

    const navItems = [
        { name: 'SHOP', path: '/products', icon: <Search size={14} />, id: '01' },
        { name: 'CATEGORIES', path: '/categories', icon: <Tag size={14} />, id: '02' },
        { name: 'OUR STORY', path: '/about', icon: <Activity size={14} />, id: '03' },
    ];

    const logisticsItems = [
        { name: 'TRACK ORDER', path: '/track-order', icon: <Truck size={14} /> },
        { name: 'RETURNS', path: '/returns', icon: <Zap size={14} /> },
    ];

    return (
        <>
            {/* Neural Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-cyan-500 z-[100] origin-left shadow-[0_0_15px_#0ff]"
                style={{ scaleX }}
            />

            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[90] pointer-events-none">
                <div className="flex items-center justify-between gap-4 pointer-events-auto h-16">

                    {/* Module 01: Identity Core */}
                    <HUDModule title="Identity.Core" className="flex items-center gap-4 px-6 h-full">
                        <Link to="/" className="flex items-center space-x-3 group outline-none">
                            <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                                <Canvas camera={{ position: [0, 0, 4] }} style={{ pointerEvents: 'none', background: 'transparent' }} gl={{ alpha: true }}>
                                    <ambientLight intensity={1.5} />
                                    <directionalLight position={[5, 5, 5]} intensity={2} />
                                    <VertexiaLogo scale={3} />
                                </Canvas>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase leading-none glitch-hover transition-colors">Vertexia</span>
                                <span className="text-[7px] font-bold text-cyan-600 dark:text-cyan-400/70 tracking-[0.3em] mt-1">SYS.CONNECTED</span>
                            </div>
                        </Link>
                    </HUDModule>

                    {/* Module 02: Neural Grid (Links) */}
                    <HUDModule title="Neural.Grid" className="hidden lg:flex items-center flex-1 justify-center gap-1 px-4 h-full">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`relative px-6 py-2 group overflow-hidden transition-all flex flex-col items-center ${location.pathname === item.path ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <span className="text-[7px] font-black opacity-30 mb-0.5 tracking-tighter self-start">{item.id}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                                {location.pathname === item.path && (
                                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-cyan-500 shadow-[0_0_10px_#0ff]" />
                                )}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-4" />

                        {/* Logistics Dropdown Module */}
                        <div className="relative group/logistics">
                            <button className="flex flex-col items-center px-6 text-slate-900 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
                                <span className="text-[7px] font-black opacity-30 mb-0.5 tracking-tighter self-start">04</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">ORDERS</span>
                            </button>
                            <div className="absolute top-[calc(100%+15px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/logistics:opacity-100 transition-all duration-300 pointer-events-none group-hover/logistics:pointer-events-auto translate-y-2 group-hover/logistics:translate-y-0">
                                <HUDModule className="min-w-[160px] hud-solid p-2 border-cyan-500/30">
                                    <div className="flex flex-col gap-1">
                                        {logisticsItems.map((item) => (
                                            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-2 hover:bg-cyan-500/10 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg transition-all text-[10px] font-black uppercase tracking-wider">
                                                {item.icon} {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </HUDModule>
                            </div>
                        </div>
                    </HUDModule>

                    {/* Module 03: Uplink (Actions) */}
                    <HUDModule title="Uplink.v1" className="flex items-center gap-2 px-6 h-full">
                        {/* AI Omni-Search */}
                        <div className="relative flex items-center group/search">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 220, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="mr-2"
                                    >
                                        <input
                                            autoFocus
                                            placeholder="CRYPTONEURAL SEARCH..."
                                            className="w-full bg-slate-100/50 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-500/30 rounded-lg px-4 py-2 text-[10px] font-black text-slate-900 dark:text-cyan-400 placeholder-slate-400 dark:placeholder-cyan-900 outline-none focus:border-cyan-500 transition-all shadow-inner"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400'}`}>
                                <Search size={18} />
                            </button>
                        </div>

                        <button onClick={toggleTheme} className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

                        <Link to={user ? "/profile" : "/login"} className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                            <User size={18} />
                        </Link>

                        <Link to="/cart" className="relative p-2.5 group/cart text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                            <motion.div animate={cartJiggle ? { y: [0, -3, 0], x: [0, 2, -2, 0] } : {}}>
                                <ShoppingCart size={18} />
                            </motion.div>
                            {totalQuantity > 0 && (
                                <span className="absolute -top-0 -right-0 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-cyan-600 dark:text-cyan-400 ml-1">
                            <Activity size={20} className={isMobileMenuOpen ? 'animate-pulse' : ''} />
                        </button>
                    </HUDModule>
                </div>
            </nav>

            {/* Matrix Mobile Overaly */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[110] bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col justify-center items-center"
                    >
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(0,255,255,0.4)_1px,transparent_0)] bg-[size:40px_40px]" />
                        <div className="flex flex-col space-y-12 items-center relative z-10 w-full px-8">
                            <VertexiaLogo scale={8} className="mb-8 opacity-50" />
                            {[...navItems, { name: 'LOGISTICS', path: '/track-order', id: '04' }].map((item, i) => (
                                <motion.div key={item.name} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-5xl font-black text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-all tracking-tighter uppercase glitch-hover flex items-center gap-4"
                                    >
                                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-500/40 tracking-normal pt-4">{item.id}</span>
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <button onClick={() => setIsMobileMenuOpen(false)} className="mt-12 text-cyan-600 dark:text-cyan-500 text-xs font-black tracking-[0.5em] hover:text-slate-900 dark:hover:text-white transition-colors">
                                [ CLOSE_UPLINK ]
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
