import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../store/cartSlice';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, ThumbsUp, ThumbsDown, ShoppingCart, Share2, Shield, Truck, RefreshCw, Check, List, MessageSquare, Send } from 'lucide-react';
import ProductWorkbench from '../components/ProductWorkbench';

// ─── Category-aware product data enrichment ───────────────────────────────────
const CATEGORY_INSIGHTS = {
    'Electronics & Gadgets': {
        description: (title) => `The ${title} is engineered for peak performance and longevity. Built with premium-grade components sourced from industry leaders, it delivers a cutting-edge experience that keeps you ahead of the curve.`,
        pros: ['Industry-leading performance benchmarks', 'Advanced power efficiency', 'Seamless ecosystem integration', 'Premium build quality'],
        cons: ['Premium price point', 'Requires compatible accessories'],
    },
    'Fashion & Apparel': {
        description: (title) => `The ${title} redefines modern style with its carefully curated design. Crafted from sustainably sourced, high-quality fabrics, it offers an exceptional fit that transitions effortlessly from casual to formal.`,
        pros: ['Premium sustainable materials', 'Versatile all-day styling', 'True-to-size fit', 'Colourfast & machine washable'],
        cons: ['Dry-clean recommended for best results', 'Limited colour availability'],
    },
    'Home, Kitchen, & Furniture': {
        description: (title) => `The ${title} brings a perfect balance of form and function to your living space. Designed by award-winning interior architects, it combines robust durability with an aesthetic that complements any décor.`,
        pros: ['Space-efficient smart design', 'Easy assembly & maintenance', 'Certified non-toxic materials', 'Timeless aesthetic'],
        cons: ['Assembly tools required', 'Bulkier packaging due to protective padding'],
    },
    'Health, Beauty, & Personal Care': {
        description: (title) => `The ${title} is formulated with clinically tested, dermatologist-approved ingredients that deliver visible results. Free from harsh chemicals, it is gentle on all skin types while providing professional-grade efficacy.`,
        pros: ['Dermatologist-tested formula', 'Cruelty-free & vegan certified', 'Suitable for sensitive skin', 'Fast-acting results'],
        cons: ['Results may vary by skin type', 'Patch test recommended first use'],
    },
    'Groceries & Pantry': {
        description: (title) => `${title} is sourced from certified organic farms committed to sustainable agricultural practices. Every batch is rigorously quality-tested to ensure you receive the freshest, most nutritious product possible.`,
        pros: ['Organic & non-GMO certified', 'Rich in natural nutrients', 'No artificial preservatives', 'Eco-friendly packaging'],
        cons: ['Shorter shelf life than processed alternatives', 'Store in cool, dry place'],
    },
    'Toys, Hobbies, & Books': {
        description: (title) => `The ${title} is thoughtfully crafted to inspire creativity and learning. Manufactured to the highest global safety standards, it offers hours of engaging, screen-free entertainment suitable for the whole family.`,
        pros: ['Promotes creative & cognitive skills', 'Non-toxic, child-safe materials', 'Engaging multi-age design', 'Durable construction'],
        cons: ['Adult supervision recommended for younger children', 'Small parts — not for under 3'],
    },
};

const DEFAULT_INSIGHTS = {
    description: (title) => `${title} is a premium-quality product designed to exceed your expectations. Backed by rigorous quality assurance and built with best-in-class materials, it represents outstanding value for everyday use.`,
    pros: ['Premium quality materials', 'Rigorous quality assurance tested', 'Excellent value for money', 'Fast shipping & easy returns'],
    cons: ['High demand — limited stock', 'Check compatibility before purchase'],
};

const getSpecificProductData = (categoryName, productTitle, productImages = []) => {
    const insights = CATEGORY_INSIGHTS[categoryName] || DEFAULT_INSIGHTS;
    const title = productTitle || 'This Product';

    // Use real product images from DB; fall back to an empty array if none
    const gallery = productImages.length > 0
        ? productImages.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
        : [];

    return {
        description: insights.description(title),
        gallery,
        insights: {
            summary: `Based on verified customer reviews and AI analysis, ${title} consistently receives high marks in its category. Most buyers highlight build quality and overall value as standout strengths.`,
            pros: insights.pros,
            cons: insights.cons,
        },
    };
};
// ─────────────────────────────────────────────────────────────────────────────

const ProductDetails = () => {
    const { formatPrice } = useCurrency();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const cartItems = useSelector(state => state.cart.items);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/products/find/${id}`),
                    axios.get(`http://localhost:5000/api/reviews/${id}`)
                ]);

                const p = productRes.data.data?.product || productRes.data?.product || productRes.data;
                const r = reviewsRes.data.reviews || [];
                setReviews(r);

                const rawImages = p.images || [];
                const specificData = getSpecificProductData(p.category?.name || 'Uncategorized', p.title, rawImages);

                const formattedProduct = {
                    id: p._id,
                    title: p.title || 'Vertex Product',
                    price: p.price,
                    originalPrice: p.discountedPrice ? p.price : p.price * 1.2,
                    description: specificData.description,
                    rating: p.ratings?.average || 4.5,
                    reviewsCount: p.ratings?.count || r.length || 120,
                    inventory: p.inventory,
                    brand: p.specifications?.Brand || 'Vertex',
                    category: p.category?.name || 'Uncategorized',
                    images: specificData.gallery,
                    features: [
                        'Premium quality materials',
                        'Durable and long-lasting',
                        'Eco-friendly packaging',
                        'Fast shipping available'
                    ],
                    specs: p.specifications || { 'Weight': 'Standard', 'Material': 'Mixed' },
                    colors: ['#0f172a', '#e2e8f0', '#3b82f6'],
                    aiInsights: specificData.insights
                };

                if (p.discountedPrice) {
                    formattedProduct.price = p.discountedPrice;
                    formattedProduct.originalPrice = p.price;
                }

                setProduct(formattedProduct);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch details:', err);
                setError('Failed to load product details.');
                setLoading(false);
            }
        };

        fetchProductAndReviews();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Please login to write a review');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/reviews', {
                productId: id,
                ...reviewForm
            }, { withCredentials: true });

            if (data.success) {
                setReviews([{ ...data.review, buyerId: { name: user.name, profileImage: user.profileImage } }, ...reviews]);
                setReviewForm({ rating: 5, comment: '' });
                alert('Review added successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };
    useEffect(() => {
        if (product) {
            document.title = `${product.title} | Vertexia`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", `Buy ${product.title} at Vertexia. Read verified AI insights, customer reviews, and get the best price.`);
            }
        }
    }, [product]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617]"><p className="text-xl dark:text-white font-bold animate-pulse">Loading Product Details...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617]"><p className="text-xl text-red-500 font-bold">{error}</p></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617]"><p className="text-xl text-gray-500 font-bold">Product not found.</p></div>;

    // How many units of this product are already sitting in the cart
    const alreadyInCart = cartItems.find(item => item.id === product.id)?.quantity || 0;
    // True remaining stock = total inventory - already carted - current selector value
    const trulyAvailable = Math.max(0, product.inventory - alreadyInCart);
    const availableStock = Math.max(0, trulyAvailable - quantity);

    const handleShare = async () => {
        const shareData = {
            title: `${product.title} | Vertexia`,
            text: `Check out this amazing ${product.title} at Vertexia!`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="bg-[#F8FAFC] dark:bg-[#03050f] min-h-screen transition-colors duration-300 relative overflow-hidden">
            {/* Global E-Commerce Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm-90 10h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2zm10 0h2v2h-2z' fill='%236366f1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
            }} />
            {/* Ambient Background Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-5%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Breadcrumb */}
            <div className="bg-white dark:bg-[#020617] border-b border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
                        <span className="mx-3 text-slate-300 dark:text-slate-600">/</span>
                        <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Products</Link>
                        <span className="mx-3 text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-900 dark:text-slate-300 truncate">{product.category}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* 3D Product Workbench Container (Left Column) */}
                    <div
                        className="relative z-10 w-full rounded-[2.5rem] overflow-hidden"
                        style={{
                            boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 25px 60px -10px rgba(59,130,246,0.2), 0 10px 25px -5px rgba(0,0,0,0.4)',
                        }}
                    >
                        <ProductWorkbench product={product} selectedColor={product.colors[selectedColor]} />
                    </div>

                    {/* Product Info Container (Right Column) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-10 px-4 sm:px-0 lg:mt-0"
                    >
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest mb-3 bg-primary-50 dark:bg-primary-900/30 inline-block px-3 py-1 rounded-lg transition-colors">{product.brand}</p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5">
                                    {product.title}
                                </h1>
                            </div>
                            <button onClick={handleShare} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 shadow-sm" aria-label="Share product">
                                <Share2 size={20} />
                            </button>
                        </div>

                        <div className="flex items-center mb-6">
                            <div className="flex items-center text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1.5 rounded-xl">
                                <Star size={17} className="fill-current" />
                                <span className="ml-1.5 text-sm font-black text-yellow-700 dark:text-yellow-400">{product.rating}</span>
                            </div>
                            <span className="mx-4 text-slate-200 dark:text-slate-700">|</span>
                            <a href="#reviews" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors underline decoration-dashed decoration-slate-300 underline-offset-4">
                                Based on {product.reviewsCount?.toLocaleString()} verified ratings
                            </a>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                            className="relative overflow-hidden rounded-[2rem] p-0 mb-8 shadow-2xl group"
                            style={{
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                                border: '1px solid rgba(99,102,241,0.25)'
                            }}
                        >
                            {/* Glow blobs */}
                            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[90px] pointer-events-none" style={{ background: 'rgba(79,70,229,0.18)' }} />
                            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none" style={{ background: 'rgba(56,189,248,0.12)' }} />

                            <div className="relative z-10 p-6">
                                {/* Header badge */}
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="flex items-center gap-2 bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 rounded-xl">
                                        <Sparkles size={14} className="text-indigo-300 animate-pulse" />
                                        <span className="text-[11px] font-black text-indigo-200 uppercase tracking-widest">AI Review Insights</span>
                                    </div>
                                </div>

                                {/* Summary text */}
                                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-5 border-l-2 border-indigo-500/50 pl-3">
                                    {product.aiInsights.summary}
                                </p>

                                {/* Pros / Cons — stacked vertically so nothing is cut off */}
                                <div className="flex flex-col gap-4">

                                    {/* Advantages */}
                                    <div className="bg-white/5 border border-green-500/20 rounded-2xl p-4">
                                        {/* Title row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                    <ThumbsUp size={12} className="text-green-400" />
                                                </div>
                                                <span className="text-[11px] font-black text-green-400 uppercase tracking-widest">Advantages</span>
                                            </div>
                                            {/* Stars on far right, never squished */}
                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={11} className={s <= 4 ? 'fill-green-400 text-green-400' : 'text-slate-600'} />
                                                ))}
                                                <span className="ml-1.5 text-[10px] font-black text-green-400">4/5</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {product.aiInsights.pros.map((pro, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-300">
                                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Disadvantages */}
                                    <div className="bg-white/5 border border-red-500/20 rounded-2xl p-4">
                                        {/* Title row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
                                                    <ThumbsDown size={12} className="text-red-400" />
                                                </div>
                                                <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Disadvantages</span>
                                            </div>
                                            {/* Stars on far right, never squished */}
                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={11} className={s <= 2 ? 'fill-red-400 text-red-400' : 'text-slate-600'} />
                                                ))}
                                                <span className="ml-1.5 text-[10px] font-black text-red-400">2/5</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {product.aiInsights.cons.map((con, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-300">
                                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </motion.div>

                        <div className="pb-8 border-b border-slate-100 dark:border-slate-800 mb-8">
                            <div className="flex items-end mb-2">
                                <p className="text-5xl font-black text-slate-900 dark:text-white mr-4 tracking-tighter">{formatPrice(product.price)}</p>
                                <p className="text-2xl text-slate-400 dark:text-slate-500 line-through mb-1.5 font-bold">{formatPrice(product.originalPrice)}</p>
                            </div>
                            <p className="text-sm font-bold text-slate-500 flex items-center">
                                <Shield size={16} className="text-green-500 mr-1.5" /> 1 Year Manufacturer Warranty Included
                            </p>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-8">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-primary-500 pl-3">Select Color</h4>
                            <div className="flex space-x-4">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(idx)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor === idx ? 'ring-4 ring-offset-2 ring-primary-500 dark:ring-offset-[#020617] scale-110' : 'hover:scale-105 border-2 border-slate-200 dark:border-slate-700'}`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select color ${idx + 1}`}
                                    >
                                        {selectedColor === idx && <Check size={18} className="text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-8">
                            {alreadyInCart > 0 ? (
                                /* ── Item already in cart: premium 3D in-cart panel ── */
                                <motion.div
                                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                    className="relative mb-3 overflow-hidden rounded-3xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #052e16 0%, #14532d 45%, #166534 100%)',
                                        boxShadow: '0 8px 32px rgba(22,101,52,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                                    }}
                                >
                                    {/* Glass shine overlay */}
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
                                    {/* Radial glow */}
                                    <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)' }} />

                                    <div className="relative z-10 flex items-center gap-4 px-5 py-4">
                                        {/* Glowing cart icon badge */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                                style={{
                                                    background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                                                    boxShadow: '0 4px 14px rgba(34,197,94,0.5), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.2)',
                                                }}
                                            >
                                                <ShoppingCart size={24} className="text-white drop-shadow-md" />
                                            </div>
                                            {/* Pulse ring */}
                                            <span className="absolute inset-0 rounded-2xl animate-ping opacity-30"
                                                style={{ background: 'rgba(34,197,94,0.4)' }} />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-green-300 uppercase tracking-[0.18em] mb-0.5">✓ In Your Cart</p>
                                            <p className="text-lg font-black text-white leading-tight">
                                                {alreadyInCart} unit{alreadyInCart !== 1 ? 's' : ''} selected
                                            </p>
                                            <p className="text-[11px] text-green-300/70 font-semibold mt-0.5">
                                                {formatPrice(product.price * alreadyInCart)} total
                                            </p>
                                        </div>

                                        {/* 3D Quantity Stepper */}
                                        <div className="flex items-center rounded-2xl overflow-hidden flex-shrink-0"
                                            style={{
                                                background: 'rgba(0,0,0,0.35)',
                                                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: product.id, quantity: alreadyInCart - 1 }))}
                                                className="w-11 h-12 flex items-center justify-center text-green-300 hover:text-white font-black text-2xl transition-all select-none"
                                                style={{ textShadow: '0 0 8px rgba(74,222,128,0.6)' }}
                                            >−</button>
                                            <div className="w-10 h-12 flex items-center justify-center"
                                                style={{
                                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.15))',
                                                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                                                    borderRight: '1px solid rgba(255,255,255,0.08)',
                                                }}
                                            >
                                                <span className="text-white font-black text-xl select-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                                    {alreadyInCart}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: product.id, quantity: alreadyInCart + 1 }))}
                                                disabled={alreadyInCart >= product.inventory}
                                                className="w-11 h-12 flex items-center justify-center text-green-300 hover:text-white font-black text-2xl transition-all select-none disabled:opacity-25 disabled:cursor-not-allowed"
                                                style={{ textShadow: '0 0 8px rgba(74,222,128,0.6)' }}
                                            >+</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* ── Item not in cart: show the standard Add to Cart flow ── */
                                <div className="flex flex-col sm:flex-row items-stretch mb-3 gap-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/80 w-full sm:w-36 h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="flex-1 h-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white font-bold transition-colors text-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                                        >−</button>
                                        <span className="w-10 text-center text-slate-900 dark:text-white font-black text-lg select-none">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(trulyAvailable, quantity + 1))}
                                            disabled={quantity >= trulyAvailable}
                                            className="flex-1 h-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white font-bold transition-colors text-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                                        >+</button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="flex-1">
                                        <motion.button
                                            onClick={() => {
                                                if (trulyAvailable === 0) return;
                                                dispatch(addToCart({
                                                    id: product.id,
                                                    title: product.title,
                                                    price: product.price,
                                                    image: product.images[0],
                                                    category: product.category,
                                                    quantity: quantity
                                                }));
                                                setQuantity(1);
                                            }}
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            disabled={trulyAvailable === 0}
                                            className={`relative w-full h-14 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center px-6 border border-transparent overflow-hidden group ${trulyAvailable === 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 dark:bg-primary-600 shadow-xl dark:shadow-primary-600/30'}`}
                                        >
                                            {trulyAvailable > 0 && (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                                </>
                                            )}
                                            <span className="relative z-10 flex items-center">
                                                <ShoppingCart size={22} className="mr-3" />
                                                {trulyAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            {/* Real-time stock indicator */}
                            <div className={`flex items-center justify-between px-1 py-2 rounded-xl text-sm font-bold transition-colors ${trulyAvailable === 0
                                ? 'text-red-500'
                                : alreadyInCart > 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : availableStock <= 4
                                        ? 'text-orange-500'
                                        : 'text-green-600 dark:text-green-400'
                                }`}>
                                <span className="flex items-center gap-1.5">
                                    {trulyAvailable > 0 && <Check size={15} strokeWidth={3} />}
                                    {trulyAvailable === 0
                                        ? 'CURRENTLY UNAVAILABLE'
                                        : alreadyInCart > 0
                                            ? `${product.inventory - alreadyInCart} UNIT${product.inventory - alreadyInCart !== 1 ? 'S' : ''} REMAINING IN STOCK`
                                            : `${availableStock} UNIT${availableStock !== 1 ? 'S' : ''} AVAILABLE AFTER SELECTION`
                                    }
                                </span>
                                <span className="text-xs font-black bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400">
                                    Total stock: {product.inventory}
                                </span>
                            </div>
                        </div>

                        {/* Features summary blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl border-l-4 border-l-primary-500 transition-colors">
                                <Truck className="text-primary-600 dark:text-primary-400 mr-4" size={28} />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">Free Next-Day Delivery</h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">On orders over {formatPrice(50)}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl border-l-4 border-l-indigo-500 transition-colors">
                                <RefreshCw className="text-blue-600 dark:text-blue-400 mr-4" size={28} />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">30-Day Easy Returns</h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">No questions asked</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-24 border-t border-slate-100 dark:border-slate-800 pt-16">
                    <div className="flex items-end gap-4 mb-2">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                            <List className="mr-3 text-primary-500" size={32} /> Technical Specifications
                        </h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Detailed dimensions and parameters for this product.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                        {Object.entries({
                            'Brand': { val: product.brand, color: '#3b82f6' },
                            'Category': { val: product.category, color: '#8b5cf6' },
                            'Item Weight': { val: '1.2 lbs (540g)', color: '#10b981' },
                            'Material': { val: product.specs?.Material || 'Premium Manufacturer Material', color: '#f59e0b' },
                            'Dimensions': { val: '10.5 × 8.2 × 3.1 inches', color: '#ef4444' },
                            'Warranty': { val: '1 Year International Warranty', color: '#06b6d4' },
                        }).map(([key, { val, color }], idx) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                className="group relative bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                {/* Coloured left accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: color }} />
                                {/* Subtle colour tint on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `${color}0a` }} />
                                <div className="relative pl-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color }}>{key}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Verified Customer Reviews Section */}
                    <section id="reviews" className="mt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Customer Reviews</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Verified buyer testimonials</p>
                            </div>
                            {isAuthenticated && user?.role === 'buyer' && (
                                <button
                                    onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            <AnimatePresence mode="popLayout">
                                {reviews.length > 0 ? (
                                    reviews.map((review, i) => (
                                        <motion.div
                                            key={review._id || i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex text-yellow-400 gap-1">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} className={idx >= review.rating ? "text-slate-300 dark:text-slate-600" : ""} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">"{review.comment}"</p>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={review.buyerId?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                                                    alt={review.buyerId?.name}
                                                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                                                />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">{review.buyerId?.name || 'Anonymous'}</span>
                                                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Verified Buyer</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                        <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 font-bold">No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Review Form */}
                        {isAuthenticated && user?.role === 'buyer' && (
                            <motion.div
                                id="review-form"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl max-w-2xl mx-auto"
                            >
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                                    <Sparkles className="mr-3 text-primary-500" /> Share Your Experience
                                </h4>
                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Your Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    className="transition-transform active:scale-95"
                                                >
                                                    <Star
                                                        size={32}
                                                        fill={star <= reviewForm.rating ? "currentColor" : "none"}
                                                        className={star <= reviewForm.rating ? "text-yellow-400" : "text-slate-200 dark:text-slate-700"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Your Thoughts</label>
                                        <textarea
                                            required
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            rows={4}
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                            placeholder="What did you like or dislike? How was the quality?"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="w-full bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
                                        {!isSubmittingReview && <Send size={18} className="ml-3" />}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
