import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Check, HelpCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@edudecision.demo');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      await login(email, password);
      success('Authentication successful. Redirecting to institutional dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check institutional credentials.');
      error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError('');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#eaeff5] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Institutional Top Ribbon */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-neutral-300 pb-3 mb-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="EduDecision"
            className="w-10 h-10 object-contain bg-white rounded border border-neutral-300 p-0.5 shadow-sm group-hover:border-navy-400 transition-colors"
          />
          <div>
            <h1 className="text-lg font-bold text-navy-950 tracking-tight leading-tight group-hover:text-navy-700 transition-colors">
              EduDecision
            </h1>
            <p className="text-xs text-neutral-600 font-medium">
              Data-Driven Decision Support for Educational Institutions
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white border border-neutral-300 text-navy-900 font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-navy-700" />
            <span>Return to Portal Home</span>
          </Link>
          <div className="hidden sm:block text-right text-neutral-500">
            <div>Institutional Portal</div>
            <div className="font-mono text-[11px] text-teal-800 font-semibold">ISO 9001:2015 Compliant</div>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto">
        <div className="inst-card bg-white border border-neutral-300 shadow-panel rounded overflow-hidden">
          {/* Card Header */}
          <div className="bg-navy-900 text-white px-6 py-4 border-b border-navy-950 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">
                Academic Staff & Admin Login
              </h2>
              <p className="text-xs text-navy-200 mt-0.5">
                Enter your institutional identity credentials
              </p>
            </div>
            <Shield className="w-6 h-6 text-teal-400 opacity-90" />
          </div>

          <div className="p-6">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  Institutional Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@edudecision.demo"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-navy-800 focus:ring-navy-600"
                  />
                  <span>Remember session on this device</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setResetSubmitted(false);
                    setForgotModalOpen(true);
                  }}
                  className="text-navy-700 hover:text-navy-950 font-medium hover:underline text-xs"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs rounded border border-navy-950 shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Authenticating with Central Registry...' : 'Sign In to EduDecision Portal'}
              </button>
            </form>

            {/* Demo Accounts Quick-Select for Examination / Review */}
            <div className="mt-6 pt-5 border-t border-neutral-200">
              <div className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                <span>Working Demo Credentials (1-Click Fill)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin@edudecision.demo', 'admin123')}
                  className="p-2 border border-neutral-300 rounded bg-neutral-50 hover:bg-navy-50 hover:border-navy-400 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-navy-950">ADMIN</div>
                  <div className="text-[10px] text-neutral-500 truncate">Central Dean</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('hod@edudecision.demo', 'hod123')}
                  className="p-2 border border-neutral-300 rounded bg-neutral-50 hover:bg-navy-50 hover:border-navy-400 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-navy-950">HOD</div>
                  <div className="text-[10px] text-neutral-500 truncate">CSE Dept Head</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('faculty@edudecision.demo', 'faculty123')}
                  className="p-2 border border-neutral-300 rounded bg-neutral-50 hover:bg-navy-50 hover:border-navy-400 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-navy-950">FACULTY</div>
                  <div className="text-[10px] text-neutral-500 truncate">Course In-charge</div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 px-6 py-2.5 border-t border-neutral-200 text-center text-[11px] text-neutral-500">
            For academic login support, contact Registrar Office Ext: 204
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <div className="w-full max-w-4xl mx-auto text-center text-xs text-neutral-500 pt-6 border-t border-neutral-200">
        <p>© 2026 EduDecision. All rights reserved. Developed for Higher Education Administration & Analytics.</p>
        <p className="text-[11px] text-neutral-400 mt-1">Backend Target: Python FastAPI • PostgreSQL • Pandas • SciPy • Scikit-learn</p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Institutional Password Recovery"
        subtitle="Request password reset token through Academic Administration"
        maxWidth="max-w-md"
      >
        {resetSubmitted ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-navy-950 mb-1">Reset Instructions Dispatched</h4>
            <p className="text-xs text-neutral-600 mb-4">
              If an active staff account exists for <span className="font-semibold text-navy-900">{resetEmail || email}</span>, a temporary reset OTP has been sent via institutional SMS / email.
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="btn-primary px-4 py-1.5 text-xs bg-navy-800 text-white rounded"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-3 py-1">
            <p className="text-xs text-neutral-600">
              Please enter your registered staff email address. Your department administrator or examination cell will verify your request.
            </p>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                defaultValue={email}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@edudecision.demo"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
