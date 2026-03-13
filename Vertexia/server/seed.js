const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Load environment variables
dotenv.config();

// Important models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_vertex';

const categoriesData = [
    { name: 'Sneakers', slug: 'sneakers', description: 'Premium and limited edition sneakers.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' },
    { name: 'Streetwear Classics', slug: 'streetwear-classics', description: 'Iconic apparel for everyday style.', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Accessories', slug: 'accessories', description: 'Caps, bags, and luxury accessories.', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' }
];

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Database Connected.');

        // Clear existing data
        console.log('Clearing old data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({});
        await Order.deleteMany({});

        console.log('Dropping legacy indices...');
        await Product.collection.dropIndex("id_1").catch(e => console.log('No id_1 index to drop'));

        // 1. Create Users
        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@vertex.com',
            password: hashedPassword,
            role: 'admin'
        });

        const seller = await User.create({
            name: 'Vertex Electronics Seller',
            email: 'seller@vertex.com',
            password: hashedPassword,
            role: 'seller'
        });

        const buyer = await User.create({
            name: 'Example Buyer',
            email: 'buyer@vertex.com',
            password: hashedPassword,
            role: 'buyer'
        });

        // 2. Create Categories
        console.log('Creating categories...');
        const createdCategories = await Category.insertMany(categoriesData);

        // 3. Create Products
        console.log('Creating 20+ realistic products...');
        const productInfos = [
            { title: "Nike Air Force 1 '07", brand: "Nike", price: 110, category: "Sneakers", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" },
            { title: "Adidas Ultraboost 22", brand: "Adidas", price: 190, category: "Sneakers", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80" },
            { title: "Puma RS-X3 Puzzle", brand: "Puma", price: 110, category: "Sneakers", img: "https://images.unsplash.com/photo-1606890658317-7d14490b76fc?auto=format&fit=crop&w=800&q=80" },
            { title: "New Balance 990v5 Core", brand: "New Balance", price: 185, category: "Sneakers", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80" },
            { title: "Vans Old Skool Classic", brand: "Vans", price: 70, category: "Sneakers", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80" },
            { title: "Nike Dunk Low Retro", brand: "Nike", price: 115, category: "Sneakers", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80" },
            { title: "Air Jordan 4 Retro", brand: "Nike", price: 210, category: "Sneakers", img: "https://images.unsplash.com/photo-1579338908476-3a3a1d71a706?auto=format&fit=crop&w=800&q=80" },
            { title: "Converse Chuck Taylor All Star", brand: "Converse", price: 65, category: "Sneakers", img: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=800&q=80" },
            { title: "Asics Gel-Kayano 29", brand: "Asics", price: 160, category: "Sneakers", img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80" },
            { title: "Reebok Club C 85 Vintage", brand: "Reebok", price: 85, category: "Sneakers", img: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?auto=format&fit=crop&w=800&q=80" },
            { title: "Nike Air Max 97", brand: "Nike", price: 175, category: "Sneakers", img: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80" },
            { title: "Adidas NMD_R1", brand: "Adidas", price: 150, category: "Sneakers", img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80" },
            { title: "Salomon XT-6", brand: "Salomon", price: 200, category: "Sneakers", img: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80" },
            { title: "Balenciaga Triple S", brand: "Balenciaga", price: 1050, category: "Sneakers", img: "https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&w=800&q=80" },
            { title: "Hoka One One Clifton 8", brand: "Hoka", price: 140, category: "Sneakers", img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80" },
            { title: "On Running Cloudnova", brand: "On", price: 160, category: "Sneakers", img: "https://images.unsplash.com/photo-1584735174965-48c48d7edce7?auto=format&fit=crop&w=800&q=80" },
            { title: "Timberland 6-Inch Premium", brand: "Timberland", price: 210, category: "Sneakers", img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80" },
            { title: "Dr. Martens 1460", brand: "Dr. Martens", price: 170, category: "Sneakers", img: "https://images.unsplash.com/photo-1499554030799-7f310aa82305?auto=format&fit=crop&w=800&q=80" },
            { title: "Gucci Ace Sneaker", brand: "Gucci", price: 750, category: "Sneakers", img: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=800&q=80" },
            { title: "Off-White Out Of Office", brand: "Off-White", price: 635, category: "Sneakers", img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80" },
            { title: "Nike Air Zoom Pegasus 39", brand: "Nike", price: 130, category: "Sneakers", img: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80" },
            { title: "Adidas Stan Smith", brand: "Adidas", price: 100, category: "Sneakers", img: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80" }
        ];

        const productsData = productInfos.map((p) => ({
            id: new mongoose.Types.ObjectId().toString(),
            title: p.title,
            description: `Experience premium comfort and style with the ${p.title}. Authentic, verified, and ready to ship.`,
            price: p.price,
            discountedPrice: p.price,
            category: createdCategories[0]._id, // Sneakers
            sellerId: seller._id,
            inventory: Math.floor(Math.random() * 100) + 10,
            images: [{ url: p.img }],
            specifications: { Brand: p.brand },
            ratings: { average: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), count: Math.floor(Math.random() * 500) + 50 }
        }));

        await Product.insertMany(productsData);

        console.log(`\n✅ Successfully seeded 3 Users, ${createdCategories.length} Categories, and ${productsData.length} Products.`);

        console.log(`\n✅ Successfully seeded 3 Users, ${createdCategories.length} Categories, and ${productsData.length} Products.`);
        console.log('\n--- Production Ready ---');
        console.log('Seeding complete. Use established credentials to login.');
        console.log('-------------------------\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
