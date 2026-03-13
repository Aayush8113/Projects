import axios from 'axios';

// Utility to process user messages and return an appropriate response
export const processChatMessage = async (message, context) => {
    const { user, cart } = context;
    const lowerMsg = message.toLowerCase();

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good evening)/.test(lowerMsg)) {
        const nameMsg = user?.name ? ` ${user.name}` : '';
        return `Hello${nameMsg}! I'm Vertexia AI, your premium shopping assistant. How can I help you today?`;
    }

    // 2. Cart Inquiry
    if (/(cart|basket|what.*in.*cart|my items)/.test(lowerMsg)) {
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return "Your cart is currently empty. Would you like me to recommend some products to get started?";
        }
        const itemCount = cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalAmount = cart.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        let response = `You have ${itemCount} item(s) in your cart, totaling $${totalAmount.toFixed(2)}. \n\n`;
        response += "Here are the items:\n";
        cart.cartItems.slice(0, 3).forEach(item => {
            response += `- ${item.name} (x${item.quantity})\n`;
        });

        if (cart.cartItems.length > 3) {
            response += `...and ${cart.cartItems.length - 3} more.`;
        }

        return response;
    }

    // 3. Checkout / Payment
    if (/(checkout|pay|buy now|purchase)/.test(lowerMsg)) {
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return "You need to add some items to your cart before you can checkout! What are you looking for today?";
        }
        if (!user) {
            return "Please log in or create an account to proceed to checkout. You can navigate to the cart page to continue.";
        }
        return "Great! You can proceed to checkout by clicking on the Cart icon and selecting 'Go to Checkout'. Let me know if you need help with payment options!";
    }

    // 4. Product Recommendations
    if (/(recommend|suggest|show me|looking for|find|products)/.test(lowerMsg)) {
        return await fetchProductRecommendations(lowerMsg);
    }

    // 5. Order Status / History
    if (/(order|track|where is my.*order|history)/.test(lowerMsg)) {
        if (!user) {
            return "Please log in to check your order history or track your current orders.";
        }
        return "You can view your current orders and their status in your Dashboard > Orders section. Is there a specific order you need help with?";
    }

    // 6. Help / FAQ
    if (/(help|shipping|refund|return policy|support)/.test(lowerMsg)) {
        return "Here is some helpful information:\n- **Shipping**: We offer free premium shipping on all orders over $100.\n- **Returns**: You can return any item within 30 days of receipt.\n- **Support**: If you need human assistance, please reach out to support@vertexia.com.";
    }

    // Default Fallback
    return "I'm still learning and might not understand that completely. I can help you check your cart, find product recommendations, or answer questions about our policies! What would you like to do?";
};

// Helper function to fetch products based on a simple heuristic
const fetchProductRecommendations = async (query) => {
    try {
        // Find a matching category keyword in the query (simple keyword extraction)
        const categories = ['electronics', 'clothing', 'home', 'shoes', 'accessories'];
        const matchedCategory = categories.find(cat => query.includes(cat));

        let url = 'http://localhost:5000/api/products';
        if (matchedCategory) {
            url += `?category=${matchedCategory}`;
        }

        const response = await axios.get(url);
        const products = response.data.products || response.data; // Depending on API res structure

        if (!products || products.length === 0) {
            return "I couldn't find any specific products matching that right now. We regularly update our catalog, so please check back later or try a different category!";
        }

        // Recommend top 3 products
        const topProducts = products.slice(0, 3);
        let reply = matchedCategory
            ? `Here are some highly-rated ${matchedCategory} options you might like:\n\n`
            : "Here are some of our top products I recommend:\n\n";

        topProducts.forEach((p, index) => {
            reply += `${index + 1}. **${p.name}** - $${p.price}\n   ${p.description ? p.description.substring(0, 50) + '...' : ''}\n`;
        });

        reply += "\nFeel free to explore these on our Products page!";
        return reply;

    } catch (error) {
        console.error("Chatbot product fetch error:", error);
        return "I'm having a little trouble connecting to our product catalog right now. Please try again in a moment!";
    }
};
