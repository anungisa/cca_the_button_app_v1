/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Enable for Azure App Service deployment
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ntqrqcmllkgrhwjreohn.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
