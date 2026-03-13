import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShieldCheck, ArrowRight, CheckCircle, Truck, CreditCard, Smartphone, Banknote, Star, Sparkles as SparklesIcon } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, Sparkles as DreiSparkles, Environment, MeshDistortMaterial } from '@react-three/drei';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { useCurrency } from '../context/CurrencyContext';

// ─── 3D Unboxing Scene Components ─────────────────────────────────────────────

// Animated gift box that opens its lid
const GiftBox = ({ isOpen }) => {
    const lidRef = useRef();
    useFrame(() => {
        if (!lidRef.current) return;
        const target = isOpen ? -Math.PI * 0.75 : 0;
        lidRef.current.rotation.x += (target - lidRef.current.rotation.x) * 0.06;
    });
    return (
        <group position={[0, -0.6, 0]}>
            {/* Box body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[2, 1.4, 2]} />
                <meshPhysicalMaterial color="#1e40af" metalness={0.2} roughness={0.3} clearcoat={0.8} />
            </mesh>
            {/* Ribbon X */}
            <mesh position={[0, 0.71, 0]}>
                <boxGeometry args={[2.05, 0.05, 0.2]} />
                <meshStandardMaterial color="#fbbf24" />
            </mesh>
            <mesh position={[0, 0.71, 0]}>
                <boxGeometry args={[0.2, 0.05, 2.05]} />
                <meshStandardMaterial color="#fbbf24" />
            </mesh>
            {/* Ribbon sides X */}
            <mesh position={[0, 0, 1.01]}>
                <boxGeometry args={[2, 1.4, 0.02]} />
                <meshStandardMaterial color="#1d4ed8" metalness={0.3} />
            </mesh>
            <mesh position={[0, 0, -1.01]}>
                <boxGeometry args={[2, 1.4, 0.02]} />
                <meshStandardMaterial color="#1d4ed8" metalness={0.3} />
            </mesh>
            {/* Ribbon vertical stripe */}
            <mesh position={[1.01, 0, 0]}>
                <boxGeometry args={[0.02, 1.4, 2]} />
                <meshStandardMaterial color="#1d4ed8" metalness={0.3} />
            </mesh>
            <mesh position={[-1.01, 0, 0]}>
                <boxGeometry args={[0.02, 1.4, 2]} />
                <meshStandardMaterial color="#1d4ed8" metalness={0.3} />
            </mesh>

            {/* Lid (pivots from back edge) */}
            <group ref={lidRef} position={[0, 0.71, -1]} rotation={[0, 0, 0]}>
                <mesh castShadow position={[0, 0, 1]}>
                    <boxGeometry args={[2.05, 0.12, 2.05]} />
                    <meshPhysicalMaterial color="#2563eb" metalness={0.3} roughness={0.2} clearcoat={1} />
                </mesh>
                {/* Bow on lid */}
                <mesh position={[0, 0.12, 1]}>
                    <torusGeometry args={[0.28, 0.06, 8, 16, Math.PI * 2]} />
                    <meshStandardMaterial color="#fbbf24" />
                </mesh>
                <mesh position={[-0.25, 0.18, 1]} rotation={[0, 0, 0.4]}>
                    <torusGeometry args={[0.18, 0.04, 6, 12, Math.PI]} />
                    <meshStandardMaterial color="#f59e0b" />
                </mesh>
                <mesh position={[0.25, 0.18, 1]} rotation={[0, 0, -0.4]}>
                    <torusGeometry args={[0.18, 0.04, 6, 12, Math.PI]} />
                    <meshStandardMaterial color="#f59e0b" />
                </mesh>
            </group>
        </group>
    );
};

// Single confetti particle
const ConfettiPiece = ({ position, color, shape, speed }) => {
    const ref = useRef();
    const [vel] = useState(() => ({
        x: (Math.random() - 0.5) * speed,
        y: Math.random() * speed * 1.5 + speed,
        z: (Math.random() - 0.5) * speed,
        rx: Math.random() * 4,
        ry: Math.random() * 4,
    }));
    const gravity = -9;
    const t = useRef(0);
    useFrame((_, delta) => {
        if (!ref.current) return;
        t.current += delta;
        ref.current.position.x = position[0] + vel.x * t.current;
        ref.current.position.y = position[1] + vel.y * t.current + 0.5 * gravity * t.current ** 2;
        ref.current.position.z = position[2] + vel.z * t.current;
        ref.current.rotation.x += vel.rx * delta;
        ref.current.rotation.y += vel.ry * delta;
    });
    return (
        <mesh ref={ref} castShadow>
            {shape === 'star' ? <octahedronGeometry args={[0.12, 0]} /> : <boxGeometry args={[0.1, 0.18, 0.02]} />}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
    );
};

const CONFETTI_COLORS = ['#f43f5e', '#facc15', '#34d399', '#60a5fa', '#c084fc', '#fb923c', '#f9a8d4'];
const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 0.4, 0.9, (Math.random() - 0.5) * 0.4],
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: i % 3 === 0 ? 'star' : 'box',
    speed: 2.5 + Math.random() * 2,
}));

// Glowing pulsing ring on floor
const GlowRing = () => {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (ref.current) {
            const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.08;
            ref.current.scale.set(s, 1, s);
        }
    });
    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]}>
            <ringGeometry args={[1.5, 2.4, 64]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
    );
};

// Scene orchestrator
const UnboxingScene = ({ phase }) => {
    const isOpen = phase >= 2;
    const showConfetti = phase >= 3;
    return (
        <>
            <PresentationControls
                global
                speed={1.2}
                zoom={0.85}
                polar={[-Math.PI / 6, Math.PI / 6]}
                azimuth={[-Math.PI, Math.PI]}
            >
                <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0}>
                    <GiftBox isOpen={isOpen} />
                </Float>
                {showConfetti && CONFETTI.map(c => (
                    <ConfettiPiece key={c.id} {...c} />
                ))}
            </PresentationControls>
            <GlowRing />
            <DreiSparkles count={60} scale={6} size={2} speed={0.4} color="#93c5fd" />
            <Environment preset="city" />
        </>
    );
};

const FeedbackSlider = () => {
    const [rating, setRating] = useState(4);
    const emojis = ['😡', '🙁', '😐', '🙂', '🤩'];
    return (
        <div className="mt-8 pt-6 border-t border-slate-700/50 max-w-sm mx-auto">
            <h4 className="font-bold text-white/70 mb-5 text-xs uppercase tracking-widest text-center">Rate your experience</h4>
            <div className="flex justify-between items-center text-3xl mb-4 px-2">
                {[0, 1, 2, 3, 4].map(idx => (
                    <motion.button
                        key={idx}
                        animate={{
                            scale: rating === idx ? 1.5 : 1,
                            opacity: rating === idx ? 1 : 0.35,
                            y: rating === idx ? -8 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={() => setRating(idx)}
                        className="focus:outline-none"
                    >
                        {emojis[idx]}
                    </motion.button>
                ))}
            </div>
            <input
                type="range" min="0" max="4" value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-400 bg-white/10"
            />
        </div>
    );
};

const VirtualUnboxing = ({ onComplete, cartItems = [] }) => {
    const [phase, setPhase] = useState(0); // 0=idle 1=shaking 2=opening 3=confetti 4=done
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 500);   // shake
        const t2 = setTimeout(() => setPhase(2), 1500);  // open lid
        const t3 = setTimeout(() => setPhase(3), 2400);  // confetti
        const t4 = setTimeout(() => { setPhase(4); setIsReady(true); }, 4000); // done
        return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }, []);

    const PHASE_LABELS = [
        'Getting your order ready…',
        'Something is shaking inside…',
        'Opening the box…',
        '🎉 Surprise! Order confirmed!',
        '✅ You\'re all set!',
    ];

    return (
        <div className="flex flex-col items-center w-full">
            {/* 3D Canvas Viewport */}
            <div className="w-full max-w-lg h-72 sm:h-96 rounded-3xl overflow-hidden relative cursor-grab active:cursor-grabbing"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, #1e3a5f 0%, #0f172a 70%)' }}
            >
                <Canvas camera={{ position: [0, 1.5, 5.5], fov: 45 }} shadows>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
                    <pointLight position={[0, 3, 0]} intensity={3} color="#60a5fa" />
                    <pointLight position={[-3, 1, 3]} intensity={1} color="#c084fc" />
                    {/* Shake effect on box before opening */}
                    <motion.group>
                        <UnboxingScene phase={phase} />
                    </motion.group>
                </Canvas>

                {/* Corner labels */}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white/80 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-white/10">
                    ↕ Drag to Spin
                </div>
                {phase >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg"
                    >
                        ✓ Order Confirmed!
                    </motion.div>
                )}
            </div>

            {/* Phase label */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={phase}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 text-center text-slate-400 dark:text-slate-300 font-bold text-sm tracking-wide"
                >
                    {PHASE_LABELS[phase]}
                </motion.p>
            </AnimatePresence>

            {/* Ordered items strip */}
            {cartItems.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 max-w-lg w-full px-1">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                            <div className="w-12 h-12 rounded-xl bg-slate-700 overflow-hidden border border-slate-600">
                                {item.image
                                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    : <Package size={20} className="m-auto mt-3 text-slate-400" />}
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold text-center max-w-[48px] truncate">{item.title}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Post-animation content */}
            <AnimatePresence>
                {isReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm"
                    >
                        <FeedbackSlider />
                        <motion.button
                            onClick={onComplete}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-sm uppercase tracking-wider"
                        >
                            View Order Details <ArrowRight size={18} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// ──────────────────────────────────────────────────────────────────────────────


const Checkout = () => {
    const { formatPrice, isIndian } = useCurrency();
    const { items, totalAmount } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Unboxing
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [pinCode, setPinCode] = useState('');
    const [shippingFee, setShippingFee] = useState(0);
    const [pinError, setPinError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const FREE_SHIPPING_THRESHOLD = 500; // e.g., $500

    useEffect(() => {
        if (isIndian) {
            setPaymentMethod('upi');
        } else {
            setPaymentMethod('card');
        }
    }, [isIndian]);

    useEffect(() => {
        // Calculate dynamically when amount changes
        if (totalAmount >= FREE_SHIPPING_THRESHOLD) {
            setShippingFee(0);
        } else if (pinCode.length >= 6) {
            // Mock Distance Calculation from Ahmedabad (Pin Prefix 380)
            if (pinCode.startsWith('38')) {
                setShippingFee(5); // Local Gujarat
            } else if (['40', '11', '60', '70'].some(p => pinCode.startsWith(p))) {
                setShippingFee(15); // Metro Cities
            } else {
                setShippingFee(25); // Rest of India / International
            }
        } else {
            setShippingFee(0); // Before pin is entered
        }
    }, [pinCode, totalAmount]);

    const handlePinChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            setPinCode(val);
            setPinError('');
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (pinCode.length < 6) {
                setPinError('Please enter a valid 6-digit PIN code.');
                return;
            }
            setStep(2);
        }
        else if (step === 2) setStep(3); // Start unboxing
    };

    const handleUnboxingComplete = () => {
        // Snapshot the order BEFORE clearing the cart
        dispatch(placeOrder({
            items: items.map(item => ({ ...item })),
            totalAmount,
            shippingFee,
            paymentMethod,
        }));
        dispatch(clearCart());
        navigate('/order-tracking');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-300">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <ShieldCheck size={64} className="mx-auto text-primary-500 mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Account Verification Required</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">For security and accurate shipping, please log in or create an account to proceed with checkout.</p>
                    <Link to="/login?redirect=/checkout" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
                        Login to Checkout
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0 && step !== 3) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-300">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Your cart is empty</h2>
                    <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
                        Return to Shop
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Stepper Progress */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
                        <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10"
                            initial={{ width: '0%' }}
                            animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                            transition={{ duration: 0.5 }}
                        />

                        {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Payment' }, { num: 3, label: 'Unboxing' }].map((s) => (
                            <div key={s.num} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors duration-500 ${step >= s.num ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                                </div>
                                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

                    {/* Main Form Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleNextStep} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 space-y-6">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                                        <Truck className="mr-3 text-primary-600 dark:text-primary-400" /> Shipping Details
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label><input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label><input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" /></div>
                                        <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label><input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label><input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" /></div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Postal/PIN Code</label>
                                            <input required type="text" value={pinCode} onChange={handlePinChange} maxLength={6} placeholder="e.g. 380001" className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 ${pinError ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`} />
                                            {pinError && <p className="text-red-500 text-xs mt-1">{pinError}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full mt-6 flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 shadow-md">
                                        Continue to Payment <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleNextStep} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                                        <ShieldCheck className="mr-3 text-green-600 dark:text-green-500" /> Secure Payment
                                    </h2>
                                    <div className="space-y-4">
                                        {/* Card */}
                                        <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-600 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                            <input type="radio" className="hidden" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                            <CreditCard size={28} className={paymentMethod === 'card' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'} />
                                            <div className="ml-4 flex-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white">Credit / Debit Card</h3>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-600 dark:border-primary-500' : 'border-slate-300'}`}>
                                                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                                            </div>
                                        </label>

                                        {paymentMethod === 'card' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 py-4">
                                                <input required type="text" placeholder="Card Number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" />
                                                    <input required type="text" placeholder="CVC" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* UPI */}
                                        <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                            <input type="radio" className="hidden" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                                            <Smartphone size={28} className={paymentMethod === 'upi' ? 'text-blue-500' : 'text-slate-400'} />
                                            <div className="ml-4 flex-1"><h3 className="font-bold text-slate-900 dark:text-white">UPI / Quick Pay</h3></div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-blue-500' : 'border-slate-300'}`}>
                                                {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                            </div>
                                        </label>
                                        {paymentMethod === 'upi' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="py-2">
                                                <input required type="text" placeholder="user@upi" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl" />
                                            </motion.div>
                                        )}

                                        {/* EMI */}
                                        <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'emi' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                            <input type="radio" className="hidden" name="payment" value="emi" checked={paymentMethod === 'emi'} onChange={() => setPaymentMethod('emi')} />
                                            <CreditCard size={28} className={paymentMethod === 'emi' ? 'text-orange-500' : 'text-slate-400'} />
                                            <div className="ml-4 flex-1"><h3 className="font-bold text-slate-900 dark:text-white">Easy EMI Options</h3></div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'emi' ? 'border-orange-500' : 'border-slate-300'}`}>
                                                {paymentMethod === 'emi' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                            </div>
                                        </label>

                                        {paymentMethod === 'emi' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="py-2 space-y-4 px-2">
                                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 flex items-start">
                                                    <SparklesIcon className="text-orange-500 mr-2 mt-0.5" size={16} />
                                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                        0% EMI available on selected credit cards. Direct EMI through Vertexia incurs a minimal 2% processing fee based on bank regulations.
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Bank</label>
                                                    <select required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 cursor-pointer">
                                                        <option value="">Choose your bank...</option>
                                                        <option value="hdfc">HDFC Bank (0% EMI Available)</option>
                                                        <option value="sbi">SBI Credit Card</option>
                                                        <option value="icici">ICICI Bank</option>
                                                        <option value="axis">Axis Bank</option>
                                                        <option value="vertexia">Direct Vertexia EMI (2% Fee)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">EMI Tenure</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {[{ t: '3 Months', i: '0% p.a.' }, { t: '6 Months', i: '0% p.a.' }, { t: '9 Months', i: '15% p.a.' }, { t: '12 Months', i: '15% p.a.' }].map((plan, idx) => (
                                                            <label key={idx} className="border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-center hover:border-orange-500 cursor-pointer transition-all bg-white dark:bg-slate-800 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-orange-900/20 flex flex-col justify-center">
                                                                <input type="radio" name="emiTenure" className="hidden" required />
                                                                <div className="font-bold text-slate-900 dark:text-white mb-1">{plan.t}</div>
                                                                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">@ {plan.i}</div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* COD */}
                                        <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                            <input type="radio" className="hidden" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                            <Banknote size={28} className={paymentMethod === 'cod' ? 'text-green-600' : 'text-slate-400'} />
                                            <div className="ml-4 flex-1"><h3 className="font-bold text-slate-900 dark:text-white">Cash on Delivery</h3></div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-green-600' : 'border-slate-300'}`}>
                                                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">Back</button>
                                        <button type="submit" className="flex-1 flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md transition-all active:scale-95">
                                            Confirm & Unbox <Package size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-12 text-center">
                                    <VirtualUnboxing onComplete={handleUnboxingComplete} cartItems={items} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar (Hidden on Step 3) */}
                    {step !== 3 && (
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 sticky top-24 transition-colors">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Order Summary</h2>
                                <ul className="mb-6 space-y-4 divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {items.map((item) => (
                                        <li key={item.id} className="pt-4 first:pt-0 flex items-center">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-600 mr-3">
                                                <img src={item.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-slate-900 dark:text-white ml-3">{formatPrice(item.totalPrice)}</div>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="space-y-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-6">
                                    <div className="flex justify-between font-medium"><dt>Subtotal</dt><dd className="text-slate-900 dark:text-white font-bold">{formatPrice(totalAmount)}</dd></div>
                                    <div className="flex justify-between font-medium">
                                        <dt className="flex items-center">Shipping {totalAmount >= FREE_SHIPPING_THRESHOLD && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>}</dt>
                                        <dd className={`${shippingFee === 0 ? 'text-green-600 dark:text-green-500' : 'text-slate-900 dark:text-white'} font-bold`}>
                                            {shippingFee === 0 ? 'Free' : `${formatPrice(shippingFee)}`}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between font-medium"><dt>Tax</dt><dd className="text-slate-900 dark:text-white font-bold">{formatPrice(totalAmount * 0.08)}</dd></div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between">
                                        <dt className="text-lg font-black text-slate-900 dark:text-white">Total</dt>
                                        <dd className="text-xl font-black text-slate-900 dark:text-white">{formatPrice((totalAmount * 1.08) + shippingFee)}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;

