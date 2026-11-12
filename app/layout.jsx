import "./globals.css";

export const metadata = {
  title: "DiskLens — See where your storage goes",
  description:
    "DiskLens is local-first storage intelligence for Windows: index your drives, explore folders with a sunburst, review cleanup candidates and get optional AI-assisted storage insight. Read the product guide and download the official installer.",
  applicationName: "DiskLens",
  keywords: ["DiskLens", "disk analyzer", "storage analyzer", "Windows disk space", "storage intelligence"],
  openGraph: {
    title: "DiskLens — See where your storage goes",
    description: "A clearer view of your disks. Explore your storage locally on your PC.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiskLens — See where your storage goes",
    description: "A local-first storage intelligence app for Windows.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  themeColor: "#070a08",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
