/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Enable for Azure App Service deployment
  
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
