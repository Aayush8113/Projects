import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const categoryData = [
    { id: 1, name: 'Electronics & Gadgets', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 124, route: '/products?category=Electronics%20%26%20Gadgets' },
    { id: 2, name: 'Fashion & Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 86, route: '/products?category=Fashion%20%26%20Apparel' },
    { id: 3, name: 'Home, Kitchen, & Furniture', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 42, route: '/products?category=Home%2C%20Kitchen%2C%20%26%20Furniture' },
    { id: 4, name: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 35, route: '/products?category=Beauty%20%26%20Personal%20Care' },
    { id: 5, name: 'Sports, Fitness & Outdoors', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 210, route: '/products?category=Sports%2C%20Fitness%20%26%20Outdoors' },
    { id: 6, name: 'Toys, Kids & Baby', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: 56, route: '/products?category=Toys%2C%20Kids%20%26%20Baby' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Categories = () => {
    return (
        <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen py-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full mb-6 font-bold text-sm"
                    >
                        <Sparkles size={16} />
                        <span>Discover New Worlds</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
                    >
                        Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">Categories</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 dark:text-gray-400 font-medium"
                    >
                        Explore our wide range of products categorized just for you. Find exactly what you are looking for.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {categoryData.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2500}>
                                <Link to={category.route} state={{ selectedCategory: category.name }} className="block group">
                                    <div className="bg-slate-900 rounded-[2rem] shadow-sm overflow-hidden h-80 flex flex-col items-center justify-center text-center relative border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors">

                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110 ease-out z-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                                        {/* Glowing Box Shadow on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_30px_rgba(79,70,229,0.5)] transition-opacity duration-500 pointer-events-none z-20"></div>

                                        <div className="relative z-30 p-8 flex flex-col items-center justify-end h-full w-full">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                                <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">{category.name}</h3>
                                                <p className="text-sm font-medium text-slate-300 mb-4">{category.count} Products</p>
                                                <div className="inline-flex items-center text-blue-400 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                                    Explore <Sparkles size={16} className="ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Tilt>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default Categories;

