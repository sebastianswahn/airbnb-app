"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const [phone, setPhone] = useState<string>(""); // Telefonnummer
  const [otp, setOtp] = useState<string>(""); // OTP
  const [otpSent, setOtpSent] = useState<boolean>(false); // Visa OTP-fältet
  const [error, setError] = useState<string | null>(null); // Felmeddelanden
  const [email, setEmail] = useState<string>(""); // E-post
  const [password, setPassword] = useState<string>(""); // Lösenord
  const [registrationMethod, setRegistrationMethod] = useState<string>("email"); // Vald registreringsmetod
  const router = useRouter();

  // Skicka OTP för telefonregistrering
  const handleSendOtp = async () => {
    setError(null);
    try {
      const response = await fetch("/api/users/phone/register", {
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

  // Registrera med OTP
  const handlePhoneRegister = async () => {
    setError(null);
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          router.push("/");
        } else {
          setError("No token received from the server.");
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  // Registrera med e-post och lösenord
  const handleEmailRegister = async () => {
    setError(null);
    try {
      const response = await fetch("/api/users/register-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      setError("Email registration failed. Please try again.");
    }
  };

  // Hantera Google-registrering
  const handleGoogleRegister = async () => {
    try {
      const response = await fetch("/api/auth/google");
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("Failed to register with Google.");
      }
    } catch (error) {
      setError("Google registration failed. Please try again.");
    }
  };

  // Hantera Facebook-registrering
  const handleFacebookRegister = async () => {
    try {
      const response = await fetch("/api/auth/facebook");
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("Failed to register with Facebook.");
      }
    } catch (error) {
      setError("Facebook registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrera dig</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Välj registreringsmetod */}
        <div className="mb-4">
          <label
            htmlFor="method"
            className="block text-sm font-medium text-gray-700"
          >
            Välj registreringsmetod:
          </label>
          <select
            value={registrationMethod}
            onChange={(e) => setRegistrationMethod(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          >
            <option value="email">E-post och lösenord</option>
            <option value="phone">Telefonnummer</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        {/* E-post och lösenord */}
        {registrationMethod === "email" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-post
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Lösenord
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={handleEmailRegister}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Registrera med E-post
            </button>
          </>
        )}

        {/* Telefonnummer */}
        {registrationMethod === "phone" && (
          <>
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

            {/* OTP-fält visas efter att OTP har skickats */}
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
                  onClick={handlePhoneRegister}
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mt-4"
                >
                  Registrera med OTP
                </button>
              </div>
            )}
          </>
        )}

        {/* Google- och Facebook-registrering */}
        {registrationMethod === "google" && (
          <div className="my-4">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Registrera med Google
            </button>
          </div>
        )}

        {registrationMethod === "facebook" && (
          <div className="my-4">
            <button
              type="button"
              onClick={handleFacebookRegister}
              className="w-full bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800"
            >
              Registrera med Facebook
            </button>
          </div>
        )}

        <p className="mt-4 text-center">
          Har du redan ett konto?{" "}
          <a href="/login" className="text-blue-500">
            Logga in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
