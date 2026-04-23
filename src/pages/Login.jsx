import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-1 bg-gato-950 items-center justify-center relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gato-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gato-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
            GATO<span className="text-gato-500">SPORTS</span>
          </h1>
          <p className="text-gato-500 text-lg font-light">Sales Representative Portal</p>
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gato-300">Live</div>
              <div className="text-xs text-gato-600 mt-1">Server Sync</div>
            </div>
            <div className="w-px h-10 bg-gato-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gato-300">Real-time</div>
              <div className="text-xs text-gato-600 mt-1">Order Data</div>
            </div>
            <div className="w-px h-10 bg-gato-800" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gato-300">Secure</div>
              <div className="text-xs text-gato-600 mt-1">Encrypted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center bg-gato-900 p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              GATO<span className="text-gato-500">SPORTS</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-gato-400 mt-1">
              Sign in with your PrestaShop account
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 mb-5">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gato-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gato-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gato-500 hover:text-gato-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full mt-6 py-2.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gato-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-gato-600 mt-8">
            GatoSports Sales Rep Desktop v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
