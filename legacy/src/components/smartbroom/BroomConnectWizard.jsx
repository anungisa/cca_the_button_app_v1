
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bluetooth, 
  Wifi, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  BarChart3 // Added BarChart3 import
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BroomConnectWizard({ isConnected, onConnectionChange, user, accessLevel }) {
  const [connectionStep, setConnectionStep] = useState(1);
  const [deviceId, setDeviceId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      onConnectionChange(true);
      setIsConnecting(false);
      setConnectionStep(4);
    }, 3000);
  };

  const handleDisconnect = () => {
    onConnectionChange(false);
    setConnectionStep(1);
  };

  const connectionSteps = [
    {
      title: 'Prepare Your Device',
      description: 'Make sure your Smart Broom is charged and within range',
      icon: Zap
    },
    {
      title: 'Enable Bluetooth',
      description: 'Turn on Bluetooth on your device and Smart Broom',
      icon: Bluetooth
    },
    {
      title: 'Pair Device',
      description: 'Select your Smart Broom from the available devices',
      icon: Smartphone
    },
    {
      title: 'Connected!',
      description: 'Your Smart Broom is ready to track your sessions',
      icon: CheckCircle
    }
  ];

  if (isConnected) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-brand-text-primary">Smart Broom Connected</h3>
                <p className="text-brand-text-secondary">Device ID: SB-{deviceId || '1234'}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="border-brand-border text-brand-text-secondary"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold text-brand-text-primary">Live Data</h4>
              <p className="text-sm text-brand-text-secondary">Real-time performance metrics</p>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold text-brand-text-primary">Calibration</h4>
              <p className="text-sm text-brand-text-secondary">Optimize sensor settings</p>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <Wifi className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold text-brand-text-primary">Sync Status</h4>
              <p className="text-sm text-brand-text-secondary">Data synced to cloud</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Connection Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {connectionSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = connectionStep === index + 1;
          const isCompleted = connectionStep > index + 1;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`${
                isActive ? 'ring-2 ring-brand-red bg-brand-red/10' : 
                isCompleted ? 'bg-green-900/20 border-green-500/30' : 
                'bg-brand-card-bg border-brand-border'
              }`}>
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isActive ? 'bg-brand-red text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-brand-charcoal text-brand-text-secondary'
                  }`}>
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-brand-text-primary text-sm mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-brand-text-secondary">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Connection Interface */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5" />
            Connect Your Smart Broom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Device ID (Optional)
              </label>
              <Input
                placeholder="Enter device ID if known..."
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="bg-brand-charcoal border-brand-border text-brand-text-primary"
              />
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-300 mb-1">Connection Tips</h4>
                  <ul className="text-sm text-blue-400 space-y-1">
                    <li>• Ensure your Smart Broom is charged (green LED)</li>
                    <li>• Hold the power button for 3 seconds to enter pairing mode</li>
                    <li>• Keep devices within 10 feet during pairing</li>
                    <li>• {accessLevel === 'free' ? 'Basic features only' : 'Full analytics available'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 bg-brand-red hover:bg-red-700"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4 mr-2" />
                  Connect Device
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setConnectionStep(prev => Math.min(prev + 1, 4))}
              className="border-brand-border text-brand-text-secondary"
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
