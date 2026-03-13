export default function Gallery() {
  return (
    <section className="bg-[#0f0f0f] py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Gallery</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="/src/assets/gallery/1.jpg" className="rounded-lg" />
          <img src="/src/assets/gallery/2.jpg" className="rounded-lg" />
          <img src="/src/assets/gallery/3.jpg" className="rounded-lg" />
          <img src="/src/assets/gallery/4.jpg" className="rounded-lg" />
        </div>
      </div>
    </section>
  );
}
