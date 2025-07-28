'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import CollegeCard from '../../components/CollegeCard'
import Papa from 'papaparse'

type College = {
  id: number;
  college_name: string;
  course: string;
  location: string;
  cutoff_rank: number;
  year: number;
  // to be populated after fetch
  trendData?: { year: number; cutoff_rank: number }[];
};

const ALL_COL_FIELDS = 'id,college_name,course,location,cutoff_rank,year';

export default function Results() {
  const params = useSearchParams()
  const exam = params.get('exam') || ''
  const category = params.get('category') || ''
  const rank = Number(params.get('rank') || 0)
  const course = params.get('course') || ''
  const [colleges, setColleges] = useState<College[]>([])
  const [filtered, setFiltered] = useState<College[]>([])
  const [search, setSearch] = useState('')

  // Fetch main filtered data
  useEffect(() => {
    async function fetchColleges() {
      let query = supabase
        .from('colleges')
        .select(ALL_COL_FIELDS)
        .eq('exam', exam)
        .eq('category', category)
        .lte('cutoff_rank', rank);
      if (course) query = query.eq('course', course);

      query = query.order('cutoff_rank', { ascending: true });

      const { data } = await query;
      setColleges(data || []);
    }
    if (exam && category && rank) fetchColleges();
  }, [exam, category, rank, course]);

  // Fetch trend data for each college-row (in serial to minimize load)
  useEffect(() => {
    const fillTrends = async () => {
      const updated = await Promise.all(
        colleges.map(async c => {
          const { data } = await supabase.from('colleges')
            .select('year,cutoff_rank')
            .eq('exam', exam)
            .eq('category', category)
            .eq('college_name', c.college_name)
            .eq('course', c.course)
            .order('year');
          return { ...c, trendData: data || [] };
        })
      );
      setFiltered(updated);
    };
    if (colleges.length) fillTrends();
  }, [colleges, exam, category]);

  // Simple search filter
  const finalList = search.trim()
    ? filtered.filter(c =>
        c.college_name.toLowerCase().includes(search.toLowerCase()) ||
        c.course.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  // Download as CSV
  function downloadCSV() {
    const csv = Papa.unparse(finalList.map(({ trendData, ...rest }) => rest)); // exclude extra objects
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_colleges.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filter reset
  function removeFilter(name: string) {
    const paramsNew = new URLSearchParams(params.toString());
    paramsNew.delete(name);
    window.location.search = paramsNew.toString();
  }

// ...imports and logic unchanged
return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-10 px-4 text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">🎯 Colleges matching your profile</h2>
  
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {exam && (
            <span className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Exam: {exam}
              <button onClick={() => removeFilter('exam')} className="ml-2 font-bold hover:text-blue-500">×</button>
            </span>
          )}
          {category && (
            <span className="flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              Category: {category}
              <button onClick={() => removeFilter('category')} className="ml-2 font-bold hover:text-green-500">×</button>
            </span>
          )}
          {rank && (
            <span className="flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              Rank: {rank}
              <button onClick={() => removeFilter('rank')} className="ml-2 font-bold hover:text-purple-500">×</button>
            </span>
          )}
          {course && (
            <span className="flex items-center bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
              Course: {course}
              <button onClick={() => removeFilter('course')} className="ml-2 font-bold hover:text-orange-500">×</button>
            </span>
          )}
          {search && (
            <span className="flex items-center bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
              Search: {search}
              <button onClick={() => setSearch('')} className="ml-2 font-bold hover:text-gray-600">×</button>
            </span>
          )}
        </div>
  
        {/* Actions: Search + CSV */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by college or course..."
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={downloadCSV}
            disabled={!finalList.length}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              finalList.length
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            ⬇️ Download CSV
          </button>
        </div>
  
        {/* No results */}
        {!finalList.length && (
          <div className="text-center text-gray-500 text-lg py-16">No colleges found matching your criteria.</div>
        )}
  
        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {finalList.map((c, i) => (
            <CollegeCard key={i} college={c as any} />
          ))}
        </div>
      </div>
    </div>
  )
  
}
