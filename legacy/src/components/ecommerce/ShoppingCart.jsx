import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart as CartIcon, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Package
} from 'lucide-react';
import { CartItem } from '@/api/entities';
import { Product } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/hooks/use-toast';

export default function ShoppingCart({ isOpen, onClose, onCheckout }) {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      if (!user) return;

      // Load cart items for current user
      const items = await CartItem.filter({ user_id: user.id });
      setCartItems(items);

      // Load product details for each cart item
      const productIds = [...new Set(items.map(item => item.product_id))];
      const productPromises = productIds.map(id => Product.filter({ id }));
      const productResults = await Promise.all(productPromises);
      
      const productsMap = {};
      productResults.forEach(products => {
        products.forEach(product => {
          productsMap[product.id] = product;
        });
      });
      setProducts(productsMap);

    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      await CartItem.update(itemId, { quantity: newQuantity });
      setCartItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item quantity"
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      await CartItem.delete(itemId);
      setCartItems(items => items.filter(item => item.id !== itemId));
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.product_id];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTax = (subtotal) => {
    // Simplified tax calculation - 13% HST for Ontario
    return subtotal * 0.13;
  };

  const subtotal = calculateTotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CartIcon className="w-5 h-5" />
            Shopping Cart ({cartItems.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
                <p className="mt-2 text-brand-text-secondary">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-brand-text-muted mx-auto mb-4" />
                <p className="text-brand-text-secondary">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => {
                  const product = products[item.product_id];
                  if (!product) return null;

                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-brand-charcoal rounded-lg">
                      {product.image_urls?.[0] && (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-brand-text-primary">{product.name}</h4>
                        <p className="text-sm text-brand-text-secondary">
                          ${product.price.toFixed(2)} CAD
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              <Separator />
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-secondary">Subtotal</span>
                  <span className="text-brand-text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-secondary">Tax (HST)</span>
                  <span className="text-brand-text-primary">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-brand-text-primary">Total</span>
                  <span className="text-brand-text-primary">${total.toFixed(2)} CAD</span>
                </div>
                <Button 
                  className="w-full bg-brand-red hover:bg-red-700"
                  onClick={() => onCheckout(cartItems, total)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}