import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  { id: 2, name: "Rahul Sharma", message: "Amazing quality! The food was fresh and delivered hot. Loved it!" },
  { id: 3, name: "Priya Desai", message: "Service was super fast and packaging was perfect. Highly recommended!" },
  { id: 4, name: "Amit Verma", message: "Great taste and excellent portion size. Will order again!" },
  { id: 5, name: "Sneha Patel", message: "Loved the flavour! Customer support was also very helpful." },
  { id: 7, name: "Rohan Gupta", message: "My favourite place to order from. Consistent quality every time." },
  { id: 8, name: "Neha Kothari", message: "Food presentation was beautiful and taste was even better." },
  { id: 9, name: "Karan Singh", message: "Affordable pricing with restaurant-quality taste. Highly impressed!" },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-16 bg-gray-100">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        What Our Customers Say
      </h2>

      <div className="max-w-3xl mx-auto">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[index].id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg p-8 rounded-2xl text-center"
          >
            <p className="text-xl text-gray-700 leading-relaxed italic mb-4">
              “{testimonials[index].message}”
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              — {testimonials[index].name}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === i ? "bg-red-600 w-7" : "bg-gray-400 w-3"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
