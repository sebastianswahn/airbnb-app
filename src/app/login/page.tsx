"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Protected data:", data);
      } else {
        console.error("Failed to fetch protected data", data.error);
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  const handleSendOtp = async () => {
    setError(null);
    try {
      const response = await fetch("/api/users/phone/getotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true); // Visa OTP-fältet
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpLogin = async () => {
    setError(null);
    try {
      const response = await fetch("/api/users/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok) {
        if (data.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            console.log(
              "Token saved in localStorage:",
              localStorage.getItem("token")
            );

            await fetchProtectedData();

            router.push("/");
          } else {
            console.log("LocalStorage is not available.");
          }
        } else {
          setError("No token received from the server.");
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Phone login failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("/api/auth/google");
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("Failed to login with Google.");
      }
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const response = await fetch("/api/auth/facebook");
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("Failed to login with Facebook.");
      }
    } catch (error) {
      setError("Facebook login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Logga in</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefonnummer
          </label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 mt-4"
          >
            Skicka OTP
          </button>
        </div>

        {otpSent && (
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Ange OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg"
            />
            <button
              type="button"
              onClick={handleOtpLogin}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Logga in med OTP
            </button>
          </div>
        )}

        <div className="my-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          >
            Logga in med Google
          </button>
        </div>

        <div className="my-4">
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800"
          >
            Logga in med Facebook
          </button>
        </div>

        <p className="mt-4 text-center">
          Har du inget konto?{" "}
          <a href="/register" className="text-blue-500">
            Registrera dig
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
