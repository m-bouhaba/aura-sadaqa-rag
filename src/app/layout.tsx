import "./globals.css";

export const metadata = {
    title: "Aura-Sadaqa",
    description: "AI Assistant pour Ramadan",
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body>{children}</body>
      </html>
    );
  }
  