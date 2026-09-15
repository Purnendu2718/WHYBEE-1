import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UNIFLOW - Integrated Student Management System',
  description: 'Role-based college ERP portal for Students, Parents, and Faculty/Admin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
