import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Connect with friends and share your moments on Buddy Script",
  icons: {
    icon: "/images/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className="font-sans m-0 p-0 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
