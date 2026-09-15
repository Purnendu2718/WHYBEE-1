import React from 'react';
import { ComingSoonPlaceholder } from '@/components/shared/ComingSoonPlaceholder';
import {
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
} from 'lucide-react';

const featureMetadata: Record<string, { title: string; icon: React.ReactNode }> = {
  circulars: { title: 'Circulars & Notices', icon: <FileText className="w-10 h-10" /> },
  calendar: { title: 'Academic Calendar', icon: <Calendar className="w-10 h-10" /> },
  holidays: { title: 'Holidays List', icon: <Sun className="w-10 h-10" /> },
  worksheets: { title: 'Worksheets & Classwork', icon: <BookOpen className="w-10 h-10" /> },
  album: { title: 'Campus Photo Album', icon: <Image className="w-10 h-10" /> },
  canteen: { title: 'Canteen Menu & Coupon', icon: <Coffee className="w-10 h-10" /> },
  institute: { title: 'Institute Details', icon: <Building2 className="w-10 h-10" /> },
  timetable: { title: 'Class TimeTable', icon: <Clock className="w-10 h-10" /> },
  syllabus: { title: 'Exam Syllabus', icon: <BookMarked className="w-10 h-10" /> },
  medical: { title: 'Medical Administration', icon: <Stethoscope className="w-10 h-10" /> },
  gatepass: { title: 'Digital Gate Pass', icon: <Key className="w-10 h-10" /> },
  assignments: { title: 'Assignment Submission', icon: <FilePlus className="w-10 h-10" /> },
  ideabox: { title: 'Campus Idea Box', icon: <Lightbulb className="w-10 h-10" /> },
  ptm: { title: 'Parent Teacher Meeting (PTM)', icon: <Users className="w-10 h-10" /> },
  monthlyreport: { title: 'Monthly Study Report', icon: <FileBarChart className="w-10 h-10" /> },
  studentreport: { title: 'Student Progress Report', icon: <UserCheck className="w-10 h-10" /> },
  activityreport: { title: 'Activity Assessment Report', icon: <Award className="w-10 h-10" /> },
  website: { title: 'School Official Website', icon: <Globe className="w-10 h-10" /> },
};

export default function UtilityFeaturePage({ params }: { params: { feature: string } }) {
  const slug = params.feature.toLowerCase();
  const meta = featureMetadata[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    icon: <Clock className="w-10 h-10" />,
  };

  return <ComingSoonPlaceholder title={meta.title} icon={meta.icon} />;
}
