import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard, Users, Package, ShoppingCart,
    Settings, LogOut, ChevronRight, Activity,
    DollarSign, BarChart3, Clock, Plus, Box,
    Globe, User, ArrowUpRight, Search, Filter,
    ChevronDown, Trash2, Edit, Sparkles
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Stage, useGLTF, Float, Environment, ContactShadows, Text, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCart } from '../store/cartSlice';

// --- 3D Components ---
const ElectronicsModel = () => (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
            <boxGeometry args={[2, 1.2, 0.1]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
        </mesh>
    </Float>
);

const ShoeModel = () => (
    <Float speed={3} rotationIntensity={1.5}>
        <mesh rotation={[0.5, 0.5, 0]}>
            <torusGeometry args={[0.8, 0.3, 16, 100]} />
            <meshStandardMaterial color="#f43f5e" metalness={0.5} roughness={0.1} />
        </mesh>
    </Float>
);

const GroceryModel = () => (
    <Float speed={1.5} floatIntensity={2}>
        <mesh>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color="#10b981" />
        </mesh>
    </Float>
);

const CategoryModel3D = ({ category = "Electronics" }) => {
    switch (category) {
        case 'Electronics': return <ElectronicsModel />;
        case 'Footwear': return <ShoeModel />;
        case 'Grocery': return <GroceryModel />;
        default: return <ElectronicsModel />;
    }
};

const GodViewGlobe = () => (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
            <sphereGeometry args={[1.5, 64, 64]} />
            <MeshDistortMaterial
                color="#3b82f6"
                speed={2}
                distort={0.3}
                radius={1}
            />
        </mesh>
    </Float>
);

const LazyProduct3D = ({ category, imageUrl }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="w-full h-full relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                {!isHovered ? (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full"
                    >
                        <img
                            src={imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                            alt="Product Preview"
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 dark:from-slate-900/50 to-transparent flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <Sparkles size={14} className="text-primary-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Active 3D Preview</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="canvas"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full"
                    >
                        <Canvas camera={{ position: [0, 0, 4] }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <PresentationControls speed={1.5} global zoom={0.8} polar={[-0.1, Math.PI / 4]}>
                                <Suspense fallback={null}>
                                    <CategoryModel3D category={category} />
                                </Suspense>
                            </PresentationControls>
                        </Canvas>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Sub-Views ---

const AdminView = ({ stats }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Sales', value: `$${stats?.totalSales?.toLocaleString() || '0'}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'Active Users', value: stats?.totalUsers || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Total Products', value: stats?.totalProducts || '0', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { label: 'Active Sellers', value: stats?.activeSellers || '0', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
            ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
            ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                    <Activity className="mr-3 text-primary-500" /> Platform Growth
                </h2>
                <div className="flex gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map(t => (
                        <button key={t} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${t === 'Monthly' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-8 h-80 flex items-end justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                {[60, 40, 70, 50, 90, 65, 85, 45, 75, 55, 95, 80].map((h, i) => (
                    <div key={i} className="group relative flex-1">
                        <div
                            className="bg-primary-500/20 dark:bg-primary-500/10 rounded-t-xl w-full h-full absolute bottom-0 transition-all group-hover:bg-primary-500/30"
                            style={{ height: '100%' }}
                        />
                        <div
                            className="bg-gradient-to-t from-primary-600 to-indigo-500 rounded-t-xl w-full transition-all group-hover:scale-y-105"
                            style={{ height: `${h}%` }}
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Month {i + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AdminUsersView = ({ users }) => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                <Users className="mr-3 text-primary-500" /> Platform Users
            </h2>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold w-64" />
                </div>
                <button className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary-500">
                    <Filter size={18} />
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-black">
                                        {u.name[0].toUpperCase()}
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : u.role === 'seller' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-8 py-5 font-medium text-slate-500">{u.email}</td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><Edit size={16} /></button>
                                    <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AdminProductsView = ({ products }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                <Package className="mr-3 text-primary-500" /> Asset Management
            </h2>
            <button className="bg-primary-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                <Plus size={20} /> Create New Asset
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
                <div key={p._id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-2xl hover:scale-[1.02] group overflow-hidden">
                    <div className="h-48 bg-slate-50 dark:bg-slate-900 relative">
                        <LazyProduct3D category={p.category?.name || "Electronics"} imageUrl={p.images?.[0]?.url} />
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <span className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest border border-primary-100 dark:border-primary-900/50">
                                {p.category?.name || "Product"}
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="font-black text-slate-900 dark:text-white text-lg line-clamp-1">{p.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">${p.price}</p>

                        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</span>
                                <span className={`text-sm font-black ${p.inventory < 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>{p.inventory} Units</span>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary-500 rounded-xl transition-colors"><Edit size={16} /></button>
                                <button className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SellerView = ({ stats, user }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 flex-1 w-full max-w-full">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
                <h2 className="text-4xl font-black mb-3 tracking-tight">Welcome back Hub, {user?.name || 'Seller'}!</h2>
                <p className="text-blue-200/80 font-medium text-lg max-w-xl">Your store operations are stable. You have <span className="text-white font-bold underline underline-offset-4 decoration-blue-500">{stats?.totalOrders || 0} active orders</span> requiring attention today.</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Total Revenue</p>
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-black">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                            <DollarSign className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Pending Orders</p>
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-black">{stats?.totalOrders?.toString().padStart(2, '0') || '00'}</p>
                            <Package className="text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Live Products</p>
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-black">{stats?.totalProducts?.toString().padStart(2, '0') || '00'}</p>
                            <Box className="text-amber-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Avg Rating</p>
                        <div className="flex items-center justify-between">
                            <p className="text-3xl font-black">4.9</p>
                            <Activity className="text-green-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center">
                        <Clock className="mr-3 text-primary-500" /> Recent Operations
                    </h3>
                    <button className="text-xs font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4">View All Logs</button>
                </div>
                <div className="space-y-4">
                    {(stats?.recentOrders || []).map((order, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                            <div className={`w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:scale-125 transition-transform`} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">New order from {order.buyerName} - ${order.totalAmount}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                    ))}
                    {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                        <p className="text-center py-10 text-slate-400 font-bold">No recent operations logs.</p>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-8 flex items-center">
                    <Plus className="mr-3 text-indigo-500" /> Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <button className="flex items-center justify-between p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group">
                        <div className="flex items-center">
                            <Package size={20} className="mr-3" />
                            <span className="font-bold">Add New Product</span>
                        </div>
                        <Plus size={16} />
                    </button>
                    <button className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group">
                        <div className="flex items-center">
                            <BarChart3 size={20} className="mr-3" />
                            <span className="font-bold">Export Sales Data</span>
                        </div>
                        <Plus size={16} />
                    </button>
                    <button className="flex items-center justify-between p-5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors group">
                        <div className="flex items-center">
                            <Users size={20} className="mr-3" />
                            <span className="font-bold">Manage Customers</span>
                        </div>
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const SellerAnalyticsView = ({ stats }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversion Rate</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">3.8%</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                        <BarChart3 size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unique Visitors</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">12,456</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center">
                    <Activity className="mr-3 text-rose-500" /> Sales Trend (30 Days)
                </h2>
                <div className="h-64 flex items-end justify-between gap-3 px-2">
                    {(stats?.trend || Array(12).fill({ sales: 0 })).map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-primary-600 to-indigo-500 rounded-t-lg transition-all hover:scale-105 cursor-pointer relative group" style={{ height: `${(h.sales / 100) || 5}%` }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 whitespace-nowrap">
                                ${h.sales}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative min-h-[400px] overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 top-20 flex justify-center items-center cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 0, 4] }}>
                        <PresentationControls speed={2} zoom={1.1} polar={[0, Math.PI / 2]}>
                            <GodViewGlobe />
                        </PresentationControls>
                    </Canvas>
                </div>
            </div>
        </div>
    </div>
);

const SettingsView = ({ user }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors max-w-2xl">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center"><Settings className="mr-3 text-slate-500" /> Account Settings</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 transition-colors" defaultValue={user?.name} />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 transition-colors" defaultValue={user?.email} disabled />
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm w-full sm:w-auto">
                Update Profile
            </button>
        </div>
    </div>
);

const BuyerOrdersView = ({ orders }) => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700/50">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
                <ShoppingCart className="mr-3 text-primary-500" /> Order History
            </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                            <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">#{o._id.slice(-8).toUpperCase()}</td>
                            <td className="px-8 py-5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td className="px-8 py-5 font-black text-primary-600">${o.amount}</td>
                            <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${o.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                                    {o.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const Dashboard = ({ role }) => {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentRole = role || user?.role || 'buyer';
    const [activeTab, setActiveTab] = useState(currentRole === 'seller' ? 'overview' : (currentRole === 'admin' ? 'overview' : 'locker'));
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [extraData, setExtraData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const statsEndpoint = currentRole === 'admin' ? '/api/stats/admin' :
                    currentRole === 'seller' ? '/api/stats/seller' : null;

                if (statsEndpoint) {
                    const res = await axios.get(statsEndpoint, config);
                    setStats(res.data);
                }

                let dataUrl = '';
                if (currentRole === 'admin') {
                    if (activeTab === 'users') dataUrl = '/api/users';
                    if (activeTab === 'products') dataUrl = '/api/products';
                } else if (currentRole === 'seller') {
                    if (activeTab === 'products') dataUrl = '/api/products/seller';
                } else {
                    if (activeTab === 'orders') dataUrl = '/api/orders/user';
                }

                if (dataUrl) {
                    const res = await axios.get(dataUrl, config);
                    setExtraData(res.data.products || res.data.users || res.data.orders || res.data || []);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [currentRole, activeTab, token]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    const handleLogout = () => {
        dispatch(clearCart());
        import('../store/index').then(({ logout }) => {
            dispatch(logout());
            navigate('/login');
        });
    };

    const getMenuItems = () => {
        if (currentRole === 'admin') {
            return [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'products', label: 'Products', icon: Package },
            ];
        } else if (currentRole === 'seller') {
            return [
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'products', label: 'Manage 3D Assets', icon: Package },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ];
        } else {
            return [
                { id: 'overview', label: 'My Profile', icon: User },
                { id: 'locker', label: 'Locker Room', icon: Box },
                { id: 'orders', label: 'Order History', icon: Package },
            ];
        }
    };

    const renderContent = () => {
        if (loading) return (
            <div className="flex-1 flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

        if (activeTab === 'settings') return <SettingsView user={user} />;

        if (currentRole === 'admin') {
            if (activeTab === 'overview') return <AdminView stats={stats} />;
            if (activeTab === 'users') return <AdminUsersView users={extraData} />;
            if (activeTab === 'products') return <AdminProductsView products={extraData} />;
        }

        if (currentRole === 'seller') {
            if (activeTab === 'overview') return <SellerView stats={stats} user={user} />;
            if (activeTab === 'products') return <AdminProductsView products={extraData} />;
            if (activeTab === 'analytics') return <SellerAnalyticsView stats={stats} />;
        }

        if (currentRole === 'buyer') {
            if (activeTab === 'overview') return <div className="p-8"><h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome back, {user?.name}</h2><p className="mt-4 text-slate-500 font-medium">Access your locker room and order history from the sidebar.</p></div>;
            if (activeTab === 'locker') return <div className="p-20 text-center"><Box size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" /><h3 className="text-2xl font-black text-slate-900 dark:text-white">Your Locker is empty</h3><Link to="/products" className="mt-8 inline-block bg-primary-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">Browse Products</Link></div>;
            if (activeTab === 'orders') return <BuyerOrdersView orders={extraData} />;
        }

        return <div className="p-8 text-center text-slate-400 font-bold">Section under development</div>;
    };

    const menuItems = getMenuItems();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col pt-20">
            <div className="flex-1 flex overflow-hidden">
                <aside className="w-20 lg:w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col transition-all duration-300">
                    <div className="flex-1 py-8 px-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeTab === item.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <item.icon className={`${activeTab === item.id ? 'text-white' : 'group-hover:text-primary-500'} transition-colors`} size={24} />
                                <span className="hidden lg:block font-bold truncate">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'settings'
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <Settings size={24} />
                            <span className="hidden lg:block font-bold">Settings</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all font-bold group"
                        >
                            <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors p-4 sm:p-8 lg:p-12">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white capitalize leading-tight">
                                    {menuItems.find(i => i.id === activeTab)?.label || 'Settings'}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Managing your Vertexia experience</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-black">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="hidden sm:block mr-2">
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{user?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentRole}</p>
                                </div>
                            </div>
                        </div>

                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
