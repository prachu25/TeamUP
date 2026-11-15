
import { useState } from 'react';
import { Users, Plus, Trophy, Crown, UserPlus, X } from 'lucide-react';

import { api, getErrorMessage, readSession } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { HACKATHON_FIELDS as HF } from '../config/contracts.js';

import {
  Alert,
  Button,
  Field,
  PageHeader,
  Spinner,
  EmptyState
} from '../components/ui.jsx';

function Teams() {
  const { userId } = useAuth();

  // Fetch all teams
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
    reload: reloadTeams
  } = useFetch(() => api.getTeams(), []);

  // Fetch hackathons
  const {
    data: hackathonsData,
    loading: hackathonsLoading,
    error: hackathonsError
  } = useFetch(() => api.getHackathons(), []);

  const teams = Array.isArray(teamsData) ? teamsData : [];
  const hackathons = Array.isArray(hackathonsData) ? hackathonsData : [];

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState({
    teamName: '',
    hackathonId: '',
    minMembers: '',
    maxMembers: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [joiningTeam, setJoiningTeam] = useState(null);

  const [message, setMessage] = useState({
    type: 'info',
    text: ''
  });

  const [joinMessage, setJoinMessage] = useState({});

  const [idempotencyKey, setIdempotencyKey] = useState(null);

  // Get authenticated user ID
  const getCurrentUserId = () =>
    userId ?? readSession()?.userId;

  // Form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setIdempotencyKey(null);
  };

  // Create team
  const handleCreateTeam = async (e) => {
    e.preventDefault();

    setMessage({ type: 'info', text: '' });

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setMessage({
        type: 'error',
        text: 'User ID not found. Please login again.'
      });
      return;
    }

    if (!form.teamName.trim() || !form.hackathonId) {
      setMessage({
        type: 'error',
        text: 'Please enter team name and select a hackathon.'
      });
      return;
    }

    const min = Number(form.minMembers);
    const max = Number(form.maxMembers);

    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 1 ||
      max < 1 ||
      min > max
    ) {
      setMessage({
        type: 'error',
        text: 'Enter valid member limits.'
      });
      return;
    }

    const body = {
      teamName: form.teamName.trim(),
      hackathonId: Number(form.hackathonId),
      minMembers: min,
      maxMembers: max
    };

    try {
      setSubmitting(true);

      const key = idempotencyKey || crypto.randomUUID();
      setIdempotencyKey(key);

      await api.createTeam(currentUserId, body, key);

      setMessage({
        type: 'success',
        text: 'Team created successfully!'
      });

      setForm({
        teamName: '',
        hackathonId: '',
        minMembers: '',
        maxMembers: ''
      });

      setIdempotencyKey(null);
      setShowCreateForm(false);

      reloadTeams();

    } catch (err) {
      setMessage({
        type: 'error',
        text: getErrorMessage(err)
      });

    } finally {
      setSubmitting(false);
    }
  };

  // Send join request
  const handleJoinRequest = async (teamId) => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setJoinMessage((prev) => ({
        ...prev,
        [teamId]: {
          type: 'error',
          text: 'Please login again.'
        }
      }));
      return;
    }

    try {
      setJoiningTeam(teamId);

      await api.sendJoinRequest(teamId, currentUserId);

      setJoinMessage((prev) => ({
        ...prev,
        [teamId]: {
          type: 'success',
          text: 'Join request sent successfully!'
        }
      }));

    } catch (err) {
      setJoinMessage((prev) => ({
        ...prev,
        [teamId]: {
          type: 'error',
          text: getErrorMessage(err)
        }
      }));

    } finally {
      setJoiningTeam(null);
    }
  };

  if (teamsLoading || hackathonsLoading) {
    return <Spinner label="Loading teams" />;
  }

  return (
    <div className="space-y-6">

      <PageHeader title="Teams" />

      {/* Page message */}
      {message.text && (
        <Alert type={message.type}>
          {message.text}
        </Alert>
      )}

      {/* Create Team Section */}
      <section className="rounded-2xl border border-line bg-white p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Create Your Own Team
            </h2>

            <p className="mt-1 text-sm text-muted">
              Start a new team and become its leader.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setMessage({ type: 'info', text: '' });
            }}
          >
            {showCreateForm ? (
              <>
                <X size={16} /> Close Form
              </>
            ) : (
              <>
                <Plus size={16} /> Create Team
              </>
            )}
          </Button>

        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateTeam}
            className="mt-6 space-y-4 border-t border-line pt-5"
          >

            <h3 className="font-bold text-lg">
              New Team Details
            </h3>

            {hackathonsError && (
              <Alert type="error">
                {hackathonsError}
              </Alert>
            )}

            <Field
              id="teamName"
              name="teamName"
              label="Team Name"
              required
              placeholder="Enter your team name"
              value={form.teamName}
              onChange={handleChange}
            />

            <div>
              <label
                htmlFor="hackathonId"
                className="mb-1.5 block text-sm font-bold"
              >
                Select Hackathon
              </label>

              <select
                id="hackathonId"
                name="hackathonId"
                required
                value={form.hackathonId}
                onChange={handleChange}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="">
                  Choose a hackathon
                </option>

                {hackathons.map((hackathon) => (
                  <option
                    key={hackathon[HF.id]}
                    value={hackathon[HF.id]}
                  >
                    {hackathon[HF.name]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <Field
                id="minMembers"
                name="minMembers"
                label="Minimum Members"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g. 2"
                value={form.minMembers}
                onChange={handleChange}
              />

              <Field
                id="maxMembers"
                name="maxMembers"
                label="Maximum Members"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g. 5"
                value={form.maxMembers}
                onChange={handleChange}
              />

            </div>

            {message.text && (
              <Alert type={message.type}>
                {message.text}
              </Alert>
            )}

            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
            >
              Create Team
            </Button>

          </form>
        )}
      </section>

      {/* All Teams Section */}
      <section className="space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Explore All Teams
            </h2>

            <p className="mt-1 text-sm text-muted">
              Find a team and send a request to join.
            </p>
          </div>

          <Button
            type="button"
            color="secondary"
            variant="outline"
            onClick={reloadTeams}
          >
            Refresh
          </Button>
        </div>

        {teamsError && (
          <Alert type="error">
            {teamsError}
          </Alert>
        )}

        {teams.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No teams available"
          >
            No teams have been created yet.
            You can create the first team!
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {teams.map((team) => (
              <div
                key={team.teamId}
                className="rounded-2xl border border-line bg-white p-5 shadow-sm space-y-4"
              >

                {/* Team heading */}
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="text-lg font-bold">
                      {team.teamName}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-violet-deep">
                      <Trophy size={16} />
                      <span>
                        {team.hackathonName || 'Hackathon name unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-violet-50 p-3">
                    <Users size={22} className="text-violet-deep" />
                  </div>

                </div>

                {/* Leader */}
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Crown size={16} />
                  <span>
                    Leader: {team.leaderName || 'Unknown'}
                  </span>
                </div>

                {/* Members */}
                <div className="space-y-2">

                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">
                      Team Members
                    </span>

                    <span className="text-muted">
                      {team.currentMembers ?? 0} members
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {(team.members || []).map((member, index) => (
                      <span
                        key={`${team.teamId}-${index}`}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium"
                      >
                        {member}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Available seats */}
                <div className="flex items-center justify-between border-t border-line pt-3">

                  <span className="text-sm text-muted">
                    Available Seats
                  </span>

                  <span className="text-sm font-bold">
                    {team.availableSeats ?? 0}
                  </span>

                </div>

                {/* Join request feedback */}
                {joinMessage[team.teamId] && (
                  <Alert type={joinMessage[team.teamId].type}>
                    {joinMessage[team.teamId].text}
                  </Alert>
                )}

                {/* Join button */}
                <Button
                  type="button"
                  block
                  disabled={
                    joiningTeam !== null ||
                    Number(team.availableSeats) <= 0
                  }
                  loading={joiningTeam === team.teamId}
                  onClick={() => handleJoinRequest(team.teamId)}
                >
                  <UserPlus size={16} />
                  {Number(team.availableSeats) <= 0
                    ? 'Team Full'
                    : 'Send Join Request'}
                </Button>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Teams;
