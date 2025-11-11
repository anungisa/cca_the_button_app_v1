
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Purchase } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Smartphone,
  ShoppingCart,
  Truck,
  Zap,
  Check,
  AlertTriangle,
  X,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useXP } from '../XPContext'; // Path updated

const PaymentMethodSelector = ({ selectedMethod, onSelect, allowCurlPoints = false, curlPointsBalance = 0 }) => (
  <div className="grid grid-cols-2 gap-3">
    <Button
      variant={selectedMethod === 'credit_card' ? 'default' : 'outline'}
      onClick={() => onSelect('credit_card')}
      className="flex items-center gap-2 h-12"
    >
      <CreditCard className="w-5 h-5" />
      Card
    </Button>
    <Button
      variant={selectedMethod === 'paypal' ? 'default' : 'outline'}
      onClick={() => onSelect('paypal')}
      className="flex items-center gap-2 h-12"
    >
      PayPal
    </Button>
    <Button
      variant={selectedMethod === 'apple_pay' ? 'default' : 'outline'}
      onClick={() => onSelect('apple_pay')}
      className="flex items-center gap-2 h-12"
    >
      <Smartphone className="w-5 h-5" />
      Apple Pay
    </Button>
    <Button
      variant={selectedMethod === 'google_pay' ? 'default' : 'outline'}
      onClick={() => onSelect('google_pay')}
      className="flex items-center gap-2 h-12"
    >
      <Smartphone className="w-5 h-5" />
      Google Pay
    </Button>
    {allowCurlPoints && (
      <Button
        variant={selectedMethod === 'curl_points' ? 'default' : 'outline'}
        onClick={() => onSelect('curl_points')}
        className="flex items-center gap-2 h-12 col-span-2"
        disabled={curlPointsBalance <= 0}
      >
        <Zap className="w-5 h-5 text-amber-400" />
        CurlPoints ({curlPointsBalance} available)
      </Button>
    )}
  </div>
);

const OrderSummary = ({ items, taxes, discount, total, currency = 'CAD' }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader>
      <CardTitle className="text-lg">Order Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <div>
            <p className="text-brand-text-primary font-medium">{item.name}</p>
            {item.description && (
              <p className="text-brand-text-secondary text-sm">{item.description}</p>
            )}
          </div>
          <p className="text-brand-text-primary font-medium">
            ${(item.amount / 100).toFixed(2)}
          </p>
        </div>
      ))}

      {discount && discount.amount > 0 && (
        <div className="flex justify-between items-center text-green-400">
          <p>Discount ({discount.code})</p>
          <p>-${(discount.amount / 100).toFixed(2)}</p>
        </div>
      )}

      {taxes && taxes.amount > 0 && (
        <div className="flex justify-between items-center text-brand-text-secondary">
          <p>Tax ({taxes.jurisdiction})</p>
          <p>${(taxes.amount / 100).toFixed(2)}</p>
        </div>
      )}

      <hr className="border-brand-border" />

      <div className="flex justify-between items-center text-lg font-bold text-brand-text-primary">
        <p>Total</p>
        <p>${(total / 100).toFixed(2)} {currency}</p>
      </div>
    </CardContent>
  </Card>
);

export default function UnifiedCheckout({
  isOpen,
  onClose,
  products = [],
  purchaseType = 'one_time',
  allowCurlPoints = false,
  requiresShipping = false,
  onSuccess
}) {
  const { user, loyaltyData } = useXP();
  const [step, setStep] = useState('review'); // review, payment, processing, success
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingDetails, setBillingDetails] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    address: {
      line1: '',
      line2: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'CA'
    }
  });
  const [shippingDetails, setShippingDetails] = useState({
    same_as_billing: true,
    address: {
      name: user?.full_name || '',
      line1: '',
      line2: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'CA'
    }
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Calculate totals
  const subtotal = products.reduce((sum, product) => sum + product.amount, 0);
  const discountAmount = discount ? discount.amount : 0;
  const taxRate = 0.13; // HST for Canada - in real app, calculate based on province
  const taxableAmount = subtotal - discountAmount;
  const taxes = {
    amount: Math.round(taxableAmount * taxRate),
    rate: taxRate,
    jurisdiction: 'HST (Canada)'
  };
  const total = taxableAmount + taxes.amount;

  const canPayWithPoints = allowCurlPoints && loyaltyData?.curl_points >= (total / 100);

  const handlePromoCode = async () => {
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount({
        code: promoCode,
        amount: Math.round(subtotal * 0.1), // 10% off
        percent: 10
      });
    } else if (promoCode) {
      alert('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in to complete your purchase');
      return;
    }

    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Create purchases for each product
      const purchases = await Promise.all(
        products.map(async (product) => {
          const purchaseData = {
            user_id: user.id,
            purchase_type: purchaseType,
            product_id: product.id || product.name.replace(/\s+/g, '_').toLowerCase(),
            product_name: product.name,
            product_category: product.category,
            amount: product.amount,
            currency: 'CAD',
            status: 'completed', // In real app, would be 'pending' until payment confirmed
            payment_method: {
              type: paymentMethod,
              last_four: paymentMethod === 'credit_card' ? '4242' : undefined,
              brand: paymentMethod === 'credit_card' ? 'visa' : paymentMethod
            },
            billing_details: billingDetails,
            tax_details: {
              tax_amount: Math.round((product.amount * taxRate)),
              tax_rate: taxRate,
              tax_jurisdiction: taxes.jurisdiction
            },
            discount_applied: discount,
            metadata: product.metadata || {}
          };

          // Add subscription details if applicable
          if (purchaseType === 'subscription' && product.subscription) {
            purchaseData.subscription_details = product.subscription;
          }

          // Add fulfillment details if shipping required
          if (requiresShipping) {
            purchaseData.fulfillment_details = {
              shipping_required: true,
              shipping_address: shippingDetails.same_as_billing ?
                billingDetails.address : shippingDetails.address,
              fulfillment_status: 'pending',
              estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
          }

          return await Purchase.create(purchaseData);
        })
      );

      // If paying with CurlPoints, deduct points
      if (paymentMethod === 'curl_points') {
        // This would integrate with the XP system to deduct points
        // await awardPoints(-total, 'purchase', `Purchase: ${products.map(p => p.name).join(', ')}`);
      }

      setStep('success');

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(purchases);
      }

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-brand-text-primary flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-brand-red" />
              Complete Your Purchase
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {step === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-6">
              <OrderSummary
                items={products}
                taxes={taxes}
                discount={discount}
                total={total}
              />

              {/* Promo Code */}
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-brand-charcoal border-brand-border"
                    />
                    <Button onClick={handlePromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {discount && (
                    <div className="text-green-400 text-sm">
                      ✓ {discount.percent}% discount applied!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Customer Details */}
            <div className="space-y-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={billingDetails.name}
                      onChange={(e) => setBillingDetails({
                        ...billingDetails,
                        name: e.target.value
                      })}
                      className="bg-brand-charcoal border-brand-border"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={billingDetails.email}
                      onChange={(e) => setBillingDetails({
                        ...billingDetails,
                        email: e.target.value
                      })}
                      className="bg-brand-charcoal border-brand-border"
                    />
                  </div>
                  <Input
                    placeholder="Address Line 1"
                    value={billingDetails.address.line1}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      address: { ...billingDetails.address, line1: e.target.value }
                    })}
                    className="bg-brand-charcoal border-brand-border"
                  />
                  <Input
                    placeholder="Address Line 2 (Optional)"
                    value={billingDetails.address.line2}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      address: { ...billingDetails.address, line2: e.target.value }
                    })}
                    className="bg-brand-charcoal border-brand-border"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="City"
                      value={billingDetails.address.city}
                      onChange={(e) => setBillingDetails({
                        ...billingDetails,
                        address: { ...billingDetails.address, city: e.target.value }
                      })}
                      className="bg-brand-charcoal border-brand-border"
                    />
                    <Input
                      placeholder="Province"
                      value={billingDetails.address.province}
                      onChange={(e) => setBillingDetails({
                        ...billingDetails,
                        address: { ...billingDetails.address, province: e.target.value }
                      })}
                      className="bg-brand-charcoal border-brand-border"
                    />
                    <Input
                      placeholder="Postal Code"
                      value={billingDetails.address.postal_code}
                      onChange={(e) => setBillingDetails({
                        ...billingDetails,
                        address: { ...billingDetails.address, postal_code: e.target.value }
                      })}
                      className="bg-brand-charcoal border-brand-border"
                    />
                  </div>
                </CardContent>
              </Card>

              {requiresShipping && (
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="same-address"
                        checked={shippingDetails.same_as_billing}
                        onCheckedChange={(checked) => setShippingDetails({
                          ...shippingDetails,
                          same_as_billing: checked
                        })}
                      />
                      <label htmlFor="same-address" className="text-brand-text-primary">
                        Same as billing address
                      </label>
                    </div>

                    {!shippingDetails.same_as_billing && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Recipient Name"
                          value={shippingDetails.address.name}
                          onChange={(e) => setShippingDetails({
                            ...shippingDetails,
                            address: { ...shippingDetails.address, name: e.target.value }
                          })}
                          className="bg-brand-charcoal border-brand-border"
                        />
                        <Input
                          placeholder="Address Line 1"
                          value={shippingDetails.address.line1}
                          onChange={(e) => setShippingDetails({
                            ...shippingDetails,
                            address: { ...shippingDetails.address, line1: e.target.value }
                          })}
                          className="bg-brand-charcoal border-brand-border"
                        />
                        <Input
                          placeholder="Address Line 2 (Optional)"
                          value={shippingDetails.address.line2}
                          onChange={(e) => setShippingDetails({
                            ...shippingDetails,
                            address: { ...shippingDetails.address, line2: e.target.value }
                          })}
                          className="bg-brand-charcoal border-brand-border"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="City"
                            value={shippingDetails.address.city}
                            onChange={(e) => setShippingDetails({
                              ...shippingDetails,
                              address: { ...shippingDetails.address, city: e.target.value }
                            })}
                            className="bg-brand-charcoal border-brand-border"
                          />
                          <Input
                            placeholder="Province"
                            value={shippingDetails.address.province}
                            onChange={(e) => setShippingDetails({
                              ...shippingDetails,
                              address: { ...shippingDetails.address, province: e.target.value }
                            })}
                            className="bg-brand-charcoal border-brand-border"
                          />
                          <Input
                            placeholder="Postal Code"
                            value={shippingDetails.address.postal_code}
                            onChange={(e) => setShippingDetails({
                              ...shippingDetails,
                              address: { ...shippingDetails.address, postal_code: e.target.value }
                            })}
                            className="bg-brand-charcoal border-brand-border"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => setStep('payment')}
                className="w-full bg-brand-red hover:bg-red-700"
                size="lg"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <OrderSummary
                items={products}
                taxes={taxes}
                discount={discount}
                total={total}
              />
            </div>

            <div className="space-y-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                    allowCurlPoints={allowCurlPoints}
                    curlPointsBalance={loyaltyData?.curl_points || 0}
                  />

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3 pt-4">
                      <Input placeholder="Card Number" className="bg-brand-charcoal border-brand-border" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM/YY" className="bg-brand-charcoal border-brand-border" />
                        <Input placeholder="CVC" className="bg-brand-charcoal border-brand-border" />
                      </div>
                      <Input placeholder="Cardholder Name" className="bg-brand-charcoal border-brand-border" />
                    </div>
                  )}

                  {paymentMethod === 'curl_points' && !canPayWithPoints && (
                    <Alert variant="destructive" className="bg-red-900/20 border border-red-500/30 text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Insufficient CurlPoints. You need {Math.ceil(total / 100)} points but have {loyaltyData?.curl_points || 0}.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <label htmlFor="terms" className="text-brand-text-secondary text-sm">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('review')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !agreedToTerms || (paymentMethod === 'curl_points' && !canPayWithPoints)}
                  className="flex-1 bg-brand-red hover:bg-red-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-text-primary mb-2">
                Processing Your Purchase
              </h3>
              <p className="text-brand-text-secondary">
                Please wait while we process your payment. Do not close this window.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-text-primary mb-2">
                Purchase Complete!
              </h3>
              <p className="text-brand-text-secondary">
                Thank you for your purchase. You'll receive a confirmation email shortly.
              </p>
            </div>
            {requiresShipping && (
              <Alert variant="default" className="bg-blue-900/20 border border-blue-500/30 text-blue-300">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your order will be shipped within 2-3 business days. You'll receive tracking information via email.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
