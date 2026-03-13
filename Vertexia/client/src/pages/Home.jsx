import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSEO from '../hooks/useSEO';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, Star } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import True3DModel from '../components/True3DModel';

const heroContent = [
    { text: "Products Daily", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Sneakers", bought: "Nike Air Max" },
    { text: "Premium Tech", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Laptops", bought: "ProBook M2" },
    { text: "Trending Styles", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Fashion", bought: "Elegant Top" },
    { text: "Luxury Beauty", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Cosmetics", bought: "Glow Serum" }
];

const TypewriterText = ({ text }) => {
    return (
        <motion.span
            key={text}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                }
            }}
            initial="hidden"
            animate="visible"
            className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600"
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// We will fetch these dynamically now.

const Home = () => {
    useSEO({ title: 'Home', description: 'Experience the future of online shopping with Vertexia 3D E-Commerce.' });
    const { formatPrice } = useCurrency();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % heroContent.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await axios.get('http://localhost:5000/api/categories');
                const catData = catRes.data.data?.categories || catRes.data?.categories || catRes.data;
                const topCats = (Array.isArray(catData) ? catData : []).slice(0, 4).map(c => ({
                    id: c._id,
                    name: c.name,
                    image: c.image || 'https://via.placeholder.com/400'
                }));
                // Fallback to static if no categories returned
                setCategories(topCats.length > 0 ? topCats : [
                    { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                    { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                    { id: 3, name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                    { id: 4, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
                ]);

                // Fetch popular products
                const prodRes = await axios.get('http://localhost:5000/api/products?limit=4');
                const prodData = prodRes.data.data?.products || prodRes.data?.products || prodRes.data;
                const formattedProds = (Array.isArray(prodData) ? prodData : []).slice(0, 4).map((p, index) => ({
                    id: p._id,
                    name: p.title,
                    price: p.price,
                    rating: p.ratings?.average || 4.5,
                    reviews: p.ratings?.count || Math.floor(Math.random() * 200),
                    image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/400',
                    tag: index === 0 ? 'New' : index === 1 ? 'Bestseller' : index === 3 ? 'Trending' : null
                }));
                setFeaturedProducts(formattedProds);
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] transition-colors duration-300 relative">
            {/* Global E-Commerce Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2z' fill='%236366f1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
            }} />
            {/* Global Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-br from-indigo-600/8 to-transparent blur-[130px]" />
                <div className="absolute top-[40%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-tl from-cyan-500/8 to-transparent blur-[120px]" />
            </div>
            {/* Hero Section */}
            <section className="relative bg-transparent overflow-visible overflow-x-clip">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center lg:pt-32 lg:pb-36 lg:text-left">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth linear-like ease
                            className="max-w-2xl relative z-30 pointer-events-auto"
                        >
                            <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-slate-400 dark:text-slate-300 shadow-sm backdrop-blur-md text-sm font-semibold tracking-wide mb-8 uppercase">
                                <Sparkles size={14} className="mr-2 text-blue-400 animate-pulse" />
                                Redefining E-Commerce
                            </div>
                            <h1 className="text-5xl tracking-tighter font-extrabold text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl pb-4 drop-shadow-sm min-h-[140px] md:min-h-[180px]">
                                <span className="block mb-2 font-black">Experience the</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 pb-2 h-[1.2em]">
                                    <TypewriterText text={["Extraordinary.", "Future.", "Impossible.", "Beautiful."][heroIndex % 4]} />
                                </span>
                            </h1>
                            <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 font-medium sm:text-xl sm:max-w-xl sm:mx-auto lg:mx-0 md:mt-8 md:text-2xl leading-relaxed tracking-tight">
                                Interact directly with our premium collection in breathtaking 3D space before you buy. Seamless. Beautiful. Intelligent.
                            </p>
                            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full">
                                    <Link
                                        to="/products"
                                        className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-full text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-2xl transition-all md:text-lg"
                                    >
                                        Explore Collection
                                        <ArrowRight className="ml-2" size={20} />
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 sm:mt-0 sm:ml-4 rounded-full">
                                    <Link
                                        to="/categories"
                                        className="w-full flex items-center justify-center px-10 py-4 border border-slate-200 dark:border-slate-800 text-base font-bold rounded-full text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all md:text-lg"
                                    >
                                        Browse Categories
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Hero 3D Interactive Gallery */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="relative mx-auto w-[120%] -left-[10%] max-w-none mt-12 lg:mt-0 lg:h-[800px] lg:-my-24 z-20 pointer-events-auto"
                        >

                            {/* Passing the actual store products to the 3D gallery Component! */}
                            <True3DModel products={featuredProducts} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-transparent transition-colors duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
                        >
                            Shop by Category
                        </motion.h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Explore our carefully curated categories to find exactly what you're looking for.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                                className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-950 border border-slate-800/50 hover:border-blue-500/50 transition-colors shadow-2xl"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                                {/* Glowing Box Shadow on Hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_30px_rgba(79,70,229,0.5)] transition-opacity duration-500 pointer-events-none"></div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center text-blue-400 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            Enter Lobby <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-24 bg-slate-50/50 dark:bg-transparent relative overflow-hidden">
                {/* Background Decors */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-full blur-3xl opacity-50 z-0"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 rounded-full blur-3xl opacity-50 z-0"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold uppercase tracking-wider text-sm flex justify-center items-center">
                            <Sparkles size={16} className="mr-2" /> Top Picks For You
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-2">Trending Now</h2>
                        <div className="mt-4 mx-auto w-20 h-1.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product, index) => (
                            <Tilt key={product.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000} className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-3 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-300 ease-out flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                    className="flex flex-col h-full w-full cursor-pointer" style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div className="w-full relative bg-transparent rounded-2xl aspect-w-4 aspect-h-3" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
                                        {product.tag && (
                                            <span className="absolute top-3 left-3 z-20 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg" style={{ transform: 'translateZ(40px)' }}>
                                                {product.tag}
                                            </span>
                                        )}

                                        <div className="w-full h-64 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-center object-cover mix-blend-multiply transition-transform duration-700 ease-in-out drop-shadow-2xl"
                                                style={{
                                                    transform: 'translateZ(10px)',
                                                    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                }}
                                            />
                                            {/* Invisible overlay for the popping effect class */}
                                            <div className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-opacity duration-700 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                                                <img
                                                    src={product.image}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-center object-cover mix-blend-multiply drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
                                                    style={{
                                                        transform: 'scale(1.2) translateY(-10%) translateZ(80px)',
                                                        transition: 'transform 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Hover Add to Cart Button */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-xl translate-y-4 group-hover:translate-y-0 z-30" style={{ transform: 'translateZ(50px)' }}>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(addToCart({
                                                    id: product.id,
                                                    title: product.name,
                                                    price: product.price,
                                                    image: product.image,
                                                    category: 'Featured',
                                                    quantity: 1
                                                }));
                                            }} className="w-full bg-white/95 backdrop-blur-md text-gray-900 px-4 py-3 rounded-xl font-bold hover:bg-primary-600 hover:text-white flex items-center justify-center transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                                <ShoppingBag size={18} className="mr-2" /> Quick Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-5 pb-2 px-2 flex-grow flex flex-col justify-between" style={{ transform: 'translateZ(30px)' }}>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center text-xs">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star size={14} className="fill-current" />
                                                    <span className="ml-1 text-gray-800 dark:text-white font-bold">{product.rating}</span>
                                                </div>
                                                <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                                                <span className="text-gray-500 dark:text-gray-400 font-medium">{product.reviews} reviews</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{formatPrice(product.price)}</p>
                                            <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-slate-600 group-hover:text-primary-600 dark:group-hover:text-white transition-colors z-20 relative border border-transparent group-hover:border-primary-500 transition-all">
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </Tilt>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/products" className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-[2rem] text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden border border-slate-800 dark:border-white">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                            <span className="relative z-10 flex items-center group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
                                View All Products <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Smart Guarantee Section */}
            <section className="py-24 relative overflow-hidden bg-white/50 dark:bg-transparent transition-colors duration-300 border-t border-slate-100 dark:border-slate-800/50">
                <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full max-h-[400px] bg-gradient-to-r from-primary-400/10 to-blue-500/10 dark:from-primary-900/10 dark:to-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ y: -10 }} className="p-8 sm:p-10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-xl dark:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-900/20 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-[1.5rem] shadow-inner flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 border border-white dark:border-slate-700 relative z-10">
                                <ShoppingBag className="text-primary-600 dark:text-primary-400" size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">AI Smart Delivery</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">Predictive shipping routes ensure your premium order arrives faster than ever.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} whileHover={{ y: -10 }} className="p-8 sm:p-10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-xl dark:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-[1.5rem] shadow-inner flex items-center justify-center mb-8 group-hover:-rotate-12 transition-transform duration-500 border border-white dark:border-slate-700 relative z-10">
                                <Star className="text-blue-600 dark:text-blue-400" size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">Verified AI Reviews</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">Our system summarizes thousands of authentic reviews instantly for smart buying.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }} whileHover={{ y: -10 }} className="p-8 sm:p-10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-xl dark:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-[1.5rem] shadow-inner flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 border border-white dark:border-slate-700 relative z-10">
                                <ArrowRight className="text-emerald-600 dark:text-emerald-400" size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">Hassle-Free Returns</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">Experience a seamless 30-day money back guarantee processed with one click.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
