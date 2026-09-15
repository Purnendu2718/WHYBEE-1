import React from 'react';
import { getPaginatedStudents } from '@/lib/queries/students';
import { Navbar } from '@/components/shared/Navbar';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';
  const limit = 8;

  const { data: students, total, error } = await getPaginatedStudents(page, limit, search);
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      <Navbar title="Student Directory (Paginated CRUD)" role="admin" />

      {/* Control Bar: Search & Page Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form method="GET" className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by Roll No or Class..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-purple-500"
          />
        </form>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            Total: {total} Students (Page {page} of {totalPages})
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {students.length === 0 ? (
          <EmptyState title="No Students Found" description="Try adjusting your search query or run seed script." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Class & Section</th>
                  <th className="px-6 py-3">Gender</th>
                  <th className="px-6 py-3">Parent Contact</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-800">{s.roll_no}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">
                      {s.profile?.full_name || 'Student'}
                      <div className="text-xs text-slate-400 font-normal">{s.profile?.email}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">
                      {s.class} - {s.section}
                    </td>
                    <td className="px-6 py-3.5 capitalize text-slate-500">{s.gender || 'N/A'}</td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {s.parent_profile?.full_name || 'Unlinked'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Link
            href={`/admin/students?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`}
            className={`px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 ${
              page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Link>

          <span className="text-xs font-medium text-slate-500">
            Page {page} of {totalPages}
          </span>

          <Link
            href={`/admin/students?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}`}
            className={`px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1 ${
              page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-100'
            }`}
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
