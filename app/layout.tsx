import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vb-atlas.vercel.app'),
  title: "The Atlas of VB",
  description: "A personal atlas of adventures, beautifully documented vacations from around the world.",
  openGraph: {
    title: "The Atlas of VB",
    description: "A personal atlas of adventures, beautifully documented vacations from around the world.",
    url: "https://vb-atlas.vercel.app",
    siteName: "The Atlas of VB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Atlas of VB",
    description: "A personal atlas of adventures, beautifully documented vacations from around the world.",
  },
};

const designTokens = `
  :root {
    --a-bg:      #FDFAF5;
    --a-surface: #F7F2EA;
    --a-raised:  #EEE5D5;
    --a-border:  #DDD4C0;
    --a-border2: #C4B49A;
    --a-accent:       #B45309;
    --a-accent2:      #D97706;
    --a-accent-dark:  #92400E;
    --a-text:         #1C1410;
    --a-muted:        #7C6D5A;
    --a-dim:          #C4B49A;
    --a-chart-muted:  #A89880;
  }
  .font-display { font-family: var(--font-display, 'Playfair Display', Georgia, serif); }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  ::selection { background: #B4530922; color: #1C1410; }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <style href="atlas-design-tokens" precedence="high" dangerouslySetInnerHTML={{ __html: designTokens }} />
      <body className="min-h-full antialiased" style={{ backgroundColor: 'var(--a-bg)', color: 'var(--a-text)', fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  );
}
