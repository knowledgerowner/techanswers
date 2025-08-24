import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

    // CSP complètement désactivée pour tester Stripe
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src-elem * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; font-src * data: blob:; img-src * data: blob:; connect-src * data: blob:; frame-src * data: blob:; worker-src * data: blob:; child-src * data: blob:; object-src * data: blob:; base-uri *; form-action *",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
