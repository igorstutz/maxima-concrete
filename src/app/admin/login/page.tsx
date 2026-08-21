"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        router.replace("/admin/");
      } else {
        setError(data.error || "Login failed. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-28 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your password to view the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-ocean focus:ring-2 focus:ring-accent/20 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-ocean to-primary text-white font-semibold rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Maxima Concrete — internal dashboard
        </p>
      </div>
    </section>
  );
}
