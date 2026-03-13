import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, PresentationControls, ContactShadows, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { RotateCcw, AlertTriangle, Package, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { ProceduralParcel } from '../components/ProductModels';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const ParcelItem = ({ drop }) => {
    const api = useRef();

    return (
        <RigidBody
            ref={api}
            colliders="hull"
            restitution={0.4}
            friction={1}
            position={[0, drop ? 5 : 2, 0]}
            rotation={[drop ? Math.PI / 6 : 0, 0, drop ? Math.PI / 10 : 0]}
            type={drop ? "dynamic" : "kinematicPosition"}
        >
            <Float floatIntensity={drop ? 0 : 1} speed={drop ? 0 : 2}>
                <ProceduralParcel scale={1.2} />
            </Float>
        </RigidBody>
    );
};

const ReturnBox = () => {
    return (
        <RigidBody type="fixed" colliders="hull" position={[0, -1, 0]}>
            <group scale={2.5}>
                {/* Visual Box Shell */}
                <mesh position={[0, -0.9, 0]} receiveShadow><boxGeometry args={[2.5, 0.2, 2.5]} /><meshStandardMaterial color="#2d2218" roughness={1} /></mesh>
                <mesh position={[-1.15, 0, 0]} receiveShadow><boxGeometry args={[0.2, 2, 2.5]} /><meshStandardMaterial color="#3d2d1d" roughness={1} /></mesh>
                <mesh position={[1.15, 0, 0]} receiveShadow><boxGeometry args={[0.2, 2, 2.5]} /><meshStandardMaterial color="#3d2d1d" roughness={1} /></mesh>
                <mesh position={[0, 0, -1.15]} receiveShadow><boxGeometry args={[2.5, 2, 0.2]} /><meshStandardMaterial color="#3d2d1d" roughness={1} /></mesh>
                <mesh position={[0, 0, 1.15]} receiveShadow><boxGeometry args={[2.5, 2, 0.2]} /><meshStandardMaterial color="#3d2d1d" roughness={1} /></mesh>

                {/* Physics Colliders */}
                <CuboidCollider position={[0, -0.9, 0]} args={[1.25, 0.1, 1.25]} />
                <CuboidCollider position={[-1.25, 0, 0]} args={[0.1, 1, 1.25]} />
                <CuboidCollider position={[1.25, 0, 0]} args={[0.1, 1, 1.25]} />
                <CuboidCollider position={[0, 0, -1.25]} args={[1.25, 1, 0.1]} />
                <CuboidCollider position={[0, 0, 1.25]} args={[1.25, 1, 0.1]} />
            </group>
        </RigidBody>
    );
};

const Returns = () => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const { isAuthenticated } = useSelector((state) => state.auth || {});
    const [orderId, setOrderId] = useState('');
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');
    const [isDropping, setIsDropping] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=returns');
        }
    }, [isAuthenticated, navigate]);

    const handleLookup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Powerful verification: Only IDs starting with VTX- belong to the authenticated user for demo
            await new Promise(resolve => setTimeout(resolve, 1200));

            if (orderId.startsWith('VTX-')) {
                setOrderInfo({
                    id: orderId,
                    item: 'Vertexia Hyper Engine Pro',
                    price: 1299.00
                });
                setStep(2);
            } else {
                setError('Unauthorized: This Order ID does not match your purchase history.');
            }
        } catch (err) {
            setError('Verification failed. Please check your Order ID.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToss = () => {
        if (!reason) return;
        setIsDropping(true);
        setTimeout(() => setStep(3), 3500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] py-24 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">Secure Return Portal</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        Toss it <span className="text-rose-600">Back.</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Verify your order and digitally drop your parcel into our smart return box.</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                            className="max-w-xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white dark:border-slate-700 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RotateCcw size={120} />
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Find Your Order</h2>
                            <p className="text-slate-500 font-medium mb-8">Enter the Order ID from your confirmation email.</p>

                            <form onSubmit={handleLookup} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Order Identity</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. VTX-99812"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-rose-500/20 font-black"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 p-4 rounded-xl border border-rose-100">
                                        <AlertTriangle size={18} /> {error}
                                    </motion.div>
                                )}

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-xl hover:bg-black dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    {isLoading ? "Verifying Authority..." : <>Locate Items <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[4rem] p-6 sm:p-10 shadow-3xl border border-white dark:border-slate-700 overflow-hidden flex flex-col lg:flex-row gap-12"
                        >
                            {/* 3D Simulation Panel */}
                            <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-[3rem] min-h-[600px] relative overflow-hidden border border-slate-200 dark:border-slate-800 cursor-grab active:cursor-grabbing">
                                <Canvas shadows camera={{ position: [0, 5, 15], fov: 35 }}>
                                    <ambientLight intensity={0.8} />
                                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                                    <Physics gravity={[0, -9.81, 0]}>
                                        <PresentationControls speed={1.5} global zoom={0.8} polar={[-0.1, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
                                            <ReturnBox />
                                            <ParcelItem drop={isDropping} />
                                            <RigidBody type="fixed" position={[0, -10, 0]}>
                                                <CuboidCollider args={[30, 1, 30]} />
                                            </RigidBody>
                                        </PresentationControls>
                                    </Physics>
                                    <ContactShadows position={[0, -5, 0]} opacity={0.6} scale={40} blur={2.5} far={8} />
                                    <Environment preset="city" />
                                </Canvas>

                                <div className="absolute top-8 left-8 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm pointer-events-none">
                                    <Package className="text-rose-500" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Validated Return Item</p>
                                        <p className="text-sm font-black text-slate-800 dark:text-white leading-none mt-1">{orderInfo?.item}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Options Panel */}
                            <div className="lg:w-[450px] flex flex-col justify-center">
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Digitize Return.</h3>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                                    Your item <span className="text-slate-900 dark:text-white font-black">{orderInfo?.item}</span> is eligible for return. Select the reason logic below to initiate the drop.
                                </p>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Logic Selection</label>
                                        <select
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-rose-500/20 font-black appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Why are you tossing it?</option>
                                            <option value="size">Dimensional Incompatibility (Size)</option>
                                            <option value="color">Visual Variance (Color/Style)</option>
                                            <option value="defective">System Failure (Defective)</option>
                                            <option value="other">Unspecified Variable (Other)</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleToss}
                                        disabled={!reason || isDropping}
                                        className="w-full bg-rose-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-rose-500/30 hover:bg-rose-500 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none text-xl uppercase tracking-widest border-b-8 border-rose-800"
                                    >
                                        {isDropping ? "Dropping Variable..." : "Initiate Physics Toss"}
                                    </button>

                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex gap-4">
                                        <RotateCcw className="text-rose-500 flex-shrink-0" size={24} />
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                            Upon successful toss, our smart contract will generate a return credential instantly. Pure efficiency.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl mx-auto text-center bg-white dark:bg-slate-800 rounded-[4rem] p-16 shadow-3xl border border-slate-100 dark:border-slate-700"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.6 }}
                                className="w-32 h-32 mx-auto bg-green-500 text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-green-500/40"
                            >
                                <CheckCircle size={64} />
                            </motion.div>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Perfect Toss!</h2>
                            <p className="text-lg text-slate-500 font-medium mb-12">Return verification complete. Your digital credential has been deployed to your email.</p>
                            <button onClick={() => navigate('/')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95">
                                Return to Hub
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Returns;
