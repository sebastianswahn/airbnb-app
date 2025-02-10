import { Roboto } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata = {
  title: "Airbnb Clone",
  description: "Your home away from home",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-roboto antialiased min-h-screen bg-white relative">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
