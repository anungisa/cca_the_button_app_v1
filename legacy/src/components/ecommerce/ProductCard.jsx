import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { CartItem } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/hooks/use-toast';

export default function ProductCard({ product, onAddToCart }) {
  const { toast } = useToast();

  const addToCart = async () => {
    try {
      const user = await User.me();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Please Sign In",
          description: "You need to be signed in to add items to cart"
        });
        return;
      }

      // Check if item already exists in cart
      const existingItems = await CartItem.filter({ 
        user_id: user.id, 
        product_id: product.id 
      });

      if (existingItems.length > 0) {
        // Update quantity
        const existingItem = existingItems[0];
        await CartItem.update(existingItem.id, {
          quantity: existingItem.quantity + 1
        });
      } else {
        // Create new cart item
        await CartItem.create({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          price_at_time: product.price
        });
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`
      });

      onAddToCart && onAddToCart(product);

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {product.image_urls?.[0] ? (
          <img 
            src={product.image_urls[0]} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-brand-charcoal rounded-t-lg flex items-center justify-center">
            <Package className="w-12 h-12 text-brand-text-muted" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-brand-text-primary line-clamp-2">
            {product.name}
          </h3>
          {product.is_featured && (
            <Badge className="bg-brand-red text-white ml-2">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-brand-text-secondary mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-brand-text-primary">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-brand-text-muted ml-1">CAD</span>
          </div>
          
          {product.inventory_count !== null && product.inventory_count < 10 && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Only {product.inventory_count} left
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full mt-3 bg-brand-red hover:bg-red-700"
          onClick={addToCart}
          disabled={product.inventory_count === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inventory_count === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}