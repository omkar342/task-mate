"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../public/assets/task-mate-logo.jpg";
import { toast } from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      router.push("/login");
      toast.success("Account created successfully! Please log in.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#FAF9F5" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            className="mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Stay Organized, Get More Done.
          </h2>
          <p className="text-gray-600 text-sm">
            Your smart companion for effortless task management.
          </p>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100"
        >
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Log in
          </a>
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your personal or work email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="Enter your email or username"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-700"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-700"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Re-enter your password"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{ backgroundColor: "#C96442" }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to Anthropic's{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Consumer Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Usage Policy
          </a>
          , and acknowledge their{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
