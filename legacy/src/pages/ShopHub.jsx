import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart as CartIcon, 
  Search, 
  Star,
  Package,
  Shirt,
  Trophy,
  Ticket
} from 'lucide-react';
import { Product } from '@/api/entities';
import { useXP } from '../components/XPContext';
import ProductCard from '../components/ecommerce/ProductCard';
import ShoppingCart from '../components/ecommerce/ShoppingCart';
import Checkout from '../components/ecommerce/Checkout';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopHub() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const { user } = useXP();

  // Mock product data for demonstration and fallback
  const mockProducts = [
    {
      id: 'prod_1',
      name: 'Team Canada Curling Jacket',
      description: 'Official Team Canada curling jacket with moisture-wicking fabric and team logo.',
      category: 'merchandise',
      price: 89.99,
      image_urls: ['https://images.unsplash.com/photo-1544966503-7cc36a8def8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: true,
      inventory_count: 15,
      tags: ['team-canada', 'jacket', 'official'],
      vendor: 'Curling Canada'
    },
    {
      id: 'prod_2', 
      name: 'Professional Curling Stone Set',
      description: 'Premium granite curling stones meeting WCF specifications. Set of 8 stones.',
      category: 'equipment',
      price: 2499.99,
      image_urls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: true,
      inventory_count: 3,
      shipping_required: true,
      weight_grams: 20000,
      tags: ['stones', 'professional', 'granite'],
      vendor: 'Trefor Granite'
    },
    {
      id: 'prod_3',
      name: 'Curling+ Annual Subscription',
      description: 'Stream all major curling events in HD with exclusive content and behind-the-scenes access.',
      category: 'subscription',
      price: 49.99,
      image_urls: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: false,
      inventory_count: null,
      shipping_required: false,
      tags: ['streaming', 'subscription', 'digital'],
      vendor: 'Curling Canada'
    },
    {
      id: 'prod_4',
      name: 'Granite Circle Badge Pin Set',
      description: 'Collectible pin set featuring all Granite Circle tier badges. Perfect for displaying your curling journey.',
      category: 'merchandise',
      price: 24.99,
      image_urls: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: false,
      inventory_count: 47,
      tags: ['pins', 'collectible', 'granite-circle'],
      vendor: 'Curling Canada'
    },
    {
      id: 'prod_5',
      name: 'Brier 2024 Championship Ticket',
      description: 'Premium seating for the Montana\'s Brier championship draws. Includes access to hospitality lounge.',
      category: 'event_ticket',
      price: 125.00,
      image_urls: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: true,
      inventory_count: 89,
      shipping_required: false,
      tags: ['brier', 'championship', 'premium'],
      vendor: 'Curling Canada'
    },
    {
      id: 'prod_6',
      name: 'Smart Broom Training Kit',
      description: 'Complete training package with Smart Broom sensor, app access, and coaching materials.',
      category: 'equipment',
      price: 299.99,
      image_urls: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'],
      is_featured: false,
      inventory_count: 12,
      tags: ['smart-broom', 'training', 'technology'],
      vendor: 'Smart Broom Technologies'
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let productList = [];
      try {
        productList = await Product.list();
        console.log('Successfully loaded products from database.');
      } catch (error) {
        console.warn('Failed to load products from database, falling back to mock data:', error.message);
        productList = mockProducts;
      }
      
      setProducts(productList);
    } catch (error) {
      console.error('Critical error setting products:', error);
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product, quantity) => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    setShowCart(true);
  };

  const handleCheckout = (cartItems, total) => {
    setCheckoutData({ cartItems, total });
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (orderNumber) => {
    setShowCheckout(false);
    setCheckoutData(null);
    alert(`Your order #${orderNumber} has been placed successfully!`);
  };

  if (showCheckout && checkoutData) {
    return (
      <Checkout
        cartItems={checkoutData.cartItems}
        total={checkoutData.total}
        onSuccess={handleOrderSuccess}
        onCancel={() => {
          setShowCheckout(false);
          setCheckoutData(null);
        }}
      />
    );
  }

  const categories = [
    { value: 'all', label: 'All Products', icon: Package },
    { value: 'merchandise', label: 'Merchandise', icon: Shirt },
    { value: 'equipment', label: 'Equipment', icon: Trophy },
    { value: 'subscription', label: 'Subscriptions', icon: Star },
    { value: 'event_ticket', label: 'Event Tickets', icon: Ticket }
  ];

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Shop Hub</h1>
          <p className="text-brand-text-secondary mt-2">
            Official curling merchandise, equipment, and experiences
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowCart(true)}
          className="relative bg-brand-card-bg text-brand-text-primary border-brand-border hover:bg-brand-charcoal"
        >
          <CartIcon className="w-5 h-5 mr-2" />
          Cart
        </Button>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary focus-visible:ring-brand-red focus-visible:ring-offset-0"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-brand-charcoal border-brand-border text-brand-text-primary focus:ring-brand-red focus:ring-offset-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-brand-card-bg border-brand-border">
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value} className="text-brand-text-primary hover:bg-brand-charcoal">
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-brand-text-secondary" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-brand-charcoal border-brand-border text-brand-text-primary focus:ring-brand-red focus:ring-offset-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-brand-card-bg border-brand-border">
                <SelectItem value="featured" className="text-brand-text-primary hover:bg-brand-charcoal">Featured</SelectItem>
                <SelectItem value="price_low" className="text-brand-text-primary hover:bg-brand-charcoal">Price: Low to High</SelectItem>
                <SelectItem value="price_high" className="text-brand-text-primary hover:bg-brand-charcoal">Price: High to Low</SelectItem>
                <SelectItem value="name" className="text-brand-text-primary hover:bg-brand-charcoal">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <Card key={index} className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-brand-charcoal rounded mb-4"></div>
                  <div className="h-4 bg-brand-charcoal rounded mb-2"></div>
                  <div className="h-3 bg-brand-charcoal rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-brand-charcoal rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchTerm}-${sortBy}`} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  currentUserTier={user?.loyaltyData?.tier}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
            No products found
          </h3>
          <p className="text-brand-text-secondary">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
        userId={user?.id}
      />
    </div>
  );
}