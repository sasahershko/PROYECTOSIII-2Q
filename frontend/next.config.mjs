/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ✅ Permite cualquier dominio externo para <Image />
  },
};

export default nextConfig;
