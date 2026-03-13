import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Scale, ShieldAlert, Gavel } from 'lucide-react';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const terms = [
        {
            icon: Scale,
            title: "1. Acceptance of Terms",
            content: "By accessing or using the Vertexia website, services, or participating in our AI-driven shopping ecosystem, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access the platform."
        },
        {
            icon: Gavel,
            title: "2. Use of License",
            content: "Permission is granted to temporarily download materials for personal, non-commercial transitory viewing. This is a license, not a transfer of title, and comes with specific restrictions on duplication, modification, and reverse engineering."
        },
        {
            icon: AlertCircle,
            title: "3. Disclaimer",
            content: "The materials on Vertexia's website are provided 'as is'. We make no warranties, expressed or implied, regarding AI-generated insights or accuracy. AI results are for informational purposes only.",
            important: true
        },
        {
            icon: ShieldAlert,
            title: "4. Limitations",
            content: "In no event shall Vertexia or its suppliers be liable for any damages (including loss of data or profit) arising out of the use or inability to use the materials on our platform."
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F8FAFC] dark:bg-[#020617] perspective-1000">
            {/* 3D Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20 shadow-sm transition-all hover:scale-105">
                        <FileText size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Legal Framework</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500">Service</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                        Clear, fair, and future-forward. These terms govern your interaction with the Vertexia ecosystem.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {terms.map((term, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5, rotateX: -2, rotateY: 2 }}
                            className={`group p-8 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 shadow-2xl ${term.important
                                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-blue-200/20"
                                    : "bg-white/80 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/50 shadow-slate-200/50 dark:shadow-none"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 ${term.important ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20" : "bg-slate-100 dark:bg-slate-800"
                                }`}>
                                <term.icon className={term.important ? "text-white" : "text-blue-600 dark:text-blue-400"} size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{term.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {term.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Sections */}
                <div className="mt-12 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20"
                    >
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">5. Governing Law</h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location. Vertexia reserves the right to modify these terms at any time via AI-notified updates.
                        </p>
                    </motion.div>
                </div>

                <div className="text-center mt-12 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Last Verified: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
