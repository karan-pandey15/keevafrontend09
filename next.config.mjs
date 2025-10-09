 
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'],
    },
    webpack(config, { dev }) {
      if (!dev) {
        config.devtool = 'hidden-source-map';
      }
      return config;
    },
  };
  
  export default nextConfig;
  