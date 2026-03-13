import chefs from "../data/chef";

export default function Chefs() {
  return (
    <section className="bg-[#0f0f0f] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-8">
          The People Behind La Mansa
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {chefs.map((chef) => (
            <div key={chef.id} className="bg-gray-900 p-4 rounded-xl">
              <img
                src={chef.image}
                className="w-full h-52 object-cover rounded-lg"
                alt={chef.name}
              />
              <h3 className="text-xl font-semibold mt-3">{chef.name}</h3>
              <p className="text-gray-400 text-sm">{chef.role}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
