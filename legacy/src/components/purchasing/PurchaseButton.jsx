
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, CreditCard, Lock } from 'lucide-react';
import { useXP } from '@/components/XPContext';
import { useToast } from "@/components/ui/use-toast"; // Make sure this path is correct
import { rateLimiter } from '../services/RateLimiter'; // Make sure this path is correct
import { securityService } from '../services/SecurityService'; // Make sure this path is correct
import { performanceMonitor } from '../services/PerformanceMonitoringService'; // Make sure this path is correct

export default function PurchaseButton({
  products = [],
  purchaseType = 'one_time',
  buttonText = 'Purchase',
  buttonClassName = '',
  onSuccess, // Kept for consistency with original props, though not called in this redirect flow
  onError,
  requiresAuth = true,
  children
}) {
  const { user } = useXP();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null); // Added for potential error display/logging
  const { toast } = useToast();

  const handlePurchase = async () => {
    const startTime = Date.now();
    setError(null); // Clear previous errors

    if (requiresAuth && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase.",
        variant: "destructive"
      });
      performanceMonitor.trackEvent('purchase_auth_required');
      return;
    }

    // ✅ RATE LIMITING
    try {
      if (user) {
        await rateLimiter.checkMutationLimit(user.id);
      } else {
        await rateLimiter.checkGlobalLimit();
      }
    } catch (rateLimitError) {
      toast({
        title: "Too Many Requests",
        description: rateLimitError.message,
        variant: "destructive"
      });
      performanceMonitor.trackError(rateLimitError, { context: 'purchase_rate_limit' });
      setError(rateLimitError.message);
      if (onError) onError(rateLimitError);
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ IDEMPOTENCY KEY
      const idempotencyKey = securityService.generateSecureId(32);
      
      // ✅ CSRF TOKEN
      const csrfToken = securityService.getCSRFToken(); // Assumes getCSRFToken retrieves the token, e.g., from a meta tag or context

      // Dynamically import the function to reduce initial bundle size
      const { createCheckoutSession } = await import('@/api/functions');
      
      const response = await createCheckoutSession({
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          amount: p.amount,
          category: p.category,
          metadata: p.metadata || {} // Ensure metadata is passed
        })),
        purchaseType,
        idempotencyKey,
        csrfToken
      });

      if (response.data?.url) {
        performanceMonitor.trackAPICall(
          'createCheckoutSession',
          Date.now() - startTime,
          'success'
        );
        
        // Redirect user to the checkout page
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned from the server.');
      }

    } catch (err) {
      console.error('Purchase error:', err);
      // Attempt to get a more specific error message from the response
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred during purchase.';
      
      setError(errorMessage);
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive"
      });

      performanceMonitor.trackError(err, { context: 'purchase_flow' });
      
      if (onError) onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom button content
  if (children) {
    return (
      <>
        <div 
          onClick={handlePurchase} 
          className={isProcessing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          // Consider adding a disabled state visually for children if isProcessing is true
        >
          {children}
        </div>
      </>
    );
  }

  // Default button
  return (
    <>
      <Button
        onClick={handlePurchase}
        // Removed variant and size props as they are no longer in component props
        disabled={isProcessing}
        className={`${buttonClassName} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {purchaseType === 'subscription' ? (
          <CreditCard className="w-4 h-4 mr-2" />
        ) : (
          // Simplified icon logic as allowCurlPoints prop is removed
          <ShoppingCart className="w-4 h-4 mr-2" />
        )}
        {buttonText}
        {/* Removed price badge as it's typically shown on the checkout page */}
      </Button>
    </>
  );
}
