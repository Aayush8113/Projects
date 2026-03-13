const dishes = [
  // --- BOWLS ---
  {
    id: 1,
    name: "Veg Paella Bowl",
    price: 24,
    category: "Bowls",
    image: "/src/assets/dishes/image1.jpg",
    description: "Saffron-infused rice with garden-fresh vegetables and traditional Spanish spices.",
    rating: 4.8,
    reviews: 124,
    featured: true
  },
  {
    id: 19,
    name: "Mexican Rice Bowl",
    price: 23,
    category: "Bowls",
    image: "/src/assets/dishes/image19.webp",
    description: "Zesty lime rice topped with black beans, corn salsa, and fresh avocado.",
    rating: 4.6,
    reviews: 98,
    featured: false
  },
  {
    id: 20,
    name: "Peri Peri Paneer Bowl",
    price: 25,
    category: "Bowls",
    image: "/src/assets/dishes/image20.jpg",
    description: "Spicy peri-peri grilled paneer served over a bed of herbed pilaf.",
    rating: 4.7,
    reviews: 112,
    featured: true
  },
  {
    id: 49,
    name: "Thai Basil Rice Bowl",
    price: 26,
    category: "Bowls",
    image: "/src/assets/dishes/image49.jpg",
    description: "Fragrant jasmine rice with stir-fried veggies and aromatic Thai basil.",
    rating: 4.5,
    reviews: 85,
    featured: false
  },
  {
    id: 50,
    name: "Kung Pao Veggie Bowl",
    price: 27,
    category: "Bowls",
    image: "/src/assets/dishes/image50.jpg",
    description: "Classic Szechuan style bowl with peanuts, chilies, and crunchy vegetables.",
    rating: 4.4,
    reviews: 67,
    featured: false
  },
  {
    id: 51,
    name: "Italian Herb Pasta Bowl",
    price: 25,
    category: "Bowls",
    image: "/src/assets/dishes/image51.jpg",
    description: "Short pasta tossed in olive oil, sundried tomatoes, and fresh herbs.",
    rating: 4.6,
    reviews: 134,
    featured: false
  },
  {
    id: 52,
    name: "Teriyaki Veg Rice Bowl",
    price: 26,
    category: "Bowls",
    image: "/src/assets/dishes/image52.jpg",
    description: "Sweet and savory teriyaki glaze over steamed rice and broccoli.",
    rating: 4.3,
    reviews: 55,
    featured: false
  },
  {
    id: 53,
    name: "Mediterranean Quinoa Bowl",
    price: 28,
    category: "Bowls",
    image: "/src/assets/dishes/image53.jpg",
    description: "Quinoa, feta, olives, and cucumbers with a lemon-oregano vinaigrette.",
    rating: 4.9,
    reviews: 142,
    featured: true
  },

  // --- PIZZA ---
  {
    id: 2,
    name: "Margherita Cheese Pizza",
    price: 22,
    category: "Pizza",
    image: "/src/assets/dishes/image2.jpeg",
    description: "Classic hand-stretched dough with San Marzano tomatoes and fresh buffalo mozzarella.",
    rating: 4.9,
    reviews: 310,
    featured: true
  },
  {
    id: 3,
    name: "Paneer Tandoori Pizza",
    price: 26,
    category: "Pizza",
    image: "/src/assets/dishes/image3.png",
    description: "Indo-Italian fusion topped with clay-oven roasted paneer and spicy makhani sauce.",
    rating: 4.7,
    reviews: 89,
    featured: false
  },
  {
    id: 4,
    name: "Veggie Supreme Pizza",
    price: 25,
    category: "Pizza",
    image: "/src/assets/dishes/image4.jpg",
    description: "A garden explosion of bell peppers, olives, mushrooms, and sweet corn.",
    rating: 4.5,
    reviews: 215,
    featured: false
  },
  {
    id: 21,
    name: "Farmhouse Loaded Pizza",
    price: 28,
    category: "Pizza",
    image: "/src/assets/dishes/image21.avif",
    description: "Rustic pizza loaded with mushrooms, onions, tomatoes, and jalapenos.",
    rating: 4.8,
    reviews: 176,
    featured: true
  },
  {
    id: 22,
    name: "Double Cheese Burst Pizza",
    price: 30,
    category: "Pizza",
    image: "/src/assets/dishes/image22.jpg",
    description: "An indulgence of liquid cheese inside the crust and extra mozzarella on top.",
    rating: 4.9,
    reviews: 420,
    featured: true
  },

  // --- PASTA ---
  {
    id: 5,
    name: "Creamy Alfredo Pasta",
    price: 20,
    category: "Pasta",
    image: "/src/assets/dishes/image5.jpg",
    description: "Silky Fettuccine tossed in a rich parmesan cream sauce with a hint of garlic.",
    rating: 4.8,
    reviews: 156,
    featured: true
  },
  {
    id: 6,
    name: "Penne Arrabbiata",
    price: 18,
    category: "Pasta",
    image: "/src/assets/dishes/image6.jpg",
    description: "Fiery tomato sauce with garlic, red chili flakes, and fresh parsley.",
    rating: 4.4,
    reviews: 132,
    featured: false
  },
  {
    id: 7,
    name: "Pesto Basil Pasta",
    price: 21,
    category: "Pasta",
    image: "/src/assets/dishes/image7.jpg",
    description: "Fresh basil pesto, pine nuts, and aged parmesan over al dente pasta.",
    rating: 4.7,
    reviews: 187,
    featured: true
  },
  {
    id: 23,
    name: "Four Cheese Pasta",
    price: 24,
    category: "Pasta",
    image: "/src/assets/dishes/image23.jpg",
    description: "A blend of Mozzarella, Parmesan, Cheddar, and Fontina for the ultimate comfort.",
    rating: 4.8,
    reviews: 95,
    featured: false
  },
  {
    id: 24,
    name: "Spinach Alfredo Pasta",
    price: 22,
    category: "Pasta",
    image: "/src/assets/dishes/image24.jpg",
    description: "Nutritious spinach folded into our signature creamy alfredo sauce.",
    rating: 4.5,
    reviews: 78,
    featured: false
  },

  // --- BURGER & SANDWICH ---
  {
    id: 13,
    name: "Veg Cheese Burger",
    price: 19,
    category: "Burger",
    image: "/src/assets/dishes/image13.jpg",
    description: "Crispy patty with molten cheese, lettuce, and our secret house sauce.",
    rating: 4.6,
    reviews: 245,
    featured: true
  },
  {
    id: 14,
    name: "Paneer Loaded Burger",
    price: 22,
    category: "Burger",
    image: "/src/assets/dishes/image14.jpg",
    description: "Thick grilled paneer slab with spicy mayo and caramelized onions.",
    rating: 4.7,
    reviews: 167,
    featured: false
  },
  {
    id: 31,
    name: "Classic Veg Burger",
    price: 17,
    category: "Burger",
    image: "/src/assets/dishes/image31.jpg",
    description: "Traditional potato and peas patty with fresh veggies and toasted buns.",
    rating: 4.3,
    reviews: 120,
    featured: false
  },
  {
    id: 32,
    name: "Paneer Crunch Burger",
    price: 20,
    category: "Burger",
    image: "/src/assets/dishes/image32.jpg",
    description: "Panko-crusted paneer patty with a satisfying crunch in every bite.",
    rating: 4.5,
    reviews: 89,
    featured: false
  },
  {
    id: 15,
    name: "Classic Veg Sandwich",
    price: 14,
    category: "Sandwich",
    image: "/src/assets/dishes/image15.jpg",
    description: "Fresh cucumber, tomato, and mint chutney on soft buttered bread.",
    rating: 4.2,
    reviews: 110,
    featured: false
  },
  {
    id: 16,
    name: "Grilled Paneer Sandwich",
    price: 18,
    category: "Sandwich",
    image: "/src/assets/dishes/image16.jpg",
    description: "Spiced paneer filling pressed until golden and crispy.",
    rating: 4.5,
    reviews: 143,
    featured: false
  },
  {
    id: 33,
    name: "Mayo Veg Sandwich",
    price: 16,
    category: "Sandwich",
    image: "/src/assets/dishes/image33.jpg",
    description: "Creamy coleslaw and veggie filling in a perfectly toasted sandwich.",
    rating: 4.4,
    reviews: 87,
    featured: false
  },
  {
    id: 34,
    name: "Triple Layer Veg Sandwich",
    price: 19,
    category: "Sandwich",
    image: "/src/assets/dishes/image34.jpg",
    description: "Three layers of fillings including cheese, veggies, and spicy chutney.",
    rating: 4.7,
    reviews: 132,
    featured: true
  },

  // --- WRAPS ---
  {
    id: 17,
    name: "Veg Burrito Wrap",
    price: 20,
    category: "Wraps",
    image: "/src/assets/dishes/image17.jpg",
    description: "Mexican style wrap with rice, beans, salsa, and sour cream.",
    rating: 4.5,
    reviews: 95,
    featured: false
  },
  {
    id: 18,
    name: "Paneer Shawarma Wrap",
    price: 21,
    category: "Wraps",
    image: "/src/assets/dishes/image18.webp",
    description: "Lebanese inspired wrap with garlic sauce and pickled veggies.",
    rating: 4.6,
    reviews: 118,
    featured: true
  },
  {
    id: 35,
    name: "Mexican Tortilla Wrap",
    price: 22,
    category: "Wraps",
    image: "/src/assets/dishes/image35.jpg",
    description: "Crispy tortilla filled with beans, cheese, and spicy Mexican herbs.",
    rating: 4.4,
    reviews: 67,
    featured: false
  },
  {
    id: 36,
    name: "Paneer Tikka Wrap",
    price: 24,
    category: "Wraps",
    image: "/src/assets/dishes/image36.jpg",
    description: "Char-grilled paneer tikka with mint mayo and onions wrapped in a paratha.",
    rating: 4.8,
    reviews: 154,
    featured: true
  },

  // --- SNACKS & STARTERS ---
  {
    id: 8,
    name: "Crispy Masala Fries",
    price: 12,
    category: "Snacks",
    image: "/src/assets/dishes/image8.jpg",
    description: "Golden fries tossed in a spicy house-made peri-peri masala.",
    rating: 4.7,
    reviews: 320,
    featured: true
  },
  {
    id: 9,
    name: "Honey Chili Potato",
    price: 16,
    category: "Snacks",
    image: "/src/assets/dishes/image9.jpg",
    description: "Crispy potato fingers glazed in a sweet and spicy honey chili sauce.",
    rating: 4.5,
    reviews: 210,
    featured: false
  },
  {
    id: 10,
    name: "Veg Momos Drizzle",
    price: 15,
    category: "Snacks",
    image: "/src/assets/dishes/image10.jpg",
    description: "Steamed dumplings served with a fiery red chutney drizzle.",
    rating: 4.6,
    reviews: 289,
    featured: true
  },
  {
    id: 25,
    name: "Chili Garlic Noodles",
    price: 18,
    category: "Snacks",
    image: "/src/assets/dishes/image25.jpg",
    description: "Wok-tossed noodles with burnt garlic and spicy red chilies.",
    rating: 4.4,
    reviews: 145,
    featured: false
  },
  {
    id: 26,
    name: "Veg Spring Rolls",
    price: 16,
    category: "Snacks",
    image: "/src/assets/dishes/image26.jpg",
    description: "Crunchy golden pastry shells filled with seasoned vegetables.",
    rating: 4.3,
    reviews: 112,
    featured: false
  },
  {
    id: 27,
    name: "Schezwan Paneer Momos",
    price: 20,
    category: "Snacks",
    image: "/src/assets/dishes/image27.jpg",
    description: "Dumplings stuffed with spicy paneer and tossed in Schezwan sauce.",
    rating: 4.7,
    reviews: 134,
    featured: false
  },
  {
    id: 37,
    name: "Veg Garlic Bread",
    price: 12,
    category: "Snacks",
    image: "/src/assets/dishes/image37.jpg",
    description: "Toasted baguette slices with garlic butter and fresh herbs.",
    rating: 4.4,
    reviews: 95,
    featured: false
  },
  {
    id: 38,
    name: "Cheese Burst Garlic Bread",
    price: 15,
    category: "Snacks",
    image: "/src/assets/dishes/image38.jpg",
    description: "Garlic bread overflowing with a blend of melted cheeses.",
    rating: 4.8,
    reviews: 203,
    featured: true
  },
  {
    id: 11,
    name: "Tandoori Paneer Tikka",
    price: 22,
    category: "Starters",
    image: "/src/assets/dishes/image11.jpg",
    description: "Classic marinated paneer cubes roasted in a traditional clay oven.",
    rating: 4.9,
    reviews: 345,
    featured: true
  },
  {
    id: 12,
    name: "Crispy Corn Delight",
    price: 17,
    category: "Starters",
    image: "/src/assets/dishes/image12.jpg",
    description: "Deep-fried sweet corn kernels tossed with onions and green chilies.",
    rating: 4.5,
    reviews: 167,
    featured: false
  },
  {
    id: 28,
    name: "Stuffed Mushroom Tikka",
    price: 24,
    category: "Starters",
    image: "/src/assets/dishes/image28.jpg",
    description: "Juicy mushrooms stuffed with cheese and grilled to perfection.",
    rating: 4.7,
    reviews: 88,
    featured: false
  },
  {
    id: 29,
    name: "Harabhara Kebab",
    price: 18,
    category: "Starters",
    image: "/src/assets/dishes/image29.jpg",
    description: "Nutritious green patties made with spinach, peas, and potatoes.",
    rating: 4.6,
    reviews: 123,
    featured: false
  },
  {
    id: 30,
    name: "Crispy Veg Pops",
    price: 15,
    category: "Starters",
    image: "/src/assets/dishes/image30.jpg",
    description: "Bite-sized vegetable fritters served with a tangy dip.",
    rating: 4.2,
    reviews: 94,
    featured: false
  },

  // --- DRINKS ---
  {
    id: 39,
    name: "Fresh Lime Soda",
    price: 10,
    category: "Drinks",
    image: "/src/assets/dishes/image39.jpg",
    description: "Refreshing soda with fresh lime, mint, and a choice of sweet or salt.",
    rating: 4.8,
    reviews: 412,
    featured: true
  },
  {
    id: 40,
    name: "Strawberry Milkshake",
    price: 14,
    category: "Drinks",
    image: "/src/assets/dishes/image40.jpg",
    description: "Thick and creamy shake made with real strawberries and vanilla ice cream.",
    rating: 4.6,
    reviews: 156,
    featured: false
  },
  {
    id: 41,
    name: "Cold Coffee Frappe",
    price: 16,
    category: "Drinks",
    image: "/src/assets/dishes/image41.jpg",
    description: "Blended iced coffee topped with chocolate drizzle and whipped cream.",
    rating: 4.7,
    reviews: 234,
    featured: true
  },
  {
    id: 42,
    name: "Mango Smoothie",
    price: 15,
    category: "Drinks",
    image: "/src/assets/dishes/image42.jpg",
    description: "Tropical goodness in a glass made with fresh Alphonso mangoes.",
    rating: 4.5,
    reviews: 189,
    featured: false
  },
  {
    id: 43,
    name: "Blue Lagoon Mocktail",
    price: 18,
    category: "Drinks",
    image: "/src/assets/dishes/image43.jpg",
    description: "A vibrant citrusy mocktail that looks as good as it tastes.",
    rating: 4.4,
    reviews: 92,
    featured: false
  },
  {
    id: 54,
    name: "Watermelon Cooler",
    price: 12,
    category: "Drinks",
    image: "/src/assets/dishes/image54.jpg",
    description: "Pure watermelon juice with a hint of black salt and mint.",
    rating: 4.8,
    reviews: 167,
    featured: true
  },
  {
    id: 55,
    name: "Kiwi Mojito",
    price: 14,
    category: "Drinks",
    image: "/src/assets/dishes/image55.jpg",
    description: "Kiwi chunks and muddled mint with soda and lime.",
    rating: 4.5,
    reviews: 84,
    featured: false
  },
  {
    id: 56,
    name: "Chocolate Milkshake",
    price: 15,
    category: "Drinks",
    image: "/src/assets/dishes/image56.jpg",
    description: "Rich dark chocolate blended with milk and cocoa solids.",
    rating: 4.7,
    reviews: 210,
    featured: false
  },

  // --- DESSERTS ---
  {
    id: 44,
    name: "Choco Lava Cake",
    price: 12,
    category: "Desserts",
    image: "/src/assets/dishes/image44.jpg",
    description: "Warm chocolate cake with a molten center, served with vanilla scoop.",
    rating: 4.9,
    reviews: 567,
    featured: true
  },
  {
    id: 45,
    name: "Vanilla Ice Cream Scoop",
    price: 8,
    category: "Desserts",
    image: "/src/assets/dishes/image45.jpg",
    description: "Double bean vanilla ice cream, classic and creamy.",
    rating: 4.4,
    reviews: 120,
    featured: false
  },
  {
    id: 46,
    name: "Oreo Brownie Fudge",
    price: 14,
    category: "Desserts",
    image: "/src/assets/dishes/image46.jpg",
    description: "Fudgy brownie loaded with Oreo chunks and hot chocolate fudge.",
    rating: 4.8,
    reviews: 234,
    featured: true
  },
  {
    id: 47,
    name: "Classic Cheesecake",
    price: 16,
    category: "Desserts",
    image: "/src/assets/dishes/image47.jpg",
    description: "New York style cheesecake with a buttery graham cracker crust.",
    rating: 4.7,
    reviews: 189,
    featured: false
  },
  {
    id: 48,
    name: "Fruit Custard Cup",
    price: 10,
    category: "Desserts",
    image: "/src/assets/dishes/image48.jpg",
    description: "Chilled vanilla custard with a mix of seasonal fresh fruits.",
    rating: 4.3,
    reviews: 95,
    featured: false
  },
  {
    id: 57,
    name: "Red Velvet Pastry",
    price: 13,
    category: "Desserts",
    image: "/src/assets/dishes/image57.jpg",
    description: "Velvety sponge with cream cheese frosting and cocoa hints.",
    rating: 4.6,
    reviews: 142,
    featured: false
  },
  {
    id: 58,
    name: "Butterscotch Ice Cream",
    price: 9,
    category: "Desserts",
    image: "/src/assets/dishes/image58.jpg",
    description: "Crunchy butterscotch praline in smooth creamy ice cream.",
    rating: 4.5,
    reviews: 88,
    featured: false
  },

  // --- HIGH PROTEIN ---
  {
    id: 59,
    name: "High-Protein Buddha Bowl",
    price: 28,
    category: "High-Protein",
    image: "/src/assets/dishes/image59.jpg",
    description: "Quinoa base with roasted chickpeas, edamame, and a tahini lemon dressing.",
    rating: 4.9,
    reviews: 92,
    featured: true
  },
  {
    id: 60,
    name: "Paneer Power Bowl",
    price: 26,
    category: "High-Protein",
    image: "/src/assets/dishes/image60.jpg",
    description: "Grilled paneer cubes served over brown rice with sautéed greens.",
    rating: 4.7,
    reviews: 74,
    featured: false
  },
  {
    id: 61,
    name: "Tofu Teriyaki Protein Bowl",
    price: 27,
    category: "High-Protein",
    image: "/src/assets/dishes/image61.jpg",
    description: "Firm tofu glazed in teriyaki sauce with steamed broccoli and brown rice.",
    rating: 4.5,
    reviews: 63,
    featured: false
  },
  {
    id: 62,
    name: "Chickpea Protein Salad",
    price: 20,
    category: "High-Protein",
    image: "/src/assets/dishes/image62.jpg",
    description: "A hearty mix of chickpeas, sprouts, and colorful vegetables in lime dressing.",
    rating: 4.6,
    reviews: 81,
    featured: false
  },
  {
    id: 63,
    name: "Protein Veggie Wrap",
    price: 22,
    category: "High-Protein",
    image: "/src/assets/dishes/image63.jpg",
    description: "Soya chunks and mixed veggies wrapped in a high-fiber tortilla.",
    rating: 4.4,
    reviews: 58,
    featured: false
  },
  {
    id: 64,
    name: "Lentil & Quinoa Super Bowl",
    price: 25,
    category: "High-Protein",
    image: "/src/assets/dishes/image64.jpg",
    description: "Sprouted lentils and fluffy quinoa with a punch of Mediterranean herbs.",
    rating: 4.8,
    reviews: 105,
    featured: true
  },
];

export default dishes;