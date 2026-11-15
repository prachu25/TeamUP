
import axios from 'axios';

const SESSION_KEY = 'teamup_session';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const encodeBasic = (email, password) =>
  btoa(unescape(encodeURIComponent(`${email}:${password}`)));

export const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const writeSession = (s) =>
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));

export const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);

// HTTP Basic auth on every request except public auth endpoints
client.interceptors.request.use((config) => {
  const isPublic = config.url?.startsWith('/api/auth/');
  const session = readSession();

  if (!isPublic && session?.token) {
    config.headers.Authorization = `Basic ${session.token}`;
  }

  return config;
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (
      err.response?.status === 401 &&
      !err.config?.url?.startsWith('/api/auth/')
    ) {
      clearSession();
      window.dispatchEvent(new Event('teamup:unauthorized'));
    }

    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) => {
  if (!err.response) {
    return 'Cannot reach the server. Check that the backend is running and CORS allows this origin.';
  }

  const d = err.response.data;

  if (typeof d === 'string' && d.trim()) return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;

  return `Request failed (HTTP ${err.response.status}).`;
};

const get = (url, config) =>
  client.get(url, config).then((r) => r.data);

export const api = {

  // Auth
  register: ({ name, email, password }) =>
    client.post('/api/auth/register', {
      name,
      email,
      password,
      timezone: 'Asia/Kolkata'
    }).then((r) => r.data),

  login: ({ email, password }) =>
    client.post('/api/auth/login', {
      email,
      password
    }).then((r) => r.data),

  logout: () =>
    client.put('/api/user/logout').then((r) => r.data),

  // Hackathons
  getHackathons: () => get('/api/hackathons'),

  searchHackathons: (name) =>
    get('/api/hackathons/search', { params: { name } }),

  participate: (hackathonId, userId) =>
    client.post(
      `/api/hackathons/${hackathonId}/participate`,
      null,
      { params: { userId } }
    ).then((r) => r.data),


  // Cancel Participation
  cancelParticipation: (userId, hackathonId) =>
    client.delete('/api/hackathons/participants/cancle', {
      params: { userId, hackathonId }
    }).then((r) => r.data),

  // Teams
  getTeams: () => get('/api/teams'),

  // Create team with Idempotency-Key header
  createTeam: (userId, body, idempotencyKey) =>
    client.post(
      '/api/teams/create',
      body,
      {
        params: { userId },
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      }
    ).then((r) => r.data),

  // Join requests
  sendJoinRequest: (teamId, userId) =>
    client.post(
      '/api/join-requests/send',
      null,
      { params: { teamId, userId } }
    ).then((r) => r.data),

  acceptJoinRequest: (requestId, leaderId) =>
    client.put(
      `/api/join-requests/accept/${requestId}`,
      null,
      { params: { leaderId } }
    ).then((r) => r.data),

  rejectJoinRequest: (id, leaderId) =>
    client.put(
      `/api/join-requests/reject/${id}`,
      null,
      { params: { leaderId } }
    ).then((r) => r.data),


  // Users
  getUsers: () => get('/api/users'),

  checkLeader: (userId) => get(`/api/teams/check-leader/${userId}`),

  getMyTeams: (userId) => get(`/api/teams/my-teams/${userId}`),

  getPendingRequests: (teamId, leaderId) =>
    get(`/api/join-requests/pending/${teamId}`, {
      params: { leaderId }
    }),


  updateUser: (userId, body) =>
    client.put(`/api/users/${userId}`, body).then((r) => r.data),
};
