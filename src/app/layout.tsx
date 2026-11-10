import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SiteLayout from "@/components/SiteLayout";
// import SplashScreen from "@/components/SplashScreen";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "RK Frozen Food",
  description: "Frozen snacks and convenient food favourites from RK Frozen Food.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable} min-h-screen`}>
        {/* <SplashScreen /> */}
        <SiteLayout>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
};

export default RootLayout;