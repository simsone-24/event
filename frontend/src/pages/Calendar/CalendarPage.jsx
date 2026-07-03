import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import dayjs from 'dayjs';

const STATUS_COLORS = {
  CONFIRMED: '#3b82f6',
  COMPLETED: '#10b981',
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const calRef = useRef(null);

  const loadEvents = (info) => {
    const start = dayjs(info?.start || new Date());
    customersAPI.getCalendarEvents({
      month: start.month() + 1,
      year:  start.year(),
    })
    .then(r => {
      setEvents(r.data.data.map(ev => ({
        id:    ev.id,
        title: `${ev.customerName} · ${ev.functionType}`,
        start: ev.functionDate,
        backgroundColor: STATUS_COLORS[ev.orderStatus] || '#6366f1',
        borderColor:     STATUS_COLORS[ev.orderStatus] || '#6366f1',
        extendedProps:   ev,
      })));
    })
    .catch(() => toast.error('Failed to load calendar events'));
  };

  useEffect(() => { loadEvents(null); }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Calendar</h1>
          <p className="text-sm text-muted">Confirmed &amp; completed bookings</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/>&nbsp;Confirmed</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>&nbsp;Completed</span>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <style>{`
          .fc { --fc-border-color: #334155; --fc-page-bg-color: transparent;
                --fc-neutral-bg-color: #1e293b; --fc-today-bg-color: rgba(59,130,246,.08);
                --fc-event-text-color: #fff; }
          .fc-toolbar-title { font-size:1rem !important; font-weight:700; color:#f1f5f9; }
          .fc-button { background:#334155 !important; border-color:#475569 !important; color:#cbd5e1 !important;
                       font-size:0.75rem !important; padding:0.35rem 0.75rem !important; border-radius:0.5rem !important; }
          .fc-button:hover { background:#475569 !important; }
          .fc-button-active { background:#2563eb !important; border-color:#2563eb !important; color:#fff !important; }
          .fc-col-header-cell-cushion, .fc-daygrid-day-number { color:#94a3b8; font-size:0.75rem; }
          .fc-event { border-radius:4px; font-size:0.7rem; padding:1px 4px; cursor:pointer; }
          .fc-toolbar { padding:1rem 1.25rem; border-bottom:1px solid #334155; }
          .fc-view-harness { padding:0; }
          .fc-list-event:hover td { background:#1e293b !important; }
          .fc-list-day-cushion { background:#0f172a !important; }
        `}</style>
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,listWeek' }}
          events={events}
          datesSet={loadEvents}
          eventClick={({ event }) => setSelected(event.extendedProps)}
          height="auto"
        />
      </div>

      {/* Event popup */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="card w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-100">{selected.customerName}</h2>
              <button onClick={() => setSelected(null)} className="btn-ghost p-1"><X size={16}/></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Function', selected.functionType],
                ['Plan', selected.functionPlan],
                ['Date', dayjs(selected.functionDate).format('DD MMM YYYY')],
                ['Location', selected.location],
                ['Status', selected.orderStatus],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted">{k}</span>
                  <span className="text-slate-200 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
