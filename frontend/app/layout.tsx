// import type { Metadata } from "next";
// import "./globals.css";
// import { Header } from "../components/Header";

// export const metadata: Metadata = {
//   title: "QuickBite",
//   description: "Food delivery order management assessment",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <Header />
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/hooks/useCart";

export const metadata: Metadata = {
  title: "QuickBite",
  description: "Food delivery order management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}