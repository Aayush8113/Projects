import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: Shield,
            title: "1. Introduction",
            content: "Welcome to Vertexia. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
        },
        {
            icon: Lock,
            title: "2. Data We Collect About You",
            content: "Personal data, or personal information, means any information about an individual from which that person can be identified. We collect identity, contact, financial, and transaction data to provide a seamless AI-driven shopping experience.",
            list: [
                "Identity Data includes first name, last name, and username.",
                "Contact Data includes billing/delivery addresses and email.",
                "Financial Data includes secure payment tokenization.",
                "Transaction Data includes your purchase history and preferences."
            ]
        },
        {
            icon: Eye,
            title: "3. How We Use Your Data",
            content: "We use your data primarily to perform the contract we are about to enter into with you, for our legitimate interests, and to comply with legal obligations."
        },
        {
            icon: FileCheck,
            title: "4. Data Security",
            content: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way. We limit access to only those with a business need to know."
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F8FAFC] dark:bg-[#020617] perspective-1000">
            {/* 3D Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20 shadow-sm transition-all hover:scale-105">
                        <Lock size={14} className="text-primary-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Security First</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-indigo-500">Protocol</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                        At Vertexia, your data is treated with the same precision as our 3D models. Transparent, secure, and always under your control.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                            className="group bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800/50 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                                <section.icon className="text-white" size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{section.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                                {section.content}
                            </p>
                            {section.list && (
                                <ul className="space-y-3">
                                    {section.list.map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            <div className="mt-1.5 mr-3 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-center border border-white/10 shadow-2xl"
                >
                    <Bell className="text-primary-400 mx-auto mb-6" size={40} />
                    <h3 className="text-3xl font-black text-white mb-4">Questions about your rights?</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto font-medium">
                        Our legal team and automated AI agents are ready to assist you with any privacy concerns or data requests.
                    </p>
                    <a
                        href="mailto:privacy@vertexia.ai"
                        className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-600/20"
                    >
                        Contact Privacy Team
                    </a>
                </motion.div>

                <div className="text-center mt-12 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Last Modified: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
