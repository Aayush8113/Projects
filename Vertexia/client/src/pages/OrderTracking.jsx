import { useFrame, Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { Float, PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Route, PackageCheck, Truck, Package, FileText } from 'lucide-react';

const DeliveryBoxModel = () => {
    const boxRef = useRef();

    useFrame((state) => {
        if (!boxRef.current) return;
        boxRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        boxRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    });

    return (
        <group scale={1.2}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh ref={boxRef} castShadow>
                    <boxGeometry args={[1.5, 1.2, 1.5]} />
                    {/* Corrugated cardboard color */}
                    <meshStandardMaterial color="#d4b58e" roughness={0.9} />

                    {/* Tape across the top */}
                    <mesh position={[0, 0.61, 0]}>
                        <planeGeometry args={[1.5, 0.3]} />
                        <meshBasicMaterial color="#e5e5e5" opacity={0.6} transparent />
                    </mesh>

                    {/* Vertexia Logo "V" on the side */}
                    <mesh position={[0, 0, 0.76]}>
                        <planeGeometry args={[0.5, 0.5]} />
                        <meshBasicMaterial color="#1d4ed8" />
                    </mesh>
                </mesh>
            </Float>
        </group>
    );
};

const OrderTracking = () => {
    return (
        <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-[85vh] py-12 flex items-center justify-center transition-colors duration-300">
            <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 p-8 sm:p-12 text-center relative z-10 transition-colors">

                    {/* Background sparkles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50 z-0 transition-colors"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1 text-left">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-inner transition-colors">
                                <CheckCircle size={32} strokeWidth={2.5} />
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Order Placed Successfully!</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Thank you for shopping with Vertexia. Your order #VRTX-893021 will be delivered soon.</p>

                            {/* Tracking Timeline */}
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 p-6 mb-10 text-left transition-colors">
                                <h2 className="font-black text-slate-900 dark:text-white mb-6 flex items-center"><Route className="mr-2 text-primary-600 dark:text-primary-400" /> Tracking Status</h2>

                                <div className="relative border-l-2 border-primary-200 dark:border-primary-900/50 ml-4 space-y-8 py-2">
                                    <div className="relative pl-8">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center transition-colors"></div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Order Confirmed</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Today, 10:45 AM</p>
                                    </div>

                                    <div className="relative pl-8 opacity-50">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center transition-colors"></div>
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center"><PackageCheck size={16} className="mr-1.5" /> Getting Ready for Dispatch</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending</p>
                                    </div>

                                    <div className="relative pl-8 opacity-50">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center transition-colors"></div>
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center"><Truck size={16} className="mr-1.5" /> Out for Delivery</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                <Link to="/products" className="px-8 py-4 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm">
                                    Continue Shopping
                                </Link>
                                <Link to="/profile" className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-black dark:hover:bg-white transition flex items-center justify-center shadow-lg hover:shadow-xl">
                                    <FileText size={18} className="mr-2" /> View Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Interactive 3D Model Pane */}
                        <div className="order-1 md:order-2 h-64 md:h-full min-h-[300px] w-full bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing relative overflow-hidden shadow-inner flex items-center justify-center">
                            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none" />
                            <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={1} castShadow />
                                <PresentationControls speed={1.5} global zoom={0.8} polar={[-0.2, Math.PI / 4]}>
                                    <Environment preset="city" />
                                    <DeliveryBoxModel />
                                    <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={5} blur={2.5} far={4} color="#000000" />
                                </PresentationControls>
                            </Canvas>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50 uppercase tracking-widest">Interactive Package</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderTracking;

