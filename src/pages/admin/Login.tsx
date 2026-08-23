import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [userCaptcha, setUserCaptcha] = useState("");

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setUserCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parseInt(userCaptcha) !== captchaNum1 + captchaNum2) {
      setError("Verifikasi salah. Silakan coba lagi.");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        navigate("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (e) {
      setError("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
          <Rocket className="w-8 h-8 text-[#FF6B00] fill-current" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 uppercase tracking-tighter">
          Datavora Admin
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700">Username</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Verifikasi Anti-Robot</label>
              <div className="mt-1 flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 whitespace-nowrap">
                  {captchaNum1} + {captchaNum2} =
                </span>
                <input
                  type="number"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-gray-50"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Jawaban"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
