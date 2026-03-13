const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

dotenv.config();

const categories = [
    {
        name: 'Electronics & Gadgets',
        slug: 'electronics-gadgets',
        subCategories: ['Smartphones', 'Tablets', 'Laptops', 'Wearables', 'Home Appliances'],
        description: 'Tech items',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
    },
    {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        subCategories: ['Men', 'Women', 'Footwear', 'Accessories'],
        description: 'Clothing',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500'
    },
    {
        name: 'Home, Kitchen, & Furniture',
        slug: 'home-kitchen-furniture',
        subCategories: ['Kitchen & Dining', 'Furniture', 'Home Decor'],
        description: 'Home decor',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500'
    },
    {
        name: 'Health, Beauty, & Personal Care',
        slug: 'health-beauty-personal-care',
        subCategories: ['Skincare', 'Haircare', 'Makeup', 'Wellness'],
        description: 'Wellness items',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'
    },
    {
        name: 'Groceries & Pantry',
        slug: 'groceries-pantry',
        subCategories: ['Fruits & Vegetables', 'Staples', 'Beverages', 'Dairy & Bakery'],
        description: 'Food items',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'
    },
    {
        name: 'Toys, Hobbies, & Books',
        slug: 'toys-hobbies-books',
        subCategories: ['Toys', 'Books', 'Hobbies'],
        description: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500'
    }
];

const seedProducts = [
    // Electronics & Gadgets
    {
        title: "Apple iPhone 15 Pro Max",
        description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
        price: 159900,
        categoryName: "Electronics & Gadgets",
        subCategory: "Smartphones",
        images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000", alt: "iPhone 15 Pro Max" }],
        inventory: 45,
        modelConfig: { type: "smartphone", color: "#4f4f4f", brand: "apple" },
        ratings: { average: 4.9, count: 1250 },
        specifications: { "Brand": "Apple", "Chip": "A17 Pro", "Camera": "48MP" },
        reviews: [
            { user: "Rajesh K.", rating: 5, comment: "Best phone ever! The titanium build feels incredibly premium." },
            { user: "Priya S.", rating: 4, comment: "Amazing camera, but very expensive." }
        ]
    },
    {
        title: "Samsung Galaxy S24 Ultra",
        description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
        price: 129999,
        categoryName: "Electronics & Gadgets",
        subCategory: "Smartphones",
        images: [{ url: "https://images.unsplash.com/photo-1610940523291-bf0af7066e4a?auto=format&fit=crop&q=80&w=1000", alt: "Galaxy S24 Ultra" }],
        inventory: 30,
        modelConfig: { type: "smartphone", color: "#d1c4e9", brand: "samsung" },
        ratings: { average: 4.8, count: 980 },
        specifications: { "Brand": "Samsung", "Feature": "Galaxy AI", "Camera": "200MP" },
        reviews: [
            { user: "Amit P.", rating: 5, comment: "Galaxy AI features are mind-blowing. S-Pen is very useful." }
        ]
    },
    {
        title: "Asus ROG Strix G16",
        description: "Draw more frames and win more games with the brand new ROG Strix G16 featuring a 13th Gen Intel Core i9 processor and NVIDIA GeForce RTX 4070 Laptop GPU.",
        price: 165000,
        categoryName: "Electronics & Gadgets",
        subCategory: "Laptops",
        images: [{ url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000", alt: "ROG Strix" }],
        inventory: 15,
        modelConfig: { type: "laptop", color: "#1a1a1a", brand: "asus" },
        ratings: { average: 4.7, count: 320 },
        specifications: { "Brand": "Asus", "CPU": "Intel i9", "GPU": "RTX 4070" },
        reviews: [
            { user: "Rahul V.", rating: 5, comment: "Beast of a machine. Handles all AAA titles at ultra settings." }
        ]
    },
    {
        title: "Boat Airdopes 141",
        description: "Equipped with 8mm drivers, experience the boAt Signature Sound. Enjoy up to 42 hours of playtime and ASAP Charge technology.",
        price: 1499,
        categoryName: "Electronics & Gadgets",
        subCategory: "Wearables",
        images: [{ url: "https://images.unsplash.com/photo-1590658268037-6f1d9100064b?auto=format&fit=crop&q=80&w=1000", alt: "Boat Airdopes" }],
        inventory: 500,
        modelConfig: { type: "earbuds", color: "#000000", brand: "boat" },
        ratings: { average: 4.2, count: 8500 },
        specifications: { "Brand": "Boat", "Playtime": "42HRS", "Water Resistant": "IPX4" },
        reviews: [
            { user: "Sneha M.", rating: 4, comment: "Good sound quality for the price. Battery life is decent." }
        ]
    },

    // Fashion & Apparel
    {
        title: "Raymond Premium Cotton Formal Shirt",
        description: "Elevate your office aesthetic with this meticulously tailored slim-fit formal shirt constructed from 100% premium breathable cotton.",
        price: 2499,
        categoryName: "Fashion & Apparel",
        subCategory: "Men",
        images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000", alt: "Raymond Shirt" }],
        inventory: 120,
        modelConfig: { type: "shirt", color: "#ffffff", brand: "raymond" },
        ratings: { average: 4.5, count: 650 },
        specifications: { "Brand": "Raymond", "Material": "100% Cotton", "Fit": "Slim" },
        reviews: [
            { user: "Vikram S.", rating: 5, comment: "Perfect fit and very comfortable fabric. True Raymond quality." }
        ]
    },
    {
        title: "Biba Festive Kurta Set",
        description: "Beautifully crafted ethnic wear for women. Ideal for festive occasions and comfortable for all-day wear.",
        price: 3500,
        categoryName: "Fashion & Apparel",
        subCategory: "Women",
        images: [{ url: "https://images.unsplash.com/photo-1583391733958-65e2ca112837?auto=format&fit=crop&q=80&w=1000", alt: "Biba Kurta" }],
        inventory: 80,
        modelConfig: { type: "dress", color: "#ff6b6b", brand: "biba" },
        ratings: { average: 4.6, count: 420 },
        specifications: { "Brand": "Biba", "Material": "Cotton Blend", "Style": "Ethnic" },
        reviews: [
            { user: "Anjali D.", rating: 5, comment: "Looks exactly like the picture. Very elegant." }
        ]
    },
    {
        title: "Nike Air Max 270",
        description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude. Featuring a massive visible Air unit in the heel.",
        price: 12995,
        categoryName: "Fashion & Apparel",
        subCategory: "Footwear",
        images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000", alt: "Nike Air Max" }],
        inventory: 60,
        modelConfig: { type: "shoe", color: "#ff0000", brand: "nike" },
        ratings: { average: 4.8, count: 2400 },
        specifications: { "Brand": "Nike", "Sole": "Foam Midsole" },
        reviews: [
            { user: "Karan B.", rating: 5, comment: "Extremely comfortable for daily walks and running." }
        ]
    },

    // Home, Kitchen, & Furniture
    {
        title: "Milton Thermosteel Flip Lid Flask",
        description: "1000ml vacuum insulated stainless steel flask. Keeps beverages hot or cold for 24 hours. Ideal for travel and office.",
        price: 999,
        categoryName: "Home, Kitchen, & Furniture",
        subCategory: "Kitchen & Dining",
        images: [{ url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1000", alt: "Milton Flask" }],
        inventory: 300,
        modelConfig: { type: "bottle", color: "#c0c0c0", brand: "milton" },
        ratings: { average: 4.4, count: 5600 },
        specifications: { "Brand": "Milton", "Capacity": "1000ml" },
        reviews: [
            { user: "Suresh N.", rating: 4, comment: "Keeps water cold for a long time. Build quality is solid." }
        ]
    },
    {
        title: "Godrej Interio Ergonomic Office Chair",
        description: "Premium ergonomic chair with lumbar support and adjustable armrests for maximum comfort during long working hours.",
        price: 8500,
        categoryName: "Home, Kitchen, & Furniture",
        subCategory: "Furniture",
        images: [{ url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000", alt: "Godrej Chair" }],
        inventory: 40,
        modelConfig: { type: "chair", color: "#000000", brand: "godrej" },
        ratings: { average: 4.5, count: 320 },
        specifications: { "Brand": "Godrej Interio", "Material": "Mesh", "Type": "Ergonomic" },
        reviews: [
            { user: "Manoj T.", rating: 5, comment: "Perfect for WFH. Back pain is gone!" }
        ]
    },

    // Health, Beauty, & Personal Care
    {
        title: "Mamaearth Onion Hair Oil",
        description: "Reduces hair fall and accelerates hair growth. Enriched with Red Onion Seed Oil Extract and REDENSYL.",
        price: 399,
        categoryName: "Health, Beauty, & Personal Care",
        subCategory: "Haircare",
        images: [{ url: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000", alt: "Mamaearth Oil" }],
        inventory: 200,
        modelConfig: { type: "bottle", color: "#8b4513", brand: "mamaearth" },
        ratings: { average: 4.3, count: 12000 },
        specifications: { "Brand": "Mamaearth", "Volume": "150ml" },
        reviews: [
            { user: "Neha J.", rating: 4, comment: "Smells a bit strong, but really helps with hair fall." }
        ]
    },
    {
        title: "MAC Retro Matte Lipstick - Ruby Woo",
        description: "The iconic lipstick that made M.A.C famous. A long-wearing formula with an intense, full-coverage matte finish.",
        price: 1950,
        categoryName: "Health, Beauty, & Personal Care",
        subCategory: "Makeup",
        images: [{ url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=1000", alt: "MAC Lipstick" }],
        inventory: 150,
        modelConfig: { type: "lipstick", color: "#d91e18", brand: "mac" },
        ratings: { average: 4.8, count: 3400 },
        specifications: { "Brand": "MAC", "Finish": "Matte" },
        reviews: [
            { user: "Riya M.", rating: 5, comment: "The best red lipstick ever. Classic shade!" }
        ]
    },

    // Groceries & Pantry
    {
        title: "Aashirvaad Select Premium Sharbati Atta (5kg)",
        description: "Made from 100% MP Sharbati wheat, offering the finest quality rotis that remain soft for a longer time.",
        price: 295,
        categoryName: "Groceries & Pantry",
        subCategory: "Staples",
        images: [{ url: "https://images.unsplash.com/photo-1574315042735-86640c3ffbc3?auto=format&fit=crop&q=80&w=1000", alt: "Atta" }],
        inventory: 500,
        modelConfig: { type: "box", color: "#f39c12", brand: "aashirvaad" },
        ratings: { average: 4.7, count: 4200 },
        specifications: { "Brand": "Aashirvaad", "Weight": "5kg" },
        reviews: [
            { user: "Sunita P.", rating: 5, comment: "Rotis are very soft and tasty. Always buy this brand." }
        ]
    },
    {
        title: "Tata Tea Gold (500g)",
        description: "A blend of Assam CTC teas with 15% gently rolled long leaves. A rich and aromatic tea experience.",
        price: 320,
        categoryName: "Groceries & Pantry",
        subCategory: "Beverages",
        images: [{ url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1000", alt: "Tata Tea" }],
        inventory: 450,
        modelConfig: { type: "box", color: "#d35400", brand: "tata" },
        ratings: { average: 4.6, count: 8900 },
        specifications: { "Brand": "Tata", "Weight": "500g" },
        reviews: [
            { user: "Ajay G.", rating: 5, comment: "Great aroma and strong taste for morning tea." }
        ]
    },

    // Toys, Hobbies, & Books
    {
        title: "LEGO Technic McLaren Senna GTR",
        description: "A stunning authentic replica of the iconic track-focused supercar. Features a V8 engine with moving pistons and dihedral doors.",
        price: 4999,
        categoryName: "Toys, Hobbies, & Books",
        subCategory: "Toys",
        images: [{ url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000", alt: "Lego McLaren" }],
        inventory: 45,
        modelConfig: { type: "car", color: "#3498db", brand: "lego" },
        ratings: { average: 4.9, count: 1850 },
        specifications: { "Brand": "LEGO", "Pieces": "830", "Age": "10+" },
        reviews: [
            { user: "Dhruv R.", rating: 5, comment: "Fun to build! The moving engine pistons look awesome." }
        ]
    },
    {
        title: "Atomic Habits by James Clear",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies focusing on tiny changes.",
        price: 450,
        categoryName: "Toys, Hobbies, & Books",
        subCategory: "Books",
        images: [{ url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000", alt: "Atomic Habits" }],
        inventory: 1200,
        modelConfig: { type: "book", color: "#ffffff", brand: "penguin" },
        ratings: { average: 4.9, count: 85000 },
        specifications: { "Brand": "Penguin Random House", "Format": "Paperback" },
        reviews: [
            { user: "Kavita S.", rating: 5, comment: "Life-changing book. Very practical advice." }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vertexia');
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('🗑️ Cleared existing products and categories');

        // Insert categories
        const insertedCategories = await Category.insertMany(categories);
        console.log(`✅ Inserted ${insertedCategories.length} categories`);

        const categoryMap = {};
        insertedCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Ensure at least one seller user exists
        let sellerUser = await User.findOne({ role: 'admin' });
        if (!sellerUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            sellerUser = await User.create({
                name: 'System Admin',
                email: 'admin@vertexia.ai',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Created System Admin user for product sellerId');
        }

        // Map category ObjectIds and SellerId to products
        const productsToInsert = seedProducts.map(prod => {
            const catId = categoryMap[prod.categoryName];
            delete prod.categoryName;
            return {
                ...prod,
                category: catId,
                sellerId: sellerUser._id
            };
        });

        await Product.insertMany(productsToInsert);
        console.log(`✅ Successfully seeded ${productsToInsert.length} diverse premium products with 3D models hints and reviews!`);

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
