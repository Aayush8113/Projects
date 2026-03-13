import { Facebook, Twitter, Instagram, Youtube, ChevronRight, MapPin, PhoneCall, Mail, Sparkles } from 'lucide-react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

const ThreeDLogoBackground = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    });

    return (
        <group ref={groupRef} position={[4, 0, -2]} scale={3}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Luxury abstract diamond shape */}
                <group>
                    <mesh castShadow>
                        <octahedronGeometry args={[1, 0]} />
                        <MeshTransmissionMaterial
                            backside
                            thickness={1.5}
                            roughness={0.05}
                            transmission={0.95}
                            ior={1.5}
                            color="#1d4ed8"
                            clearcoat={1}
                            chromaticAberration={0.2}
                        />
                    </mesh>
                    <mesh>
                        <octahedronGeometry args={[0.9, 0]} />
                        <meshStandardMaterial wireframe color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[1.4, 0.01, 16, 64]} />
                        <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

const Footer = () => {
    return (
        <footer className="bg-[#020617] border-t border-blue-500/30 shadow-[0_-10px_40px_rgba(79,70,229,0.15)] text-gray-400 relative overflow-hidden">
            {/* High-tech Grid Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] pointer-events-none z-0"></div>

            {/* Background glowing orbs & 3D WebGL Canvas */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <ThreeDLogoBackground />
                </Canvas>
            </div>

            <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-0"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand & Intro (Takes up more space) */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-block group">
                            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-400 via-blue-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] block transition-all duration-500 hover:bg-right group-hover:scale-105">
                                Vertexia
                            </h2>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                            Experience the future of e-commerce. Discover premium products with seamless delivery, predictive AI search, and top-notch customer support.
                        </p>

                        <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-blue-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)] rounded-lg px-4 py-2 backdrop-blur-md mt-2 transition-all hover:border-blue-400 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                            <Sparkles size={16} className="text-blue-400 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Powered by Vertexia Engine</span>
                        </div>

                        <div className="flex space-x-4 pt-6">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-12 h-12 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 hover:-translate-y-1.5 text-slate-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_10px_20px_rgba(79,70,229,0.4)] relative group/social">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl opacity-0 group-hover/social:opacity-100 blur transition-opacity"></div>
                                    <Icon size={20} className="relative z-10" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Shop</h3>
                        <ul className="space-y-4 text-sm">
                            {['All Products', 'Trending Now', 'New Arrivals', 'Categories'].map((link) => (
                                <li key={link}>
                                    <Link to="/products" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                        <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-primary-500 transition-all duration-300" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Customer Service */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/faq" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-primary-500 transition-all duration-300" />
                                    FAQ & Help
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-primary-500 transition-all duration-300" />
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/track-order" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-primary-500 transition-all duration-300" />
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-primary-500 transition-all duration-300" />
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Info & Newsletter */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Contact Info</h3>
                        <ul className="space-y-4 text-sm mb-8">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-primary-500 mr-3 mt-0.5" />
                                <span className="text-gray-400">123 Innovation Drive, Tech District, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <PhoneCall size={18} className="text-primary-500 mr-3" />
                                <span className="text-gray-400">+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center group cursor-pointer hover:-translate-y-0.5 transition-transform duration-300">
                                <Mail size={18} className="text-primary-500 mr-3 group-hover:text-primary-400 transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">support@vertexia.ai</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Newsletter & Bottom */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="border-t border-white/10 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex-1 max-w-md w-full">
                        <form className="relative flex items-center w-full">
                            <input
                                type="email"
                                placeholder="Subscribe to our newsletter"
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-32 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/10 text-white placeholder-gray-500 transition-all"
                            />
                            <button type="button" className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] border border-blue-400 text-sm uppercase tracking-wider">
                                Join Beta
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Vertexia AI E-Commerce. All rights reserved.</p>
                        <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex space-x-4">
                            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
