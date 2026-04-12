import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className="font-body antialiased text-foreground bg-bg"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            {children}
            <Toaster position="bottom-right" theme="system" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
