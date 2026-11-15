/**
 * API CONTRACT GAPS
 * ------------------------------------------------------------------
 * The API documentation does not specify these response shapes.
 * Nothing below is invented backend data: these are only the names of
 * fields the UI reads. Set them to match your real responses.
 * Anything left null is reported in the UI instead of being guessed.
 */

// Field in the POST /api/auth/login response that holds the user's id.
// NOT documented. Until set, the user enters their id once in Profile.
export const LOGIN_USER_ID_FIELD = 'userId'; // e.g. 'userId' or 'id'

// Hackathon object fields from GET /api/hackathons (response NOT documented).
// 'hackathonId' is inferred from the team entity + path param; verify it.
// 'name' is inferred from the search param; verify it.
export const HACKATHON_FIELDS = {
  id: 'hackathonId',
  name: 'name',
};

// Team fields from GET /api/teams (documented example).
export const TEAM_FIELDS = {
  id: 'teamId',
  name: 'teamName',
  leader: 'leaderName',
  current: 'currentMembers',
  max: 'maxMembers',
  members: 'members',
  // The documented team response has NO hackathon info. The UI uses
  // either of these if the backend adds them. Both are unverified.
  hackathonName: 'hackathonName',
  hackathonId: 'hackathonId',
};
