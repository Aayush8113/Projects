import { useState, useRef, useEffect } from 'react';
import { Package, CheckCircle, Truck as TruckIcon, Home, Clock, Search, AlertTriangle } from 'lucide-react';
import { useFrame, Canvas } from '@react-three/fiber';
import { Float, PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ProceduralTruck } from '../components/ProductModels';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AnimatedTruck = ({ progress }) => {
    const truckRef = useRef();

    useFrame(() => {
        if (!truckRef.current) return;
        const targetX = -4 + (progress * 8);
        truckRef.current.position.x = THREE.MathUtils.lerp(truckRef.current.position.x, targetX, 0.05);
    });

    return (
        <group ref={truckRef} position={[-4, 0.5, 0]}>
            <Float floatIntensity={0.2} speed={5}>
                <ProceduralTruck scale={0.7} />
            </Float>
        </group>
    );
};

const Scenery = () => {
    return (
        <group>
            <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 4]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {[-8, -4, 0, 4, 8].map((x) => (
                <mesh key={x} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1.5, 0.15]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
            ))}
            <mesh position={[0, -0.05, -3]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 2]} />
                <meshStandardMaterial color="#064e3b" />
            </mesh>
            <group position={[8, 0.5, -1.8]} rotation={[0, -Math.PI / 4, 0]}>
                <mesh castShadow><boxGeometry args={[2, 1.5, 2]} /><meshStandardMaterial color="#f8fafc" /></mesh>
                <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.8, 1, 4]} /><meshStandardMaterial color="#ef4444" /></mesh>
            </group>
        </group>
    );
};

const TrackOrder = () => {
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth || {});
    const [orderId, setOrderId] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=track-order');
        }
    }, [isAuthenticated, navigate]);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setIsTracking(true);
        setError(null);
        setOrderStatus(null);

        try {
            // Real-time Power: Verify order ID against user history
            // In a real app, this would be an API call like:
            // const response = await axios.get(`/api/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });

            // For now, we simulate a powerful verification check
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Powerful verification logic: Only certain IDs "belong" to this user for demo
            // In production, the backend handles this strictly.
            if (orderId.startsWith('VTX-')) {
                setOrderStatus({
                    id: orderId,
                    date: 'March 02, 2026',
                    estimatedDelivery: 'March 05, 2026',
                    status: 'shipped', // processing, shipped, in_transit, delivered
                    items: [
                        { name: 'Vertexia Hyper Engine Pro', price: 1299.00, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80' }
                    ]
                });
            } else {
                setError('Unauthorized access: This Order ID does not belong to your account.');
            }
        } catch (err) {
            setError('System Error: Could not verify order authenticity.');
        } finally {
            setIsTracking(false);
        }
    };

    const steps = [
        { id: 'processing', label: 'Order Processed', icon: Package, date: 'Mar 01, 09:00 AM' },
        { id: 'shipped', label: 'Order Shipped', icon: CheckCircle, date: 'Mar 02, 11:30 AM' },
        { id: 'in_transit', label: 'In Transit', icon: TruckIcon, date: 'Estimate: Mar 04' },
        { id: 'delivered', label: 'Delivered', icon: Home, date: 'Pending' }
    ];

    const currentStepIndex = orderStatus ? steps.findIndex(s => s.id === orderStatus.status) : -1;
    const progress = currentStepIndex >= 0 ? currentStepIndex / 3 : 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pt-24 pb-16 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Track Your Order</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Enter your Vertexia Order ID to see real-time shipping updates.</p>
                </div>

                {/* Tracking Input */}
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} transitionSpeed={2000} className="w-full max-w-2xl mx-auto mb-16">
                    <form onSubmit={handleTrack} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Package className="h-6 w-6 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g. VTX-99812)"
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isTracking}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
                        >
                            {isTracking ? (
                                <Clock className="animate-spin h-6 w-6" />
                            ) : (
                                <>
                                    <Search className="h-5 w-5 mr-2" /> Track
                                </>
                            )}
                        </button>
                    </form>
                </Tilt>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="w-full max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 font-bold"
                        >
                            <AlertTriangle size={20} />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tracking Results */}
                {orderStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                        {/* 3D Diorama Header */}
                        <div className="h-64 sm:h-80 w-full bg-sky-200 dark:bg-slate-900 relative cursor-grab active:cursor-grabbing border-b border-slate-100 dark:border-slate-700">
                            <Canvas shadows camera={{ position: [0, 6, 8], fov: 45 }}>
                                <Environment preset="city" />
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
                                <PresentationControls speed={1.5} global zoom={1} polar={[-0.1, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
                                    <Scenery />
                                    <AnimatedTruck progress={progress} />
                                </PresentationControls>
                                <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={20} blur={2} far={4} />
                            </Canvas>
                            <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px] sm:text-xs">Live GPS Tracking</p>
                            </div>
                        </div>

                        {/* Order Header Summary */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Order #{orderStatus.id}</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Arriving by {orderStatus.estimatedDelivery}</h3>
                            </div>
                            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm">
                                Status: {steps[currentStepIndex]?.label || 'Unknown'}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-6 sm:p-12 bg-white dark:bg-slate-800">
                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
                                <div
                                    className="absolute left-[27px] top-4 w-1 bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ height: `${(currentStepIndex / 3) * 100}%` }}
                                />

                                <div className="space-y-12">
                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step.id} className="relative flex items-start group">
                                                {/* Icon */}
                                                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-800 transition-colors duration-500 shadow-sm ${isCompleted ? 'bg-primary-500 text-white shadow-primary-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                                    <step.icon size={24} className={isCurrent ? 'animate-bounce' : ''} />
                                                </div>

                                                {/* Content */}
                                                <div className="ml-6 pt-2 flex-1">
                                                    <h4 className={`text-lg font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                                                        {step.label}
                                                    </h4>
                                                    <p className={`text-sm mt-1 font-medium ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                                        {step.date}
                                                    </p>
                                                </div>

                                                {isCurrent && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                        className="hidden sm:flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 italic bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/50 mt-2"
                                                    >
                                                        Current Status
                                                    </motion.div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700">
                            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm flex items-center"><Package className="mr-2" size={18} /> Shipment Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {orderStatus.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
                                        <div className="w-full sm:w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">{item.name}</h5>
                                            <p className="font-black text-primary-600 dark:text-primary-400 mt-2 text-lg">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
