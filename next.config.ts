import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  turbopack: {
    rules: {
      // 소스맵 생성을 위한 설정
      '*.{css,scss}': ['source-map-loader'],
    },
  },
};

export default nextConfig;
