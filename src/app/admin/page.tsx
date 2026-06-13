import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboard() {
  const events = await prisma.event.findMany({
    include: { arenas: true },
    orderBy: { eventDate: 'desc' }
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Event Control Room Portal</h1>
        <p className="text-slate-500 font-medium">Select an active or upcoming show to manage arena flows and rider orders</p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                    event.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    event.status === 'UPCOMING' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {event.status === 'ACTIVE' ? 'Active' : event.status === 'UPCOMING' ? 'Scheduled' : 'Completed'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {event.qualifier}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">{event.name}</h2>
                  <p className="text-sm text-slate-500 mt-2 font-semibold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.eventDate)}
                  </p>
                </div>

                <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <span>
                    <strong className="text-slate-800 font-black">{event.arenas.length}</strong> Arenas under management
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/admin/event/${event.id}`} className="block text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors uppercase tracking-wider">
                  Manage Arenas &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500 font-medium">
          No events found in database.
        </div>
      )}
    </div>
  );
}
