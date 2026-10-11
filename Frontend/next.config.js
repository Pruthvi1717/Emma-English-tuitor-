/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      
      {
        source: "/api/voice-chat",
        destination: "http://localhost:3000/api/voice-chat",
      },
    ];
  },
};

module.exports = nextConfig;

