import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains:[`${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`]
  },
};

export default nextConfig;
