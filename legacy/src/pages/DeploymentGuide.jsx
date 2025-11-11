import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Download, Server, Shield, Rocket, FileCode } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';

export default function DeploymentGuide() {
  const [copiedFile, setCopiedFile] = useState(null);
  const { toast } = useToast();

  const copyToClipboard = (text, fileName) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    toast({
      title: "Copied!",
      description: `${fileName} copied to clipboard`,
    });
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const files = {
    envProduction: `.env.production
# Base44 Production Environment Variables

# Base44 Configuration (REQUIRED)
VITE_BASE44_PROJECT_ID=your_project_id_here
VITE_BASE44_API_URL=https://api.base44.app

# App Configuration
VITE_APP_NAME="The Button - Curling Canada"
VITE_APP_URL=https://yourdomain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=false`,

    viteConfig: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion'],
          'vendor-utils': ['lodash', 'date-fns', 'moment'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});`,

    deployScript: `#!/bin/bash

# The Button - Production Deployment Script
set -e

echo "🚀 Starting deployment process..."

# Configuration - UPDATE THESE
REMOTE_USER="your_username"
REMOTE_HOST="your_linode_ip"
REMOTE_PATH="/var/www/thebutton"
BUILD_DIR="dist"

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

# Check environment file
if [ ! -f .env.production ]; then
    echo -e "\${RED}❌ Error: .env.production not found!\${NC}"
    exit 1
fi

# Clean previous build
echo -e "\${YELLOW}📦 Cleaning previous build...\${NC}"
rm -rf $BUILD_DIR

# Install dependencies
echo -e "\${YELLOW}📥 Installing dependencies...\${NC}"
npm install

# Build
echo -e "\${YELLOW}🔨 Building...\${NC}"
npm run build

# Create package
echo -e "\${YELLOW}📦 Creating package...\${NC}"
tar -czf deploy.tar.gz -C $BUILD_DIR .

# Upload
echo -e "\${YELLOW}⬆️  Uploading...\${NC}"
scp deploy.tar.gz $REMOTE_USER@$REMOTE_HOST:/tmp/

# Deploy on server
echo -e "\${YELLOW}🚀 Deploying...\${NC}"
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
    # Backup
    if [ -d /var/www/thebutton ]; then
        sudo cp -r /var/www/thebutton /var/www/thebutton.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Extract
    sudo mkdir -p /var/www/thebutton
    sudo tar -xzf /tmp/deploy.tar.gz -C /var/www/thebutton
    
    # Permissions
    sudo chown -R www-data:www-data /var/www/thebutton
    sudo chmod -R 755 /var/www/thebutton
    
    # Reload nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    # Cleanup
    rm /tmp/deploy.tar.gz
ENDSSH

# Cleanup
rm deploy.tar.gz

echo -e "\${GREEN}✅ Deployment completed!\${NC}"`,

    nginxConfig: `# Nginx Configuration
# Place in: /etc/nginx/sites-available/thebutton

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL (use certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    root /var/www/thebutton;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log /var/log/nginx/thebutton_access.log;
    error_log /var/log/nginx/thebutton_error.log;
}`,

    packageJson: `{
  "name": "the-button",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "bash deploy.sh"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0",
    "date-fns": "^2.30.0",
    "moment": "^2.29.4",
    "lodash": "^4.17.21",
    "recharts": "^2.10.0",
    "react-markdown": "^9.0.0",
    "react-quill": "^2.0.0",
    "react-hook-form": "^7.48.0",
    "@hello-pangea/dnd": "^16.5.0",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "terser": "^5.24.0"
  }
}`
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
          <Rocket className="w-8 h-8 text-brand-red" />
          Deployment Guide: Linode + base44
        </h1>
        <p className="text-brand-text-secondary mt-2">
          Frontend on Linode, Backend on base44 - Copy these files to your local project
        </p>
      </div>

      {/* Architecture Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Architecture Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-brand-card-bg rounded-lg border border-brand-border">
              <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold text-brand-text-primary">Linode</h3>
              <p className="text-sm text-brand-text-secondary">Frontend Hosting</p>
            </div>
            <div className="p-4 bg-brand-card-bg rounded-lg border border-brand-border">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold text-brand-text-primary">base44</h3>
              <p className="text-sm text-brand-text-secondary">Backend & Auth</p>
            </div>
            <div className="p-4 bg-brand-card-bg rounded-lg border border-brand-border">
              <FileCode className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="font-semibold text-brand-text-primary">Supabase</h3>
              <p className="text-sm text-brand-text-secondary">Database</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Steps */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>🚀 Quick Start (5 Steps)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-brand-red mt-1">1</Badge>
              <div>
                <p className="font-semibold text-brand-text-primary">Setup Linode Server</p>
                <p className="text-sm text-brand-text-secondary">Ubuntu 20.04+, Nginx, SSL certificate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-brand-red mt-1">2</Badge>
              <div>
                <p className="font-semibold text-brand-text-primary">Download Source Code</p>
                <p className="text-sm text-brand-text-secondary">Export from base44 dashboard</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-brand-red mt-1">3</Badge>
              <div>
                <p className="font-semibold text-brand-text-primary">Create Config Files</p>
                <p className="text-sm text-brand-text-secondary">Copy files from tabs below to your project root</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-brand-red mt-1">4</Badge>
              <div>
                <p className="font-semibold text-brand-text-primary">Configure Variables</p>
                <p className="text-sm text-brand-text-secondary">Update .env.production with your base44 project ID</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-brand-red mt-1">5</Badge>
              <div>
                <p className="font-semibold text-brand-text-primary">Deploy!</p>
                <p className="text-sm text-brand-text-secondary">Run: chmod +x deploy.sh && npm run deploy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Files */}
      <Tabs defaultValue="env" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="env">.env</TabsTrigger>
          <TabsTrigger value="vite">vite.config</TabsTrigger>
          <TabsTrigger value="deploy">deploy.sh</TabsTrigger>
          <TabsTrigger value="nginx">nginx.conf</TabsTrigger>
          <TabsTrigger value="package">package.json</TabsTrigger>
          <TabsTrigger value="server">Server Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="env">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">.env.production</CardTitle>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(files.envProduction, '.env.production')}
                >
                  {copiedFile === '.env.production' ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">{files.envProduction}</code>
              </pre>
              <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-900/50 rounded-lg">
                <p className="text-sm text-yellow-300">
                  ⚠️ <strong>Important:</strong> Replace 'your_project_id_here' with your actual base44 project ID from the dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vite">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">vite.config.js</CardTitle>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(files.viteConfig, 'vite.config.js')}
                >
                  {copiedFile === 'vite.config.js' ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-blue-400">{files.viteConfig}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">deploy.sh</CardTitle>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(files.deployScript, 'deploy.sh')}
                >
                  {copiedFile === 'deploy.sh' ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-purple-400">{files.deployScript}</code>
              </pre>
              <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-900/50 rounded-lg">
                <p className="text-sm text-yellow-300">
                  ⚠️ Update REMOTE_USER and REMOTE_HOST with your Linode server details
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nginx">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">nginx.conf</CardTitle>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(files.nginxConfig, 'nginx.conf')}
                >
                  {copiedFile === 'nginx.conf' ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-cyan-400">{files.nginxConfig}</code>
              </pre>
              <div className="mt-4 p-3 bg-blue-950/20 border border-blue-900/50 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 Place this file in /etc/nginx/sites-available/thebutton on your server
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="package">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">package.json</CardTitle>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(files.packageJson, 'package.json')}
                >
                  {copiedFile === 'package.json' ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">{files.packageJson}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Server Setup Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-brand-text-primary mb-2">1. Initial Server Setup</h3>
                <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`# SSH into server
ssh your_username@your_linode_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Create web directory
sudo mkdir -p /var/www/thebutton
sudo chown -R www-data:www-data /var/www/thebutton`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-brand-text-primary mb-2">2. Setup SSL Certificate</h3>
                <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-brand-text-primary mb-2">3. Configure Nginx</h3>
                <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`# Create nginx config
sudo nano /etc/nginx/sites-available/thebutton
# (paste nginx.conf from above tab)

# Enable site
sudo ln -s /etc/nginx/sites-available/thebutton /etc/nginx/sites-enabled/

# Test & reload
sudo nginx -t
sudo systemctl reload nginx`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-brand-text-primary mb-2">4. Setup SSH Keys (Recommended)</h3>
                <pre className="bg-brand-charcoal p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`# On your local machine
ssh-keygen -t rsa -b 4096
ssh-copy-id your_username@your_linode_ip`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Troubleshooting */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>🔧 Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-brand-text-primary mb-2">502 Bad Gateway</h3>
            <pre className="bg-brand-charcoal p-3 rounded text-sm">
              <code className="text-gray-300">sudo systemctl restart nginx</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-brand-text-primary mb-2">Permission Denied</h3>
            <pre className="bg-brand-charcoal p-3 rounded text-sm">
              <code className="text-gray-300">{`sudo chown -R www-data:www-data /var/www/thebutton
sudo chmod -R 755 /var/www/thebutton`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-brand-text-primary mb-2">Check Logs</h3>
            <pre className="bg-brand-charcoal p-3 rounded text-sm">
              <code className="text-gray-300">sudo tail -f /var/log/nginx/thebutton_error.log</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-brand-gold/10 border-brand-border">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              Need Help?
            </h3>
            <p className="text-brand-text-secondary mb-4">
              For deployment issues, check base44 documentation or contact support
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild>
                <a href="https://docs.base44.app" target="_blank" rel="noopener noreferrer">
                  base44 Docs
                </a>
              </Button>
              <Button className="bg-brand-red hover:bg-brand-red/90" asChild>
                <a href="https://status.base44.app" target="_blank" rel="noopener noreferrer">
                  System Status
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}