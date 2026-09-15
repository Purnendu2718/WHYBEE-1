import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import {
  CalendarCheck,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  Sun,
  BookOpen,
  Image,
  Coffee,
  Building2,
  Clock,
  BookMarked,
  Stethoscope,
  Key,
  FilePlus,
  Lightbulb,
  Users,
  FileBarChart,
  UserCheck,
  Award,
  Globe,
  Search,
  ArrowLeft,
} from 'lucide-react';

interface UtilityItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isReal?: boolean;
}

interface UtilitySection {
  title: string;
  accentColor: string;
  items: UtilityItem[];
}

export default function StudentUtilitiesPage() {
  const sections: UtilitySection[] = [
    {
      title: 'Academics',
      accentColor: 'bg-blue-600',
      items: [
        { name: 'Attendance', href: '/student/attendance', icon: <CalendarCheck className="w-5 h-5 text-emerald-600" />, isReal: true },
        { name: 'Circulars', href: '/student/utilities/circulars', icon: <FileText className="w-5 h-5 text-purple-600" /> },
        { name: 'Calendar', href: '/student/utilities/calendar', icon: <Calendar className="w-5 h-5 text-indigo-600" /> },
        { name: 'Holidays', href: '/student/utilities/holidays', icon: <Sun className="w-5 h-5 text-amber-500" /> },
        { name: 'Worksheets & Classwork', href: '/student/utilities/worksheets', icon: <BookOpen className="w-5 h-5 text-teal-600" /> },
        { name: 'Album', href: '/student/utilities/album', icon: <Image className="w-5 h-5 text-rose-500" /> },
        { name: 'Fees', href: '/student/fees', icon: <CreditCard className="w-5 h-5 text-emerald-600" />, isReal: true },
        { name: 'Canteen', href: '/student/utilities/canteen', icon: <Coffee className="w-5 h-5 text-orange-500" /> },
        { name: 'Institute Details', href: '/student/utilities/institute', icon: <Building2 className="w-5 h-5 text-slate-600" /> },
        { name: 'TimeTable', href: '/student/utilities/timetable', icon: <Clock className="w-5 h-5 text-blue-500" /> },
        { name: 'Exam Syllabus', href: '/student/utilities/syllabus', icon: <BookMarked className="w-5 h-5 text-violet-600" /> },
        { name: 'Exam / Results', href: '/student/results', icon: <GraduationCap className="w-5 h-5 text-blue-600" />, isReal: true },
      ],
    },
    {
      title: 'Administration',
      accentColor: 'bg-emerald-600',
      items: [
        { name: 'Medical Administration', href: '/student/utilities/medical', icon: <Stethoscope className="w-5 h-5 text-red-500" /> },
        { name: 'Gate Pass', href: '/student/utilities/gatepass', icon: <Key className="w-5 h-5 text-amber-600" /> },
      ],
    },
    {
      title: 'Upload',
      accentColor: 'bg-purple-600',
      items: [
        { name: 'Assignment', href: '/student/utilities/assignments', icon: <FilePlus className="w-5 h-5 text-purple-600" /> },
      ],
    },
    {
      title: 'Activity',
      accentColor: 'bg-amber-500',
      items: [
        { name: 'Idea Box', href: '/student/utilities/ideabox', icon: <Lightbulb className="w-5 h-5 text-amber-500" /> },
        { name: 'PTM', href: '/student/utilities/ptm', icon: <Users className="w-5 h-5 text-cyan-600" /> },
      ],
    },
    {
      title: 'Reports',
      accentColor: 'bg-rose-500',
      items: [
        { name: 'Monthly Study Report', href: '/student/utilities/monthlyreport', icon: <FileBarChart className="w-5 h-5 text-rose-600" /> },
        { name: 'Student Report', href: '/student/utilities/studentreport', icon: <UserCheck className="w-5 h-5 text-indigo-600" /> },
        { name: 'Activity Assessment Report', href: '/student/utilities/activityreport', icon: <Award className="w-5 h-5 text-emerald-600" /> },
      ],
    },
    {
      title: 'Social Media',
      accentColor: 'bg-sky-500',
      items: [
        { name: 'Official Website', href: '/student/utilities/website', icon: <Globe className="w-5 h-5 text-sky-600" /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Navbar
        title="Student Utilities Hub"
        role="student"
        extraRight={
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search utilities..."
              className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-36 sm:w-48"
            />
          </div>
        }
      />

      {/* Header Bar with Back Button */}
      <div className="flex items-center justify-between pb-2">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
        <span className="text-xs font-semibold text-slate-400">School ERP Services</span>
      </div>

      {/* Categorized Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            {/* Section Title with Colored Accent Bar */}
            <div className="flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full ${section.accentColor}`}></span>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {section.title}
              </h3>
            </div>

            {/* Grid of Utility Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group p-3.5 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition flex flex-col items-center text-center justify-between gap-2"
                >
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50 transition">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 leading-tight group-hover:text-blue-600 transition">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
