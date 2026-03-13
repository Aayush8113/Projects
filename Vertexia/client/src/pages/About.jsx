import { Target, Users, Zap, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Float, Environment } from '@react-three/drei';
import VertexiaLogo from '../components/VertexiaLogo';


const About = () => {
    return (
        <div className="bg-transparent min-h-screen py-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-20 animate-fade-in-up">
                    <div className="lg:w-1/2 text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full mb-6 font-bold text-sm"
                        >
                            <span>The Peak of E-Commerce</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Vertexia</span>
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            We didn't just build another marketplace. We built a thriving ecosystem where real people connect with authentic brands. At Vertexia, we believe that behind every transaction is a human story, and our platform exists to make those stories extraordinary through uncompromising trust.
                        </p>
                    </div>

                    <div className="lg:w-1/2 w-full h-[300px] sm:h-[400px] relative overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center">
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} style={{ background: 'transparent' }} gl={{ alpha: true }}>
                            <ambientLight intensity={1.5} />
                            <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow />
                            <PresentationControls speed={1.5} global zoom={1} polar={[-0.1, Math.PI / 4]}>
                                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                                    <group scale={1.5}>
                                        <VertexiaLogo scale={1.5} />
                                    </group>
                                </Float>
                            </PresentationControls>
                            <Environment preset="city" />
                        </Canvas>
                    </div>
                </div>

                {/* The Vertexia Difference */}
                <div className="mb-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-indigo-500/5 rounded-[3rem] transform -skew-y-2 pointer-events-none" />
                    <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 p-8 md:p-12 rounded-[3rem] shadow-sm">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Why We Are Different</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Zap className="text-amber-500 mr-3" size={28} />
                                    Next-Gen Technology
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Unlike legacy rivals stuck on outdated tech stacks, Vertexia is built from the ground up prioritizing speed, fluid animations, and real-time AI recommendations. Every click is instant. Every layout reflow is beautiful. It’s an experience you can actually feel.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Users className="text-primary-500 mr-3" size={28} />
                                    Empowering Sellers
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We treat our sellers as true partners, not just data points. With dedicated merchant hubs, clear fee structures, and priority support channels, we aim to build a community where top-tier brands thrive and grow alongside us.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* People to People Trust Section */}
                <div className="mb-24">
                    <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-900 rounded-[3rem] p-10 md:p-16 border border-primary-100 dark:border-slate-800 shadow-sm relative overflow-hidden">

                        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#000000" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.5,-46.4C87.2,-33.6,89.7,-18.2,88.7,-3.3C87.7,11.6,83.1,26.1,75,38C66.9,49.9,55.3,59.3,42.4,66C29.4,72.7,15.1,76.6,1,74.9C-13.1,73.2,-26.2,65.8,-39.6,58.8C-53,51.8,-66.6,45.2,-74.6,33.5C-82.6,21.8,-84.9,5,-81.9,-10.5C-78.9,-26.1,-70.6,-40.4,-59.1,-50.2C-47.6,-60,-32.9,-65.3,-18.8,-68.8C-4.7,-72.3,8.8,-74,23.3,-75.4Z" transform="translate(100 100) scale(1.1)" />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Users size={16} />
                                    <span>People To People</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">Commerce built on human connection.</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                                    In an era of faceless algorithms and automated dropshipping, Vertexia stands for something fundamentally different. We vet every single seller on our platform. We know who they are, where they source their goods, and the passion they bring to their craft.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    When you buy on Vertexia, you aren't just sending money into the void. You are supporting vetted businesses, authentic creators, and verified dealers. We bridge the gap so you can shop with the confidence of buying from a trusted neighbor.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300">
                                    <p className="text-4xl font-black text-primary-600 dark:text-primary-400 mb-2">10k+</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Verified Creators</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300 translate-y-6">
                                    <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">0%</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Fake Reviews</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300 -translate-y-4">
                                    <p className="text-4xl font-black text-emerald-500 dark:text-emerald-400 mb-2">24/7</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Human Support</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300 translate-y-2">
                                    <p className="text-4xl font-black text-amber-500 dark:text-amber-400 mb-2">1M+</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Real Connections</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security and Trust Section (CRITICAL) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-green-500/20 blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-green-500/30">
                            <ShieldCheck className="text-green-400" size={40} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Uncompromising Trust & Security</h2>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-12">
                            We know the internet is full of counterfeits. That's why Vertexia operates on a zero-tolerance policy for fake products and unverified dealers. If it’s on Vertexia, it’s 100% genuine.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <CheckCircle2 className="text-green-400 mb-4" size={28} />
                                <h4 className="font-bold text-xl mb-2">Verified Dealers Only</h4>
                                <p className="text-sm text-slate-300">Every seller undergoes strict background checks and business verification before listing a single item.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <CheckCircle2 className="text-green-400 mb-4" size={28} />
                                <h4 className="font-bold text-xl mb-2">100% Original</h4>
                                <p className="text-sm text-slate-300">We aggressively monitor our catalog. No duplicates, no knock-offs. You get exactly what you pay for.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <CheckCircle2 className="text-green-400 mb-4" size={28} />
                                <h4 className="font-bold text-xl mb-2">Secure Transactions</h4>
                                <p className="text-sm text-slate-300">End-to-end encryption ensures your payment data and personal information remain completely private and safe.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Values */}
                <div>
                    <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Target, title: 'Mission Driven', desc: 'Focused on delivering the absolute best user experience.' },
                            { icon: Award, title: 'Premium Quality', desc: 'Partnering only with the best, offering top-tier products.' },
                            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized at every level for speed and reliability.' },
                            { icon: Users, title: 'Community First', desc: 'Building an honest platform for authentic buyers and sellers.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 text-center group"
                            >
                                <div className="w-16 h-16 mx-auto bg-primary-50 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
