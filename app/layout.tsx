import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Do Smart",
  description:
    "An AI-enabled todo and task management application made by Ram Chandel",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen m-0 p-0 flex flex-col-reverse md:flex-col justify-between">
        <StoreProvider>
          <header className="fixed w-full h-[65px] bg-gray-700 bottom-0 md:top-0 md:bottom-auto flex justify-between items-center px-4 md:px-8 z-50">
            <Header />
          </header>
          <main className="md:mt-[75px]">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
