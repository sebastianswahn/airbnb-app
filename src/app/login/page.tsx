"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const socialLogins = [
  { name: "Facebook", icon: "/images/fb.svg" },
  { name: "Google", icon: "/images/google.svg" },
  { name: "Apple", icon: "/images/apple.svg" },
  { name: "email", icon: "/images/mail.svg" },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPhone, sendOTP, isAuthenticated, loading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+46");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    // Only redirect after auth state is loaded and if user is authenticated
    if (!loading && isAuthenticated) {
      // Redirect to home page or return to the previous page
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Don't render the login form if the user is authenticated and we're about to redirect
  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const success = await sendOTP(fullPhoneNumber);
      if (success) {
        setShowVerification(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await loginWithPhone(fullPhoneNumber, verificationCode);
      
      if (!result.success) {
        setError(result.error || "Invalid verification code");
      }
      // If successful, the auth context will handle redirection
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  if (showVerification) {
    return (
      <div className="max-w-[768px] mx-auto w-full">
        <div className="border-b border-solid border-grey-200 pb-3.5 pt-6 px-6">
          <div className="flex items-center">
            <button
              onClick={() => setShowVerification(false)}
              className="p-2"
              disabled={isLoading}
            >
              <Image
                src="/images/chevron-left.svg"
                alt="Back"
                width={24}
                height={24}
              />
            </button>
            <h1 className="flex-1 text-center text-base font-roboto font-semibold">
              Confirm your number
            </h1>
          </div>
        </div>

        <div className="px-6 pt-6">
          <p className="text-sm mb-4">
            Enter the code we've sent via SMS to {countryCode} {phoneNumber}:
          </p>

          <form onSubmit={handleVerificationSubmit}>
            <div className="flex gap-2 mb-4">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 border rounded-lg text-center"
                  value={verificationCode[i] || ""}
                  disabled={isLoading}
                  onChange={(e) => {
                    const newCode = verificationCode.split("");
                    newCode[i] = e.target.value;
                    setVerificationCode(newCode.join(""));
                    if (e.target.value && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg text-base h-12 font-roboto font-semibold text-white bg-[#FF385C] disabled:bg-gray-300"
              disabled={verificationCode.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-gray-900 underline"
              onClick={handlePhoneSubmit}
              disabled={isLoading}
            >
              Haven't received a code?
            </button>
            <button className="text-sm text-gray-900 font-semibold">
              More options
            </button>
          </div>

          <div className="pt-11 pb-8 text-center">
            <Link href="/help" className="text-sm text-gray-900">
              Need help?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[768px] mx-auto w-full">
      <div className="border-b border-solid border-grey-200 pb-3.5 pt-6">
        <h1 className="text-center text-base font-roboto font-semibold">
          Log in or sign up
        </h1>
      </div>

      <div className="px-6 pt-6">
        <h2 className="text-[22px] font-semibold leading-[26px] font-roboto text-black-600 mb-6">
          Welcome to Airbnb
        </h2>

        <form onSubmit={handlePhoneSubmit}>
          <div className="border rounded-lg">
            <div className="relative border-b">
              <select
                className="w-full p-4 appearance-none bg-transparent"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={isLoading}
              >
                <option value="+46">Sweden (+46)</option>
                <option value="+1">United States (+1)</option>
                <option value="+44">United Kingdom (+44)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Image
                  src="/images/chevron-down.svg"
                  alt=""
                  width={14}
                  height={8}
                />
              </div>
            </div>
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full p-4 bg-transparent"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <p className="text-xs mt-2 text-gray-600">
            We'll call or text you to confirm your number. Standard message and
            data rates apply.{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg text-base h-12 font-roboto font-semibold text-white bg-[#FF385C] mt-4 disabled:bg-gray-300"
            disabled={!phoneNumber || isLoading}
          >
            {isLoading ? "Sending code..." : "Continue"}
          </button>
        </form>

        <div className="flex items-center py-4">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="mx-4 text-xs text-gray-500">or</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="space-y-3">
          {socialLogins.map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleSocialLogin(provider.name)}
              className="w-full h-12 border border-gray-300 rounded-lg flex items-center px-6"
              disabled={isLoading}
            >
              <Image src={provider.icon} alt="" width={24} height={24} />
              <span className="flex-1 text-center text-sm font-medium">
                Continue with {provider.name}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-11 pb-8 text-center">
          <Link href="/help" className="text-sm text-gray-900">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}