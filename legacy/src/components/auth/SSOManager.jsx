import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Unlink, 
  CheckCircle, 
  AlertTriangle,
  Smartphone,
  Globe,
  Users
} from 'lucide-react';
import { User } from '@/api/entities';
import { ExternalAuth } from '@/api/entities';
import { useToast } from '@/components/hooks/use-toast';
import SSOLoginButtons from './SSOLoginButtons';

const ConnectedAccount = ({ provider, email, isActive, onDisconnect, isPrimary }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const providerIcons = {
    google: Globe,
    apple: Smartphone, 
    facebook: Users,
    microsoft: Globe
  };

  const Icon = providerIcons[provider] || Shield;

  const handleDisconnect = async () => {
    setIsRemoving(true);
    try {
      // In real app: await ExternalAuth.delete(authId)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onDisconnect(provider);
    } catch (error) {
      console.error('Error disconnecting account:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-brand-charcoal/30 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-brand-red" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-brand-text-primary capitalize">{provider}</span>
            {isPrimary && (
              <Badge className="bg-green-600 text-white text-xs">Primary</Badge>
            )}
            {!isActive && (
              <Badge variant="outline" className="text-xs">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-brand-text-secondary">{email}</p>
        </div>
      </div>
      
      {!isPrimary && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={isRemoving}
          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
        >
          <Unlink className="w-4 h-4 mr-1" />
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      )}
    </div>
  );
};

export default function SSOManager() {
  const [user, setUser] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSSOAccounts();
  }, []);

  const loadSSOAccounts = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // In real app: const auths = await ExternalAuth.filter({ user_id: userData.id })
      // Mock connected accounts
      const mockAccounts = [
        {
          provider: 'google',
          email: userData.email,
          isActive: true,
          isPrimary: true
        }
      ];
      
      setConnectedAccounts(mockAccounts);
    } catch (error) {
      console.error('Error loading SSO accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectAccount = async (providerData) => {
    try {
      // In real app: await ExternalAuth.create({
      //   user_id: user.id,
      //   provider: providerData.provider,
      //   provider_user_id: providerData.provider_user_id,
      //   email: providerData.email,
      //   provider_data: providerData
      // })

      const newAccount = {
        provider: providerData.provider,
        email: providerData.email,
        isActive: true,
        isPrimary: false
      };

      setConnectedAccounts(prev => [...prev, newAccount]);
      
      toast({
        title: "Account connected successfully",
        description: `Your ${providerData.provider} account has been linked.`,
      });
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect your account. Please try again.",
      });
    }
  };

  const handleDisconnectAccount = async (provider) => {
    setConnectedAccounts(prev => prev.filter(acc => acc.provider !== provider));
    
    toast({
      title: "Account disconnected",
      description: `Your ${provider} account has been removed.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  const availableProviders = ['google', 'apple', 'facebook', 'microsoft'];
  const connectedProviders = connectedAccounts.map(acc => acc.provider);
  const unconnectedProviders = availableProviders.filter(p => !connectedProviders.includes(p));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
          Connected Accounts
        </h3>
        <p className="text-sm text-brand-text-secondary">
          Link your social accounts for easier sign-in
        </p>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Connecting multiple accounts allows you to sign in using any of them. 
          Your primary account cannot be removed.
        </AlertDescription>
      </Alert>

      {/* Connected Accounts */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Linked Accounts ({connectedAccounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {connectedAccounts.map(account => (
            <ConnectedAccount
              key={account.provider}
              provider={account.provider}
              email={account.email}
              isActive={account.isActive}
              isPrimary={account.isPrimary}
              onDisconnect={handleDisconnectAccount}
            />
          ))}
        </CardContent>
      </Card>

      {/* Available Connections */}
      {unconnectedProviders.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Available Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">
              Connect additional accounts for more sign-in options
            </p>
            <div className="max-w-md">
              <SSOLoginButtons
                onSuccess={handleConnectAccount}
                onError={(error) => console.error('SSO connection error:', error)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}