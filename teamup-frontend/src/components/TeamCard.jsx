import { Crown, Trophy, UserPlus } from 'lucide-react';
import { Button } from './ui.jsx';
import { TEAM_FIELDS as TF } from '../config/contracts.js';

export default function TeamCard({ team, hackathonName, onJoin, busy }) {
  const members = team[TF.members];
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-5">
      <p className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-xs font-bold">
        <Trophy className="h-3.5 w-3.5" />
        {hackathonName ?? 'Hackathon name unavailable'}
      </p>
      <h3 className="text-xl font-bold">{team[TF.name]}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <Crown className="h-4 w-4" /> Led by {team[TF.leader] ?? 'unknown'}
      </p>
      <p className="mt-3 text-sm">
        <span className="font-bold">{team[TF.current] ?? '?'}</span> of {team[TF.max] ?? '?'} members
      </p>
      {Array.isArray(members) && members.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {members.map((m, i) => (
            <li key={`${m}-${i}`} className="rounded-full bg-violet-soft px-2.5 py-1 text-xs font-bold text-violet-deep">{String(m)}</li>
          ))}
        </ul>
      )}
      <Button variant="ghost" onClick={() => onJoin(team[TF.id])} loading={busy} className="mt-5">
        <UserPlus className="h-4 w-4" /> Request to join
      </Button>
    </article>
  );
}
