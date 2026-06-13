import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface AdminEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function AdminEventDashboard({ params }: AdminEventPageProps) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      arenas: true
    }
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Back button and event title */}
      <div className="border-b border-slate-200 pb-4">
        <Link href="/admin" className="text-slate-500 hover:text-blue-500 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mb-2">
          &larr; Back to all Events
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">{event.name}</h1>
            <p className="text-slate-500 font-medium">{event.venue} &nbsp;·&nbsp; {event.qualifier}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
            event.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            event.status === 'UPCOMING' ? 'bg-blue-50 border-blue-200 text-blue-700' :
            'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {event.status === 'ACTIVE' ? 'Active' : event.status === 'UPCOMING' ? 'Scheduled' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Arenas List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Arenas under management</h2>
        
        {event.arenas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.arenas.map(arena => (
              <Link key={arena.id} href={`/admin/arenas/${arena.id}`} className="block">
                <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-slate-50">
                  <h3 className="font-bold text-lg text-slate-900">{arena.name}</h3>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      arena.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      arena.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                      ['ARENA_RAKE', 'COURSE_CHANGE'].includes(arena.status) ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {arena.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-400 italic text-sm">
            No arenas registered for this event.
          </div>
        )}
      </div>
    </div>
  );
}
