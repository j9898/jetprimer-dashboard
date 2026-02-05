import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JetPrimer - Your Business, Ready for Takeoff",
  description: "Premium US LLC Formation for Global Entrepreneurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
