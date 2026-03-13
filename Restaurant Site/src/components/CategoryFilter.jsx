export default function CategoryFilter({ categories, selected, setSelected }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
            selected === cat
              ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "border-white/10 text-white/40 hover:border-white/30 hover:text-white bg-white/5"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}