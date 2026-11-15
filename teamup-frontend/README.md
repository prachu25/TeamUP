# TeamUp Frontend

React + Vite + Tailwind + Axios + React Router + Lucide.

## Run
    npm install
    cp .env.example .env     # set VITE_API_BASE_URL if needed (default http://localhost:8080)
    npm run dev

Your backend must allow CORS from http://localhost:5173.

## Structure
- `src/services/api.js`   centralized Axios client, Basic auth interceptor, all endpoints
- `src/config/contracts.js`  field names the UI reads from undocumented responses
- `src/context/AuthContext.jsx`  session (Basic credentials) handling
- `src/components`, `src/pages`, `src/hooks`

## Missing from the API docs (not invented)
1. **Login response**: where the user id lives. Needed for participate, cancel, create team, join request, accept/reject and update user. Set `LOGIN_USER_ID_FIELD`, or enter the id on the Profile page.
2. **Hackathon response**: field names for id and name (`HACKATHON_FIELDS`, currently inferred).
3. **Team response**: the documented example has no hackathon info. Add `hackathonName` or `hackathonId` to GET /api/teams to show hackathon names on team cards.
4. **CreateTeamRequestDTO** and **update user body**: pasted as raw JSON in the UI.
5. **Pending join requests**: no GET endpoint, so accept/reject take a typed id.
6. **Reject endpoint**: path value is listed as `teamId`; confirm whether it is a `requestId`.
7. **Logout**: documented as PUT /api/user/logout (verify; note `/api/users` elsewhere).
