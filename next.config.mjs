/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'mongoose',
    'agenda',
    '@agendajs/mongo-backend',
    'nodemailer',
    'bcryptjs',
    'xml2js',
  ],
};

export default nextConfig;
