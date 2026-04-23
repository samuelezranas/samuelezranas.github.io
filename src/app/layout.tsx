import { Analytics } from "@vercel/analytics/react";
import "../styles.css";

export const metadata = {
  title: "Samuel Ezra | Fullstack & Mobile Developer",
  description: "Portfolio of Samuel Ezra.",
  icons: {
    icon: "/packages/images/logo-icon-web.svg",
    shortcut: "/packages/images/logo-icon-web.svg",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
