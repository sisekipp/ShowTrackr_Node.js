import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'ShowTrackr — Track your favorite shows',
  description: 'Get notified when new episodes of your favorite shows are about to air.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <Navbar />
        <main className="relative mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
