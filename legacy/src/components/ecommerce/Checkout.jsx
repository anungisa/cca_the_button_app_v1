import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Package, MapPin, ArrowLeft } from 'lucide-react';
import PaymentProcessor from '../payments/PaymentProcessor';
import { Order } from '@/api/entities';
import { CartItem } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/hooks/use-toast';

export default function Checkout({ cartItems, total, onSuccess, onCancel }) {
  const [currentStep, setCurrentStep] = useState('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'CA'
  });
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'CA'
  });
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);
  const { toast } = useToast();

  const handleAddressChange = (type, field, value) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (billingMatchesShipping) {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePaymentSuccess = async (purchase) => {
    setIsProcessing(true);
    try {
      const user = await User.me();
      
      // Create order record
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name || 'Product',
        quantity: item.quantity,
        price: item.price_at_time,
        total: item.price_at_time * item.quantity
      }));

      const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.13; // 13% HST
      
      await Order.create({
        order_number: orderNumber,
        user_id: user.id,
        status: 'processing',
        items: orderItems,
        subtotal,
        tax_amount: tax,
        total_amount: total,
        shipping_address: shippingAddress,
        billing_address: billingMatchesShipping ? shippingAddress : billingAddress,
        payment_method: purchase.payment_method,
        payment_status: 'paid',
        stripe_payment_intent_id: purchase.stripe_payment_intent_id
      });

      // Clear cart
      for (const item of cartItems) {
        await CartItem.delete(item.id);
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been confirmed.`
      });

      onSuccess && onSuccess(orderNumber);

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        variant: "destructive",
        title: "Order Error",
        description: "There was an issue processing your order. Please contact support."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const AddressForm = ({ address, onChange, title }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={address.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="address1">Address Line 1</Label>
          <Input
            id="address1"
            value={address.address_line_1}
            onChange={(e) => onChange('address_line_1', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <Label htmlFor="address2">Address Line 2 (Optional)</Label>
          <Input
            id="address2"
            value={address.address_line_2}
            onChange={(e) => onChange('address_line_2', e.target.value)}
            placeholder="Apt 4B"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Toronto"
            />
          </div>
          <div>
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              value={address.province}
              onChange={(e) => onChange('province', e.target.value)}
              placeholder="ON"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            id="postal"
            value={address.postal_code}
            onChange={(e) => onChange('postal_code', e.target.value)}
            placeholder="M5V 3A8"
          />
        </div>
      </CardContent>
    </Card>
  );

  if (currentStep === 'shipping') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold text-brand-text-primary">Checkout</h1>
        </div>

        <AddressForm
          address={shippingAddress}
          onChange={(field, value) => handleAddressChange('shipping', field, value)}
          title="Shipping Address"
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="billing-matches"
            checked={billingMatchesShipping}
            onCheckedChange={setBillingMatchesShipping}
          />
          <Label htmlFor="billing-matches">
            Billing address is the same as shipping address
          </Label>
        </div>

        {!billingMatchesShipping && (
          <AddressForm
            address={billingAddress}
            onChange={(field, value) => handleAddressChange('billing', field, value)}
            title="Billing Address"
          />
        )}

        <Button 
          className="w-full bg-brand-red hover:bg-red-700"
          onClick={() => setCurrentStep('payment')}
          disabled={!shippingAddress.name || !shippingAddress.address_line_1 || !shippingAddress.city}
        >
          Continue to Payment
        </Button>
      </div>
    );
  }

  if (currentStep === 'payment') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep('shipping')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shipping
          </Button>
          <h1 className="text-2xl font-bold text-brand-text-primary">Payment</h1>
        </div>

        <PaymentProcessor
          amount={total}
          productId="order"
          productName="Curling Canada Order"
          onSuccess={handlePaymentSuccess}
          onError={(error) => {
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: error
            });
          }}
        />
      </div>
    );
  }

  return null;
}