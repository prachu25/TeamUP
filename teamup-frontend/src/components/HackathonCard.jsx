import { CalendarDays } from 'lucide-react';
import { Button } from './ui.jsx';
import { HACKATHON_FIELDS as HF } from '../config/contracts.js';

const isPrimitive = (v) => ['string', 'number', 'boolean'].includes(typeof v);

export default function HackathonCard({ hackathon, onParticipate, onCancel, busy }) {
  const id = hackathon[HF.id];
  const name = hackathon[HF.name];
  // Other fields are shown generically since the response shape is undocumented
  const extras = Object.entries(hackathon).filter(([k, v]) => k !== HF.id && k !== HF.name && isPrimitive(v) && v !== '');

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="rounded-xl bg-violet-soft p-2 text-violet"><CalendarDays className="h-5 w-5" /></span>
        <h3 className="text-xl font-bold leading-snug">{name ?? `Hackathon ${id ?? ''}`}</h3>
      </div>
      {extras.length > 0 && (
        <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          {extras.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="min-w-0 break-words">{String(v)}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-auto flex gap-2">
        <Button onClick={() => onParticipate(id)} loading={busy} disabled={id == null} className="flex-1">Participate</Button>
        <Button variant="ghost" onClick={() => onCancel(id)} disabled={busy || id == null}>Cancel</Button>
      </div>
    </article>
  );
}
