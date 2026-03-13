import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Users, User, Mail, Phone, 
  ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Utensils 
} from "lucide-react";

export default function ReservationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    date: "", time: "", guests: "2",
    requests: ""
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    { id: 1, title: "Party Size", icon: <Users size={18} /> },
    { id: 2, title: "Date & Time", icon: <Calendar size={18} /> },
    { id: 3, title: "Details", icon: <User size={18} /> },
  ];

  if (isSubmitted) {
    return (
      <section className="flex items-center justify-center min-h-screen px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/[0.03] border border-amber-500/30 p-10 rounded-[3rem] text-center backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <CheckCircle2 className="text-black" size={40} />
          </div>
          <h2 className="mb-4 text-3xl italic font-black tracking-tighter uppercase">Confirmed!</h2>
          <p className="mb-8 font-light text-white/60">We've reserved a table for {formData.guests} on {formData.date}. A confirmation email is on its way to {formData.email}.</p>
          <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em]">Return Home</button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 border rounded-full bg-amber-500/10 border-amber-500/20"
          >
            <Sparkles className="text-amber-500" size={14} />
            <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.3em]">Exquisite Dining</span>
          </motion.div>
          <h1 className="mb-4 text-5xl italic font-black tracking-tighter uppercase md:text-7xl">Table <span className="text-amber-500">Service</span></h1>
          <p className="max-w-lg mx-auto font-light text-white/40">Please provide your details below to secure your gastronomic journey with us.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${step >= s.id ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-white/5 border-white/10 text-white/40"}`}>
                {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
              </div>
              <span className={`text-[10px] uppercase font-black tracking-widest hidden sm:block ${step >= s.id ? "text-white" : "text-white/20"}`}>{s.title}</span>
              {s.id !== 3 && <div className="w-8 h-[1px] bg-white/10 mx-2" />}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2 mb-4">
                    <Users size={14} /> Select Guests
                  </label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {["1", "2", "3", "4", "5", "6", "8", "10", "12", "15+"].map((num) => (
                      <button
                        key={num} type="button"
                        onClick={() => setFormData({...formData, guests: num})}
                        className={`py-4 rounded-2xl font-bold transition-all ${formData.guests === num ? "bg-amber-500 text-black" : "bg-white/5 hover:bg-white/10"}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="grid gap-8 sm:grid-cols-2"
                >
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2"><Calendar size={14} /> Date</label>
                    <input 
                      type="date" required
                      className="w-full p-4 transition-colors border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2"><Clock size={14} /> Time</label>
                    <select 
                      required className="w-full p-4 transition-colors border appearance-none bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    >
                      <option className="bg-[#0a0a0a]">Select Time</option>
                      {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map(t => <option key={t} value={t} className="bg-[#0a0a0a]">{t} PM</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input 
                      type="text" placeholder="Full Name" required
                      className="w-full p-4 transition-colors border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      type="tel" placeholder="Phone Number" required
                      className="w-full p-4 transition-colors border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <input 
                    type="email" placeholder="Email Address" required
                    className="w-full p-4 transition-colors border bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <textarea 
                    placeholder="Special requests (optional)..." rows="3"
                    className="w-full p-4 transition-colors border resize-none bg-white/5 border-white/10 rounded-2xl focus:outline-none focus:border-amber-500"
                    onChange={(e) => setFormData({...formData, requests: e.target.value})}
                  ></textarea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-12 border-t border-white/5">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest">
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}
              
              {step < 3 ? (
                <button 
                  type="button" onClick={nextStep}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-amber-500 transition-all"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="submit"
                  className="bg-amber-500 text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  Confirm Reservation
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}