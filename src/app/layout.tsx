import AuthProvider from "@/context/AuthProvider";
import { Geist } from "next/font/google";
import './globals.css'
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner'
import Navbar from "@/components/Navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}