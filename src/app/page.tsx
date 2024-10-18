"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

// Typ för JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const LandingPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwt.decode(token) as JwtPayload;

        // Om du behöver kolla på payload, t.ex. roll
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [isClient, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Välkommen till din Dashboard
      </h1>
      <p className="text-gray-700 text-center">
        Du är inloggad och kan nu se denna sida!
      </p>
    </div>
  );
};

export default LandingPage;
