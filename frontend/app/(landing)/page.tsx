import Link from 'next/link';
import { GraduationCap, Users, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-8 py-6 border-b border-slate-800 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">CampusERP</h1>
            <p className="text-xs text-slate-400">Integrated Student Management System</p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
          Hackathon MVP Edition
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-8 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Select Your Portal
          </h2>
          <p className="text-slate-400 text-base">
            Access your personalized portal to manage academic performance, track real-time attendance, review fees, or manage institutional records.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Student Portal Card */}
          <Link
            href="/auth/student"
            className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 p-8 rounded-2xl transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-4 bg-blue-600/10 text-blue-400 rounded-xl w-fit mb-6 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                Student Portal
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                View your subject-wise marks, attendance breakdown, fee status, and individual profile.
              </p>
            </div>
            <div className="flex items-center text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition">
              <span>Sign In as Student</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {/* Parent Portal Card */}
          <Link
            href="/auth/parent"
            className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-8 rounded-2xl transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-4 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit mb-6 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                Parent Portal
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Monitor your child&apos;s academic progress, attendance percentage, and pending fee dues.
              </p>
            </div>
            <div className="flex items-center text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition">
              <span>Sign In as Parent</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link
            href="/auth/admin"
            className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 p-8 rounded-2xl transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="p-4 bg-purple-600/10 text-purple-400 rounded-xl w-fit mb-6 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                Faculty / Admin Portal
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Paginated student management, bulk class attendance recording, mark sheets, and financial status.
              </p>
            </div>
            <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition">
              <span>Sign In as Faculty</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        CampusERP MVP — Next.js 14 App Router + Supabase RLS Defense-in-Depth Architecture
      </footer>
    </div>
  );
}
