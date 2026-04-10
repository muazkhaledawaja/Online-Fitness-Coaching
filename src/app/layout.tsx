import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DR. MARWAN TAREK — Online Coaching",
  description:
    "Science-backed online fitness coaching by Dr. Marwan Tarek. Personalized training and nutrition programs.",
  icons: {
    icon: "/images/logo4_icon.png",
    apple: "/images/logo4_icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased text-foreground bg-bg" suppressHydrationWarning>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
