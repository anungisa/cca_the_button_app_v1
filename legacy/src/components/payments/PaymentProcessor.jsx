import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { Purchase } from '@/api/entities';
import { User } from '@/api/entities';

export default function PaymentProcessor({ 
  amount, 
  productId, 
  productName, 
  onSuccess, 
  onError,
  className 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'CA'
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Get current user
      const user = await User.me();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Simulate payment processing (in real app, this would integrate with Stripe)
      const paymentIntent = await simulateStripePayment({
        amount: amount * 100, // Convert to cents
        currency: 'cad',
        payment_method: paymentMethod,
        card: cardDetails,
        billing_address: billingAddress
      });

      // Create purchase record
      const purchase = await Purchase.create({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        product_type: 'subscription',
        amount: amount * 100, // Store in cents
        currency: 'CAD',
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
        payment_method: paymentMethod,
        stripe_payment_intent_id: paymentIntent.id,
        billing_address: billingAddress,
        receipt_url: paymentIntent.receipt_url
      });

      if (paymentIntent.status === 'succeeded') {
        onSuccess && onSuccess(purchase);
      } else {
        throw new Error(paymentIntent.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError && onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate Stripe payment processing
  const simulateStripePayment = async (paymentData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        receipt_url: `https://pay.stripe.com/receipts/${Date.now()}`
      };
    } else {
      return {
        id: null,
        status: 'failed',
        error: 'Your card was declined. Please try a different payment method.'
      };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="apple_pay">Apple Pay</SelectItem>
                <SelectItem value="google_pay">Google Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'credit_card' && (
            <>
              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input
                      id="card-cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4 pt-4 border-t border-brand-border">
                <h4 className="font-medium text-brand-text-primary">Billing Address</h4>
                
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={billingAddress.address_line_1}
                    onChange={(e) => setBillingAddress({...billingAddress, address_line_1: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Toronto"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Province</Label>
                    <Select 
                      value={billingAddress.state} 
                      onValueChange={(value) => setBillingAddress({...billingAddress, state: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AB">Alberta</SelectItem>
                        <SelectItem value="BC">British Columbia</SelectItem>
                        <SelectItem value="MB">Manitoba</SelectItem>
                        <SelectItem value="NB">New Brunswick</SelectItem>
                        <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                        <SelectItem value="NS">Nova Scotia</SelectItem>
                        <SelectItem value="ON">Ontario</SelectItem>
                        <SelectItem value="PE">Prince Edward Island</SelectItem>
                        <SelectItem value="QC">Quebec</SelectItem>
                        <SelectItem value="SK">Saskatchewan</SelectItem>
                        <SelectItem value="NT">Northwest Territories</SelectItem>
                        <SelectItem value="NU">Nunavut</SelectItem>
                        <SelectItem value="YT">Yukon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    placeholder="K1A 0A6"
                    value={billingAddress.postal_code}
                    onChange={(e) => setBillingAddress({...billingAddress, postal_code: e.target.value})}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Security Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-brand-red hover:bg-red-700" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay $${amount.toFixed(2)} CAD`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}