import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, Plus, Minus, Mail, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';

const faqs = [
    {
        question: "How long does shipping normally take?",
        answer: "Standard shipping typically takes 3-5 business days depending on your region. For Vertexia Prime members, free next-day delivery is available on millions of eligible items.",
        category: "Shipping"
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day, no-questions-asked return policy. Items must be in their original condition and packaging. You can easily initiate a return from our Returns Hub.",
        category: "Returns"
    },
    {
        question: "Are the products on Vertexia authentic?",
        answer: "Absolutely. We have a zero-tolerance policy for counterfeits. Every seller on our platform undergoes strict vetting, ensuring that if it's on Vertexia, it's 100% genuine.",
        category: "Authenticity"
    },
    {
        question: "How do I track my order?",
        answer: "Once shipped, you will receive a tracking number via email. You can also visit our 'Track Order' page in the footer and enter your Order ID for real-time live updates.",
        category: "Tracking"
    },
    {
        question: "Do you offer international shipping?",
        answer: "Currently, we operate within standard continental zones. However, we are rapidly expanding. Check our shipping page for the most up-to-date list of supported countries.",
        category: "Global"
    }
];

const FAQCard = ({ faq, index, isActive, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="perspective-1000 mb-6"
        >
            <motion.div
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: -1 }}
                className={`relative group cursor-pointer rounded-[2rem] border transition-all duration-500 overflow-hidden ${isActive
                    ? "bg-white dark:bg-slate-900 border-primary-500/50 shadow-2xl shadow-primary-500/20"
                    : "bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border-white/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    }`}
                onClick={onClick}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full">
                                {faq.category}
                            </span>
                            <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary-600'}`}>
                                {faq.question}
                            </h3>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            {isActive ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                    </div>

                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                            >
                                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {faq.answer}
                                    </p>
                                    <button className="mt-6 text-sm font-black text-primary-600 flex items-center space-x-1 hover:translate-x-1 transition-transform">
                                        <span>Learn more</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {isActive && (
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Sparkles size={100} className="text-primary-500" />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pt-32 pb-20 transition-colors duration-300 relative overflow-hidden">
            {/* 3D Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-white dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20 shadow-sm"
                    >
                        <HelpCircle size={14} className="text-primary-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Knowledge Base</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter"
                    >
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">help?</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
                    >
                        Quick answers to our most frequent inquiries, designed to get you back to your 3D shopping experience.
                    </motion.p>
                </div>

                {/* FAQ List */}
                <div className="mb-20">
                    {faqs.map((faq, index) => (
                        <FAQCard
                            key={index}
                            faq={faq}
                            index={index}
                            isActive={activeIndex === index}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        />
                    ))}
                </div>

                {/* Support Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-slate-900 dark:bg-slate-900/80 p-10 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Mail className="text-primary-400" size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Email Intelligence</h3>
                            <p className="text-slate-400 mb-8 font-medium">Detailed inquiries processed by our specialized support staff within 2 hours.</p>
                            <Link to="/contact" className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black transition-all hover:bg-slate-200 hover:scale-105 active:scale-95 w-full">
                                Dispatch Message
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-gradient-to-br from-primary-600 to-indigo-700 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <MessageSquare className="text-white" size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Neural Chat</h3>
                            <p className="text-primary-100/80 mb-8 font-medium">Real-time collaboration with Vertexia human experts and advanced AI agents.</p>
                            <button className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black transition-all hover:bg-black hover:scale-105 active:scale-95 w-full">
                                Initialize Link
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default FAQ;

