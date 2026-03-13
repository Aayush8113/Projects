import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  CornerDownLeft,
  Filter,
  Grid,
  List,
  Loader2,
  Search,
  Sparkles,
  Star,
  Tags,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

// ─── AI Dream Finder Engine (Client-Side NLP) ────────────────────────────────
const BUDGET_PATTERNS = [
  { re: /under\s*\$?([\d,]+)/i, type: "max" },
  { re: /less\s+than\s*\$?([\d,]+)/i, type: "max" },
  { re: /below\s*\$?([\d,]+)/i, type: "max" },
  { re: /cheap|budget|affordable|inexpensive/i, type: "cheap" },
  { re: /expensive|luxury|premium|high.?end/i, type: "expensive" },
  { re: /around\s*\$?([\d,]+)/i, type: "around" },
  {
    re: /between\s*\$?([\d,]+)\s*(?:and|to|-|–)\s*\$?([\d,]+)/i,
    type: "range",
  },
];

const INTENT_KEYWORDS = {
  electronics: [
    "phone",
    "iphone",
    "android",
    "laptop",
    "computer",
    "tablet",
    "ipad",
    "smart",
    "tech",
    "gadget",
    "watch",
    "earbuds",
    "headphone",
    "camera",
    "gaming",
    "console",
    "keyboard",
    "mouse",
    "speaker",
    "tv",
    "monitor",
  ],
  fashion: [
    "clothes",
    "shirt",
    "dress",
    "pants",
    "jeans",
    "shoes",
    "sneakers",
    "boots",
    "jacket",
    "coat",
    "wear",
    "fashion",
    "style",
    "outfit",
    "bag",
    "purse",
    "handbag",
    "accessory",
  ],
  home: [
    "home",
    "kitchen",
    "furniture",
    "chair",
    "table",
    "sofa",
    "couch",
    "lamp",
    "decor",
    "cookware",
    "appliance",
    "blender",
    "oven",
    "cleaning",
  ],
  beauty: [
    "beauty",
    "skincare",
    "makeup",
    "lipstick",
    "foundation",
    "serum",
    "shampoo",
    "hair",
    "perfume",
    "cologne",
    "cream",
    "lotion",
    "wellness",
  ],
  groceries: [
    "food",
    "drink",
    "snack",
    "grocery",
    "vegetable",
    "fruit",
    "organic",
    "beverage",
    "juice",
    "coffee",
    "tea",
  ],
  toys: [
    "toy",
    "game",
    "book",
    "puzzle",
    "kids",
    "children",
    "lego",
    "board game",
    "educational",
  ],
};

const CATEGORY_MAP = {
  electronics: "Electronics & Gadgets",
  fashion: "Fashion & Apparel",
  home: "Home, Kitchen, & Furniture",
  beauty: "Health, Beauty, & Personal Care",
  groceries: "Groceries & Pantry",
  toys: "Toys, Hobbies, & Books",
};

const parseAiQuery = (query, products) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const budget = {};
  let inferredCategory = null;

  const prices = products.map((p) => p.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);

  for (const bp of BUDGET_PATTERNS) {
    const m = q.match(bp.re);
    if (m) {
      if (bp.type === "max") budget.max = parseFloat(m[1].replace(",", ""));
      else if (bp.type === "around") {
        const v = parseFloat(m[1].replace(",", ""));
        budget.min = v * 0.75;
        budget.max = v * 1.25;
      } else if (bp.type === "range") {
        budget.min = parseFloat(m[1].replace(",", ""));
        budget.max = parseFloat(m[2].replace(",", ""));
      } else if (bp.type === "cheap") budget.max = minP + (maxP - minP) * 0.3;
      else if (bp.type === "expensive") budget.min = minP + (maxP - minP) * 0.6;
      break;
    }
  }

  let maxIntentScore = 0;
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = keywords.filter((k) => q.includes(k)).length;
    if (score > maxIntentScore) {
      maxIntentScore = score;
      inferredCategory = CATEGORY_MAP[intent];
    }
  }

  const queryWords = q
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        ![
          "the",
          "for",
          "and",
          "with",
          "that",
          "this",
          "best",
          "good",
          "cheap",
          "nice",
        ].includes(w),
    );
  const scored = products.map((p) => {
    let score = 0;
    const titleLower = p.title.toLowerCase();

    queryWords.forEach((w) => {
      if (titleLower.includes(w)) score += 4;
    });
    if (inferredCategory && p.category === inferredCategory) score += 5;

    const hasBudgetFilter =
      budget.min !== undefined || budget.max !== undefined;
    const inBudget =
      (!budget.min || p.price >= budget.min) &&
      (!budget.max || p.price <= budget.max);
    if (hasBudgetFilter) {
      if (inBudget) score += 4;
      else score -= 8;
    }

    score += p.rating * 0.4;

    const matchType =
      score >= 10
        ? "excellent"
        : score >= 5
          ? "good"
          : score >= 1
            ? "possible"
            : "none";
    return { ...p, aiScore: score, matchType };
  });

  return {
    results: scored
      .filter((p) => p.aiScore > 0)
      .sort((a, b) => b.aiScore - a.aiScore),
    inferredCategory,
    budget,
    query,
  };
};

const AI_SUGGESTIONS = [
  "Best smartphone under $500",
  "Affordable running shoes for men",
  "Luxury skincare for dry skin",
  "Kitchen appliances for small apartments",
  "Gaming headphones under $100",
  "Premium laptops for students",
];
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

const SUBCATEGORIES_MAP = {
  "Electronics & Gadgets": [
    "Smartphones",
    "Tablets",
    "Laptops",
    "Wearables",
    "Home Appliances",
  ],
  "Fashion & Apparel": ["Men", "Women", "Footwear", "Accessories"],
  "Home, Kitchen, & Furniture": ["Kitchen & Dining", "Furniture", "Home Decor"],
  "Health, Beauty, & Personal Care": [
    "Skincare",
    "Haircare",
    "Makeup",
    "Wellness",
  ],
  "Groceries & Pantry": [
    "Fruits & Vegetables",
    "Staples",
    "Beverages",
    "Dairy & Bakery",
  ],
  "Toys, Hobbies, & Books": ["Toys", "Books", "Hobbies"],
};

const CATEGORY_COLORS = {
  All: "from-slate-400 to-slate-500 text-slate-700 dark:text-slate-300",
  "Electronics & Gadgets":
    "from-blue-400 to-indigo-500 text-blue-700 dark:text-blue-300",
  "Fashion & Apparel":
    "from-pink-400 to-rose-500 text-rose-700 dark:text-rose-300",
  "Health, Beauty, & Personal Care":
    "from-purple-400 to-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-300",
  "Home, Kitchen, & Furniture":
    "from-emerald-400 to-teal-500 text-teal-700 dark:text-teal-300",
  "Groceries & Pantry":
    "from-orange-400 to-amber-500 text-orange-700 dark:text-orange-300",
  "Toys, Hobbies, & Books":
    "from-blue-400 to-blue-500 text-blue-700 dark:text-blue-300",
};

const Products = () => {
  const { formatPrice } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const initialCategory = location.state?.selectedCategory
    ? [location.state.selectedCategory]
    : [];

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCategories, setSelectedCategories] = useState(initialCategory);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // AI Search state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiInputFocused, setAiInputFocused] = useState(false);
  const aiInputRef = useRef(null);

  const handleAiSearch = () => {
    if (!aiQuery.trim() || products.length === 0) return;
    setIsAiSearching(true);
    setTimeout(() => {
      const result = parseAiQuery(aiQuery, products);
      setAiResult(result);
      setIsAiSearching(false);
    }, 800);
  };

  const clearAiSearch = () => {
    setAiQuery("");
    setAiResult(null);
  };

  const setFilteredPage = (deps) => {
    void deps;
    setCurrentPage(1);
  };
  useEffect(() => {
    setFilteredPage([
      selectedCategories,
      selectedSubcategories,
      selectedBrands,
      inStockOnly,
      priceRange,
      minRating,
      sortBy,
    ]);
  }, [
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    inStockOnly,
    priceRange,
    minRating,
    sortBy,
  ]);

  // SEO Head Title Update
  useEffect(() => {
    document.title = "Explore Products | Vertexia - Premium E-commerce";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse our huge collection of premium electronics, fashion, beauty, and home items at Vertexia.",
      );
    }
  }, []);

  // Ensure we start at the top of the page when coming from another route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [res, catRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios
            .get("http://localhost:5000/api/categories")
            .catch(() => ({ data: [] })),
        ]);

        const catData =
          catRes.data.data?.categories ||
          catRes.data?.categories ||
          catRes.data ||
          [];
        const catMap = {};
        (Array.isArray(catData) ? catData : []).forEach((c) => {
          if (c._id) catMap[c._id] = c.name;
        });

        const pData = res.data.data?.products || res.data?.products || res.data;
        const pList = Array.isArray(pData) ? pData : [];

        const formattedProducts = pList.map((p) => {
          const resolvedCatName =
            p.category?.name ||
            catMap[
              typeof p.category === "string" ? p.category : p.category?._id
            ] ||
            "Uncategorized";
          return {
            id: p._id,
            title: p.title,
            price: p.discountedPrice || p.price,
            originalPrice: p.price,
            rating: p.ratings?.average || 4.5,
            reviews: p.ratings?.count || 120,
            inventory:
              p.inventory !== undefined
                ? p.inventory
                : Math.floor(Math.random() * 20),
            brand:
              p.specifications?.Brand ||
              (resolvedCatName === "Electronics & Gadgets"
                ? "TechCore"
                : resolvedCatName === "Fashion & Apparel"
                  ? "UrbanFit"
                  : "Vertex"),
            image:
              p.images && p.images.length > 0
                ? p.images[0].url
                : "https://via.placeholder.com/800",
            category: resolvedCatName,
            subCategory: p.subCategory || "",
          };
        });
        setProducts(formattedProducts);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(formattedProducts.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === "All") {
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      return;
    }

    // Accordion logic: Selecting a new category overwrites the previous ones,
    // and if it's the exact same category, it toggles it off.
    setSelectedCategories((prev) => {
      if (prev.length === 1 && prev[0] === cat) {
        setSelectedSubcategories([]);
        return []; // Toggle off if clicking the already open one
      } else {
        setSelectedSubcategories([]); // Clear subcategories when switching
        return [cat]; // Only allow one category to be open at a time
      }
    });
  };

  const handleSubcategoryChange = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const filteredProducts = React.useMemo(() => {
    let result = products.filter((product) => {
      let matchCat =
        selectedCategories.length === 0 ||
        selectedCategories.includes("All") ||
        selectedCategories.includes(product.category);

      let matchSub = true;
      if (selectedSubcategories.length > 0) {
        // Check if product's subCategory exactly matches, or if title contains it (fallback)
        matchSub = selectedSubcategories.some(
          (sub) =>
            (product.subCategory &&
              product.subCategory.toLowerCase() === sub.toLowerCase()) ||
            product.title.toLowerCase().includes(sub.toLowerCase()),
        );
      }

      let matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      let matchStock = !inStockOnly || product.inventory > 0;

      let matchPrice = true;
      if (priceRange.min !== "")
        matchPrice = matchPrice && product.price >= Number(priceRange.min);
      if (priceRange.max !== "")
        matchPrice = matchPrice && product.price <= Number(priceRange.max);

      let matchRating = product.rating >= minRating;

      return (
        matchCat &&
        matchSub &&
        matchBrand &&
        matchStock &&
        matchPrice &&
        matchRating
      );
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    products,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    inStockOnly,
    priceRange,
    minRating,
    sortBy,
  ]);

  const ALL_BRANDS = React.useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products],
  );
  const displayProducts = aiResult ? aiResult.results : filteredProducts;

  if (loading) {
    return (
      <div className="bg-transparent min-h-screen py-10 flex justify-center items-center transition-colors duration-300">
        <div className="flex flex-col flex-1 max-w-7xl mx-auto px-4 w-full">
          {/* Skeleton Loader matching the product grid layout */}
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Dream Finder Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-10 border border-white/5 shadow-2xl mb-12"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                  Vertexia AI
                </p>
                <h2 className="text-white font-black text-lg leading-none">
                  Dream Product Finder
                </h2>
              </div>
            </div>
            <p className="text-blue-200/70 text-sm font-medium mb-6 max-w-2xl">
              Describe your ideal product in plain English — budget, need, or
              style — and the AI will instantly find the best matches.
            </p>

            <div
              className={`relative flex items-center bg-white/5 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${aiInputFocused ? "border-blue-500/70 shadow-lg shadow-blue-500/10 bg-white/10" : "border-white/10"}`}
            >
              <Search size={18} className="ml-5 text-slate-400 flex-shrink-0" />
              <input
                ref={aiInputRef}
                type="text"
                value={aiQuery}
                onFocus={() => setAiInputFocused(true)}
                onBlur={() => setAiInputFocused(false)}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                placeholder="e.g. best gaming laptop under $800, premium sneakers for men..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm font-medium py-4 px-4"
              />
              {aiQuery && (
                <button
                  onClick={clearAiSearch}
                  className="p-2 mr-1 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={handleAiSearch}
                disabled={!aiQuery.trim() || isAiSearching}
                className="m-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/20 flex-shrink-0"
              >
                {isAiSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Thinking...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Search
                  </>
                )}
              </button>
            </div>

            {!aiResult && (
              <div className="mt-4 flex flex-wrap gap-2">
                {AI_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAiQuery(s);
                      setTimeout(() => aiInputRef.current?.focus(), 50);
                    }}
                    className="text-[11px] font-bold text-blue-300/80 border border-blue-500/20 hover:border-blue-400/50 hover:text-blue-200 bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                  >
                    <CornerDownLeft size={10} />
                    {s}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-5 flex flex-wrap items-center gap-3"
                >
                  <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full">
                    <Sparkles
                      size={14}
                      className="text-blue-400 animate-pulse"
                    />
                    <span className="text-white text-xs font-black">
                      {aiResult.results.length} AI Matches Found
                    </span>
                  </div>
                  {aiResult.inferredCategory && (
                    <div className="bg-indigo-500/20 border border-indigo-400/30 px-3 py-1.5 rounded-full">
                      <span className="text-indigo-300 text-xs font-bold">
                        Category: {aiResult.inferredCategory}
                      </span>
                    </div>
                  )}
                  {aiResult.budget.max && (
                    <div className="bg-green-500/10 border border-green-400/30 px-3 py-1.5 rounded-full">
                      <span className="text-green-300 text-xs font-bold">
                        Budget ≤ {formatPrice(aiResult.budget.max)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={clearAiSearch}
                    className="text-xs font-bold text-slate-400 hover:text-white underline underline-offset-4 ml-auto transition-colors"
                  >
                    Clear AI Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {aiResult ? "AI Search Results" : "All Products"}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Showing {displayProducts.length} items
              {aiResult ? ` for "${aiQuery}"` : ""}
            </p>
          </div>

          <div className="mt-2 md:mt-0 flex flex-wrap items-center gap-4">
            <div className="relative inline-block text-left w-full sm:w-auto">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between w-64 px-4 py-2.5 bg-white dark:bg-slate-800 dark:border-slate-700 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 dark:text-slate-300 hover:border-primary-500 dark:hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <span className="flex items-center truncate">
                  <Sparkles
                    size={14}
                    className="mr-2 text-blue-500 flex-shrink-0"
                  />
                  Sort:{" "}
                  {sortBy === "recommended"
                    ? "AI Recommended"
                    : sortBy === "price-low"
                      ? "Price: Low to High"
                      : sortBy === "price-high"
                        ? "Price: High to Low"
                        : "Highest Rated"}
                </span>
                <ChevronDown
                  size={16}
                  className="ml-2 text-gray-400 flex-shrink-0"
                />
              </button>
              {isSortOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 z-20 border border-gray-100 dark:border-slate-700 overflow-hidden">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        setSortBy("recommended");
                        setIsSortOpen(false);
                      }}
                      className={`block px-4 py-2.5 text-sm font-medium w-full text-left ${sortBy === "recommended" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                    >
                      AI Recommended
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price-low");
                        setIsSortOpen(false);
                      }}
                      className={`block px-4 py-2.5 text-sm font-medium w-full text-left ${sortBy === "price-low" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price-high");
                        setIsSortOpen(false);
                      }}
                      className={`block px-4 py-2.5 text-sm font-medium w-full text-left ${sortBy === "price-high" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                    >
                      Price: High to Low
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("rating");
                        setIsSortOpen(false);
                      }}
                      className={`block px-4 py-2.5 text-sm font-medium w-full text-left ${sortBy === "rating" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                    >
                      Highest Rated
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-1 ml-auto sm:ml-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm" : "text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm" : "text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm font-bold text-gray-700 dark:text-slate-300"
              >
                <span className="flex items-center">
                  <Filter
                    size={18}
                    className="mr-2 text-primary-600 dark:text-primary-400"
                  />{" "}
                  Filters & Sorting
                </span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div
              className={`${isFilterOpen ? "block" : "hidden"} lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:sticky lg:top-24 transition-colors max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center tracking-tight">
                  <Filter
                    size={18}
                    className="mr-2 text-primary-600 dark:text-primary-400"
                  />{" "}
                  Filters
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                    setPriceRange({ min: "", max: "" });
                    setMinRating(0);
                    setSortBy("recommended");
                  }}
                  className="text-xs font-bold bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1.5 rounded-full dark:hover:bg-primary-900/50 transition-colors shadow-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <Tags size={14} className="mr-2" /> Categories
                  </h3>
                  <div className="space-y-4">
                    {categories.map((cat, i) => {
                      const isSelected =
                        cat === "All"
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(cat);
                      const gradient = CATEGORY_COLORS[cat]
                        ? CATEGORY_COLORS[cat].split(" ")[0] +
                          " " +
                          CATEGORY_COLORS[cat].split(" ")[1]
                        : "from-primary-400 to-indigo-500";
                      const textColor = CATEGORY_COLORS[cat]
                        ? CATEGORY_COLORS[cat].split(" ").slice(2).join(" ")
                        : "text-primary-700 dark:text-primary-300";
                      const hasSubcategories =
                        SUBCATEGORIES_MAP[cat] &&
                        SUBCATEGORIES_MAP[cat].length > 0;

                      // Ensure "All" doesn't render subcategories
                      const showSubs =
                        isSelected && hasSubcategories && cat !== "All";

                      return (
                        <div key={i} className="flex flex-col">
                          <button
                            onClick={() => handleCategoryChange(cat)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${
                              isSelected
                                ? `bg-gradient-to-r ${gradient} text-white shadow-lg transform scale-[1.02]`
                                : `bg-slate-50 dark:bg-slate-800/50 ${textColor} hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:shadow-md`
                            }`}
                          >
                            <span className="truncate pr-2">{cat}</span>
                            {hasSubcategories && cat !== "All" && (
                              <ChevronDown
                                size={16}
                                className={`flex-shrink-0 transition-transform duration-300 ${isSelected ? "rotate-180 text-white" : "text-slate-400"}`}
                              />
                            )}
                          </button>

                          {/* Subcategories (Animated expand) */}
                          <AnimatePresence>
                            {showSubs && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden ml-4 mt-2 border-l-2 border-slate-100 dark:border-slate-700/50 pl-4 space-y-2 flex flex-col"
                              >
                                {SUBCATEGORIES_MAP[cat].map((sub) => {
                                  const isSubSelected =
                                    selectedSubcategories.includes(sub);
                                  return (
                                    <button
                                      key={sub}
                                      onClick={() =>
                                        handleSubcategoryChange(sub)
                                      }
                                      className={`text-left text-sm font-bold px-3 py-2 rounded-xl transition-all ${
                                        isSubSelected
                                          ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md`
                                          : `text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800`
                                      }`}
                                    >
                                      {sub}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Price Range
                  </h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      placeholder="Min"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
                    />
                    <span className="text-gray-400 font-medium">-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      placeholder="Max"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
                    />
                  </div>
                </div>

                {/* Brands */}
                <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Brands
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-2">
                    {ALL_BRANDS.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center group cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="w-5 h-5 rounded text-primary-600 border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-primary-500 transition-colors"
                        />
                        <span className="ml-3 text-sm font-bold text-gray-600 dark:text-slate-300">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Availability
                  </h3>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-5 h-5 rounded text-primary-600 border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-primary-500 transition-colors"
                    />
                    <span className="ml-3 text-sm font-bold text-gray-600 dark:text-slate-300">
                      In Stock Ready
                    </span>
                  </label>
                </div>

                {/* Ratings */}
                <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Customer Rating
                  </h3>
                  <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center group cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-5 h-5 text-primary-600 border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-primary-500 transition-colors"
                        />
                        <span className="ml-3 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-200 dark:text-slate-600"
                              }
                            />
                          ))}
                          <span className="ml-2 text-sm font-bold text-gray-600 dark:text-slate-300">
                            & Up
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Layout */}
          <div className="flex-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-row-dense"
                  : "flex flex-col space-y-6"
              }
            >
              {displayProducts.length === 0 ? (
                <div className="col-span-full w-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-md transition-colors flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                    {aiResult ? (
                      <Bot size={32} className="text-blue-400" />
                    ) : (
                      <Filter
                        size={32}
                        className="text-slate-300 dark:text-slate-600"
                      />
                    )}
                  </div>
                  <p className="text-xl font-black text-slate-800 dark:text-white mb-2">
                    {aiResult
                      ? "No AI matches found."
                      : "No products match your filters."}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                    {aiResult
                      ? 'Try a different description, like "affordable running shoes" or "gaming laptop under $1000".'
                      : "Try adjusting your categories or price range."}
                  </p>
                  <button
                    onClick={
                      aiResult
                        ? clearAiSearch
                        : () => {
                            setSelectedCategories([]);
                            setSelectedSubcategories([]);
                            setPriceRange({ min: "", max: "" });
                            setMinRating(0);
                          }
                    }
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg font-bold transition-all transform hover:-translate-y-1"
                  >
                    {aiResult ? "Clear AI Search" : "Clear all filters"}
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {(aiResult
                    ? displayProducts
                    : displayProducts.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                  ).map((product) => {
                    const cardColorClass =
                      CATEGORY_COLORS[product.category] ||
                      "from-slate-400 to-slate-500 text-slate-700 dark:text-slate-300";
                    const badgeBg = cardColorClass
                      .split(" ")[0]
                      .replace("from-", "bg-");

                    const matchBadge =
                      product.matchType === "excellent"
                        ? {
                            label: "🎯 Best Match",
                            cls: "bg-blue-600 text-white",
                          }
                        : product.matchType === "good"
                          ? {
                              label: "✓ Good Match",
                              cls: "bg-emerald-600 text-white",
                            }
                          : null;
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        variants={itemVariants}
                        className={viewMode === "list" ? "col-span-full" : ""}
                      >
                        <Tilt
                          tiltMaxAngleX={8}
                          tiltMaxAngleY={8}
                          scale={1.02}
                          transitionSpeed={2500}
                          className={`group/card ${viewMode === "list" ? "h-52 w-full" : "flex flex-col h-full"} relative`}
                        >
                          <div
                            className={`flex ${viewMode === "list" ? "flex-row" : "flex-col"} h-full bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 cursor-pointer`}
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            {/* Image Container */}
                            <div
                              className={`relative bg-slate-50 dark:bg-[#050811] overflow-hidden ${viewMode === "list" ? "w-1/3 min-w-[200px] border-r border-slate-100 dark:border-white/5" : "h-64 border-b border-slate-100 dark:border-white/5"}`}
                            >
                              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                                <p
                                  className={`text-[10px] text-white font-black uppercase tracking-widest ${badgeBg} backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl shadow-lg`}
                                >
                                  {product.category}
                                </p>
                                {matchBadge && (
                                  <span
                                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg ${matchBadge.cls}`}
                                  >
                                    {matchBadge.label}
                                  </span>
                                )}
                              </div>

                              {/* Image */}
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover dark:brightness-90 group-hover/card:scale-110 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                              />

                              {/* Hover Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>

                            {/* Card Content */}
                            <div
                              className={`flex flex-col flex-1 p-6 ${viewMode === "list" ? "justify-center" : ""}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md border border-yellow-200 dark:border-yellow-700/50">
                                  <Star size={14} className="fill-current" />
                                  <span className="ml-1 text-xs font-black text-yellow-700 dark:text-yellow-500">
                                    {product.rating}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                  {product.reviews} Verification Reviews
                                </span>
                              </div>

                              {/* Title */}
                              <h3
                                className={`text-xl font-black text-slate-900 dark:text-white leading-snug line-clamp-2 mb-3 group-hover/card:${cardColorClass.split(" ")[2]} transition-colors`}
                              >
                                <Link to={`/products/${product.id}`}>
                                  <span
                                    aria-hidden="true"
                                    className="absolute inset-0 z-10"
                                  />
                                  {product.title}
                                </Link>
                              </h3>

                              <div className="mt-auto flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {formatPrice(product.price)}
                                  </p>
                                  {product.originalPrice > product.price && (
                                    <p className="text-sm text-slate-400 line-through font-bold">
                                      {formatPrice(product.originalPrice)}
                                    </p>
                                  )}
                                </div>
                                <button
                                  className={`pointer-events-none relative z-20 flex-shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-10 h-10 rounded-full flex items-center justify-center transform group-hover/card:scale-110 hover:!bg-primary-600 hover:text-white transition-all shadow-md active:scale-95`}
                                >
                                  <ChevronRight size={20} className="ml-0.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Tilt>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Pagination Controls */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-16 flex justify-center">
                <nav
                  className="relative z-0 inline-flex rounded-full shadow-sm bg-white dark:bg-slate-800 p-1 border border-gray-200 dark:border-slate-700"
                  aria-label="Pagination"
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="relative inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="hidden sm:flex items-center px-2 space-x-1 border-x border-gray-200 dark:border-slate-700 mx-2">
                    {[
                      ...Array(
                        Math.ceil(filteredProducts.length / itemsPerPage),
                      ),
                    ].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${currentPage === i + 1 ? "bg-primary-600 text-white shadow-md" : "bg-transparent text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={
                      currentPage ===
                      Math.ceil(filteredProducts.length / itemsPerPage)
                    }
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(
                          Math.ceil(filteredProducts.length / itemsPerPage),
                          p + 1,
                        ),
                      )
                    }
                    className="relative inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
