import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    // Create some random floating elements for the background
    const floatingElements = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        type: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle'
    }));

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors bg-[#FDFDFD] dark:bg-[#020617] font-sans">

            {/* Mind-Fresh Relaxing Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Soft gradient base */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-blue-50/50 dark:from-blue-900/10 dark:to-blue-900/10" />

                {/* Huge slow ambient glows */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -60, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[140px]"
                />

                {/* Gentle floating particles (like dust or fireflies) */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white dark:bg-blue-200 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2
                        }}
                        animate={{
                            y: [0, -100 - Math.random() * 100],
                            x: [0, (Math.random() - 0.5) * 50],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 text-center max-w-2xl px-6 py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 dark:border-slate-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
            >
                {/* Central Relaxing Element (Smooth Orb) */}
                <div className="relative w-40 h-40 mx-auto mb-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: 360
                        }}
                        transition={{
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                        }}
                        className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-indigo-300 dark:from-primary-600 dark:to-indigo-500 rounded-full blur-md opacity-80"
                    />
                    <div className="absolute inset-2 bg-white/90 dark:bg-[#020617]/90 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/50 dark:border-white/10 shadow-inner">
                        <span className="text-5xl font-black bg-gradient-to-br from-primary-500 to-indigo-500 bg-clip-text text-transparent">404</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
                    Take a Deep Breath.
                </h1>

                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed max-w-xl mx-auto">
                    The page you're looking for has drifted away. Stay a moment to relax, or gently guide yourself back home.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/" className="group relative flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg overflow-hidden transition-transform hover:-translate-y-1 w-full sm:w-auto">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Home size={20} className="mr-2 relative z-10 group-hover:text-white transition-colors" />
                        <span className="relative z-10 group-hover:text-white transition-colors">Return Home</span>
                    </Link>
                    <button onClick={() => window.history.back()} className="flex items-center justify-center px-8 py-4 bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all hover:-translate-y-1 w-full sm:w-auto">
                        <ArrowLeft size={20} className="mr-2" />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;

