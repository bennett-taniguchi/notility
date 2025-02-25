const webpack = require("webpack");
const path = require('path');
 
 
module.exports = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
       
      }
    ],
  },
  webpack: (config, options) => {
    // config.resolve.fallback = {
    //   ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
    //     // by next.js will be dropped. Doesn't make much sense, but how it is
    //   fs: false, // the solution
    // };
    config.resolve.alias['@huggingface/transformers'] = path.resolve(__dirname, 'node_modules/@huggingface/transformers');
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
 
 
    return config;
  },
};
