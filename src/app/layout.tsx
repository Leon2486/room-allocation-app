import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel app",
  description: "Start Booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
