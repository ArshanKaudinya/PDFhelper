import "./globals.css";

export const metadata = {
  title: "PDF QA",
  description: "Ask questions about your PDFs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}