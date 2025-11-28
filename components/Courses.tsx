import React from 'react';
import { BookOpen, PlayCircle, Plus, Users, Clock, MoreVertical, FileText, Video } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Option Buying Mastery 2.0',
    thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=400',
    students: 1240,
    lessons: 24,
    duration: '12h 30m',
    price: '₹4,999',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Swing Trading Secrets',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=400',
    students: 850,
    lessons: 18,
    duration: '8h 15m',
    price: '₹2,999',
    status: 'Published'
  },
  {
    id: 3,
    title: 'Crypto Technical Analysis',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400',
    students: 0,
    lessons: 5,
    duration: '2h 10m',
    price: '₹1,499',
    status: 'Draft'
  },
];

const Courses: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Course LMS</h2>
           <p className="text-slate-400 text-sm">Create and sell courses to your community.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
               <BookOpen size={24} />
            </div>
            <div>
               <p className="text-slate-400 text-xs font-semibold uppercase">Total Courses</p>
               <h3 className="text-2xl font-bold text-white">3</h3>
            </div>
         </div>
         <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
               <Users size={24} />
            </div>
            <div>
               <p className="text-slate-400 text-xs font-semibold uppercase">Total Students</p>
               <h3 className="text-2xl font-bold text-white">2,090</h3>
            </div>
         </div>
         <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
               <PlayCircle size={24} />
            </div>
            <div>
               <p className="text-slate-400 text-xs font-semibold uppercase">Completion Rate</p>
               <h3 className="text-2xl font-bold text-white">64%</h3>
            </div>
         </div>
      </div>

      {/* Course Grid */}
      <h3 className="text-lg font-bold text-white mt-8 mb-4">Your Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
           <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden group hover:border-slate-500 transition-all shadow-lg">
              <div className="relative h-48 overflow-hidden">
                 <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
                    {course.status}
                 </div>
              </div>
              <div className="p-5">
                 <h4 className="text-lg font-bold text-white mb-2">{course.title}</h4>
                 <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Video size={14} /> {course.lessons} Lessons</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {course.students}</span>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-xl font-bold text-emerald-400">{course.price}</span>
                    <button className="text-slate-300 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors">
                       <MoreVertical size={20} />
                    </button>
                 </div>
              </div>
           </div>
        ))}

        {/* Add New Placeholder */}
        <button className="border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 hover:border-indigo-500/50 hover:bg-indigo-900/10 transition-all group min-h-[300px]">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-4">
              <Plus size={32} />
           </div>
           <h4 className="font-bold text-slate-300 group-hover:text-white">Create New Course</h4>
           <p className="text-sm text-slate-500 mt-1">Upload videos, PDFs & quizzes</p>
        </button>
      </div>
    </div>
  );
};

export default Courses;