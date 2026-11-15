import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api.js';

export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await fetcher()); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, reload: run };
}
