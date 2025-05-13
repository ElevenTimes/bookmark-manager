const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:4000/api/:path*', // Ensure this points to the backend service in Docker
      },
    ];
  },
};

export default nextConfig;




