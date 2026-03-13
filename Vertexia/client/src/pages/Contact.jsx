import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Environment, Float } from '@react-three/drei';
import VertexiaLogo from '../components/VertexiaLogo';
import { Mail, Phone, MessageSquare, AlertCircle, Send, ChevronDown } from 'lucide-react';

const SupportBotModel = () => {
    return (
        <group scale={1} position={[0, -0.1, 0]}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                <VertexiaLogo scale={1.2} />
            </Float>
        </group>
    );
};

const SuccessModel = () => {
    return (
        <group scale={1.5} position={[0, -0.5, 0]}>
            <Float speed={5} rotationIntensity={2} floatIntensity={1}>
                <VertexiaLogo scale={1.5} />
            </Float>
            <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.6, 32]} />
                <meshStandardMaterial color="#22c55e" emissive="#10b981" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
        </group>
    );
};

const Contact = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth || {});
    // Determine if the user is a seller
    const isSeller = user?.role === 'seller';

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        issueType: '',
        referenceId: '', // Order ID for Buyers, Product/Listing ID for Sellers
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            setError('You must be logged in to submit a ticket.');
            return;
        }

        if (!formData.issueType || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/tickets', formData, { withCredentials: true });

            if (data.success) {
                setIsSubmitting(false);
                setIsSubmitted(true);
                setFormData({ ...formData, issueType: '', referenceId: '', message: '' });
                // We don't hide it immediately so they can see the animation
                setTimeout(() => setIsSubmitted(false), 8000);
            }
        } catch (err) {
            setIsSubmitting(false);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    const buyerIssues = [
        "Shipping & Delivery Delay",
        "Received Damaged/Wrong Product",
        "Refund or Return Request",
        "Payment Issue",
        "Account Security",
        "General Inquiry"
    ];

    const sellerIssues = [
        "Product Listing Problem",
        "Payout/Wallet Issue",
        "Dispute with a Buyer",
        "Account Suspension/Warning",
        "Platform Bug Report",
        "Other"
    ];

    const issueOptions = isSeller ? sellerIssues : buyerIssues;

    return (
        <div className="bg-transparent min-h-screen py-20 transition-colors duration-300 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-primary-500/10 to-transparent blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 font-bold text-sm ${isSeller ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'}`}
                    >
                        {isSeller ? <AlertCircle size={16} /> : <MessageSquare size={16} />}
                        <span>{isSeller ? "Seller Partner Support" : "Customer Support"}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
                    >
                        {isSeller ? "Seller Assistance" : "How can we help you?"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 dark:text-gray-400"
                    >
                        {isSeller
                            ? "Experiencing issues with your store or payouts? Our dedicated Merchant Success team is here to resolve your problems quickly."
                            : "Have a question about a product, shipping delays, or a recent order? Let us know the details and we'll sort it out."}
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                    {/* 3D Visualizer & Contact Information Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-5/12 flex flex-col space-y-6"
                    >
                        {/* 3D Support Bot Interface */}
                        <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-6 border border-slate-700 shadow-2xl relative overflow-hidden h-80 flex items-center justify-center cursor-grab active:cursor-grabbing">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                            <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#1d4ed8" castShadow />
                                <PresentationControls speed={1.5} global zoom={1} polar={[-0.1, Math.PI / 4]}>
                                    <SupportBotModel />
                                </PresentationControls>
                                <Environment preset="city" />
                            </Canvas>
                            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
                                <span className="text-white/80 font-bold text-xs uppercase tracking-widest bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">Vertexia AI Support</span>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                            </div>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                                <Mail className="text-primary-500 mb-3" size={24} />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                                <a href="mailto:support@vertexia.com" className="text-xs font-medium text-gray-500 hover:text-primary-500 break-all">support@vertexia.com</a>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                                <Phone className="text-blue-500 mb-3" size={24} />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Call Us</h3>
                                <p className="text-xs font-medium text-gray-500">+1 (555) 000-0000</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:w-7/12 relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-800/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700/50 pointer-events-none" />

                        <div className=" relative p-8 md:p-12 z-10">
                            <div className="flex flex-col items-center text-center space-y-3 mb-10">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isSeller ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-600'} mb-2`}>
                                    <MessageSquare size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Submit a Ticket</h2>
                                {isAuthenticated ? (
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Fill out the form below and we'll get back to you as soon as possible.</p>
                                ) : (
                                    <p className="text-red-500 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30">Please login to access merchant support and ticket tracking.</p>
                                )}
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-bold flex items-center gap-3"
                                    >
                                        <AlertCircle size={20} />
                                        {error}
                                    </motion.div>
                                )}

                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center"
                                    >
                                        <div className="w-full h-64 mb-6">
                                            <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
                                                <ambientLight intensity={0.5} />
                                                <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
                                                <PresentationControls speed={1.5} global zoom={1} polar={[-0.1, Math.PI / 4]}>
                                                    <SuccessModel />
                                                </PresentationControls>
                                                <Environment preset="city" />
                                            </Canvas>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticket Submitted!</h3>
                                            <p className="text-gray-500 dark:text-gray-400 font-bold mb-8 max-w-sm">
                                                Your support request has been logged as
                                                <span className="text-primary-600 dark:text-primary-400 mx-1">#VTX-{Math.floor(Math.random() * 90000) + 10000}</span>.
                                                We'll contact you via email shortly.
                                            </p>
                                            <button
                                                onClick={() => setIsSubmitted(false)}
                                                className="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-xl hover:scale-105 transition-transform"
                                            >
                                                Great, thanks!
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label htmlFor="name" className="block text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-600 transition-colors">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-gray-300 dark:hover:border-slate-600 transition-all dark:text-white placeholder-gray-400 shadow-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-600 transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-gray-300 dark:hover:border-slate-600 transition-all dark:text-white placeholder-gray-400 shadow-sm"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label htmlFor="issueType" className="block text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-600 transition-colors">What is the issue?</label>
                                        <div className="relative">
                                            <select
                                                id="issueType"
                                                required
                                                value={formData.issueType}
                                                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                                className="w-full px-5 py-4 appearance-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-gray-300 dark:hover:border-slate-600 transition-all dark:text-white shadow-sm cursor-pointer"
                                            >
                                                <option value="" disabled>Select a category...</option>
                                                {issueOptions.map((issue, idx) => (
                                                    <option key={idx} value={issue}>{issue}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label htmlFor="referenceId" className="block text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-600 transition-colors">
                                            {isSeller ? "Listing/Product ID (Optional)" : "Order ID (Optional)"}
                                        </label>
                                        <input
                                            type="text"
                                            id="referenceId"
                                            value={formData.referenceId}
                                            onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-gray-300 dark:hover:border-slate-600 transition-all dark:text-white placeholder-gray-400 shadow-sm"
                                            placeholder={isSeller ? "e.g. PRD-8910" : "e.g. ORD-12345"}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="message" className="block text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-600 transition-colors">Detailed Description</label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 hover:border-gray-300 dark:hover:border-slate-600 transition-all dark:text-white placeholder-gray-400 resize-none shadow-sm"
                                        placeholder={isSeller ? "Explain the issue with your listing or account in detail..." : "Please describe what went wrong with your order or product..."}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isAuthenticated}
                                    className={`w-full py-5 bg-gradient-to-r ${isSeller ? 'from-amber-500 to-orange-600 hover:shadow-orange-500/40' : 'from-primary-600 to-indigo-600 hover:shadow-blue-500/40'} text-white font-black text-lg rounded-2xl shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center space-x-3 ${isSubmitting || !isAuthenticated ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isAuthenticated ? 'Submit Support Ticket' : 'Login to Submit Ticket'}</span>
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

