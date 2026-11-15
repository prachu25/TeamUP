import { useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import { Alert, Button, ContractNotice, EmptyState, PageHeader, Spinner } from '../components/ui.jsx';
import HackathonCard from '../components/HackathonCard.jsx';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api, getErrorMessage } from '../services/api.js';
import { HACKATHON_FIELDS as HF } from '../config/contracts.js';

export default function Hackathons() {
  const { userId } = useAuth();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const { data, loading, error } = useFetch(
    () => (active ? api.searchHackathons(active) : api.getHackathons()), [active]
  );
  const list = Array.isArray(data) ? data : [];
  const missingFields = list.length > 0 && list.some((h) => h[HF.id] == null || h[HF.name] == null);

  const act = async (fn, okText) => {
    if (!userId) return setNotice({ type: 'error', text: 'Your user id is needed first. Add it on the Profile page.' });
    setBusy(true); setNotice({ type: '', text: '' });
    try { await fn(); setNotice({ type: 'success', text: okText }); }
    catch (e) { setNotice({ type: 'error', text: getErrorMessage(e) }); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Hackathons">
        <form onSubmit={(e) => { e.preventDefault(); setActive(query.trim()); }} className="flex gap-2">
          <input aria-label="Search hackathons by name" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name" className="w-48 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm sm:w-64" />
          <Button type="submit" variant="lime"><Search className="h-4 w-4" />Search</Button>
        </form>
      </PageHeader>

      <div className="mb-4 space-y-3">
        <Alert type={notice.type || 'info'}>{notice.text}</Alert>
        {!userId && <ContractNotice>Participating needs your user id, and the login response does not document where it is. Enter it on the Profile page (or set LOGIN_USER_ID_FIELD in src/config/contracts.js).</ContractNotice>}
        {missingFields && <ContractNotice>Some hackathons are missing the fields “{HF.id}” or “{HF.name}”. The hackathon response isn’t documented, so update HACKATHON_FIELDS in src/config/contracts.js.</ContractNotice>}
      </div>

      {loading ? <Spinner label="Loading hackathons" /> : error ? <Alert>{error}</Alert> :
        list.length === 0 ? (
          <EmptyState icon={Trophy} title={active ? `No hackathons match “${active}”` : 'No hackathons yet'}>
            {active ? 'Try a different name.' : 'Hackathons will show up here once they are added.'}
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((h, i) => (
              <HackathonCard key={h[HF.id] ?? i} hackathon={h} busy={busy}
                onParticipate={(id) => act(() => api.participate(id, userId), 'You are registered for this hackathon.')}
                onCancel={(id) => act(() => api.cancelParticipation(userId, id), 'Your participation was cancelled.')} />
            ))}
          </div>
        )}
    </>
  );
}
