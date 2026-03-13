import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-20 lg:grid-cols-2">
          
          <div>
            <h1 className="mb-8 text-6xl italic font-black leading-none tracking-tighter uppercase">
              Keep In <br /><span className="text-amber-500">Touch</span>
            </h1>
            <div className="mt-12 space-y-10">
              <ContactInfo icon={<MapPin />} label="The Location" val="21st Avenue, Manhattan, NY" />
              <ContactInfo icon={<Phone />} label="Reservations" val="+1 234 567 890" />
              <ContactInfo icon={<Mail />} label="Concierge" val="hello@lamansa.com" />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
            <h3 className="mb-8 text-2xl italic font-bold tracking-tight uppercase">Direct Inquiry</h3>
            <form className="space-y-6">
              <input type="text" placeholder="Name" className="w-full p-4 transition-all border outline-none bg-black/40 border-white/10 rounded-2xl focus:border-amber-500" />
              <input type="email" placeholder="Email" className="w-full p-4 transition-all border outline-none bg-black/40 border-white/10 rounded-2xl focus:border-amber-500" />
              <textarea placeholder="Your Message" rows="4" className="w-full p-4 transition-all border outline-none resize-none bg-black/40 border-white/10 rounded-2xl focus:border-amber-500" />
              <button className="w-full py-5 text-xs font-black tracking-widest text-black uppercase transition-all bg-amber-500 rounded-2xl hover:bg-amber-400">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, label, val }) {
  return (
    <div className="flex items-start gap-6">
      <div className="text-amber-500">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-black text-white/20 tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold">{val}</p>
      </div>
    </div>
  );
}