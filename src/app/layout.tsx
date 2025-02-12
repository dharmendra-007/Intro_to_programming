export const metadata = {
  title: "Introduction to Programming - Registration",
  description: "Join our Introduction to Programming event. Check registration status and countdown until the event starts.",
  icons: {
    icon: "/favicon_io/favicon.ico",
  },
};

import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
