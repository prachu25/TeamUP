
import { useCallback, useEffect, useState } from 'react';
import { Crown, Users, Trophy, Check, X, RefreshCw } from 'lucide-react';

import { api, getErrorMessage, readSession } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

import {
    Alert,
    Button,
    PageHeader,
    Spinner,
    EmptyState
} from '../components/ui.jsx';

function LeaderDashboard() {
    const { userId } = useAuth();
    const currentUserId = userId ?? readSession()?.userId;

    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);
    const [teams, setTeams] = useState([]);
    const [requests, setRequests] = useState({});
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(null);
    const [message, setMessage] = useState({
        type: 'success',
        text: ''
    });

    // Fetch pending requests for each team
    const fetchRequests = useCallback(async (myTeams) => {
        const results = await Promise.all(
            myTeams.map(async (team) => {
                try {
                    const data = await api.getPendingRequests(
                        team.teamId,
                        currentUserId
                    );

                    return [team.teamId, {
                        data: Array.isArray(data) ? data : [],
                        error: ''
                    }];
                } catch (err) {
                    return [team.teamId, {
                        data: [],
                        error: getErrorMessage(err)
                    }];
                }
            })
        );

        setRequests(Object.fromEntries(results));
    }, [currentUserId]);

    // Load leader dashboard
    const loadDashboard = useCallback(async () => {
        if (!currentUserId) {
            setError('User ID not found. Please login again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setMessage('');

            // 1. Check whether user is a leader
            const result = await api.checkLeader(currentUserId);

            if (!result.isLeader) {
                setIsLeader(false);
                setTeams([]);
                setRequests({});
                return;
            }

            setIsLeader(true);

            // 2. Fetch only this leader's teams
            const myTeams = await api.getMyTeams(currentUserId);

            const safeTeams = Array.isArray(myTeams) ? myTeams : [];

            setTeams(safeTeams);

            // 3. Fetch pending requests for each team
            await fetchRequests(safeTeams);

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [currentUserId, fetchRequests]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    // Accept or reject request
    const handleRequest = async (requestId, teamId, action) => {
        try {
            setProcessing(requestId);
            setMessage('');

            if (action === 'accept') {
                await api.acceptJoinRequest(requestId, currentUserId);
            } else {
                await api.rejectJoinRequest(requestId, currentUserId);
            }

            setMessage(
                action === 'accept'
                    ? 'Join request accepted successfully!'
                    : 'Join request rejected successfully!'
            );

            // Refresh pending requests after action
            const data = await api.getPendingRequests(teamId, currentUserId);

            setRequests((prev) => ({
                ...prev,
                [teamId]: {
                    data: Array.isArray(data) ? data : [],
                    error: ''
                }
            }));

        } catch (err) {
            setMessage(getErrorMessage(err));
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <Spinner label="Loading Leader Dashboard..." />;
    }

    if (error) {
        return (
            <div className="space-y-4">
                <PageHeader title="Leader Dashboard" />
                <Alert type="error">{error}</Alert>
                <Button onClick={loadDashboard}>
                    <RefreshCw size={16} /> Retry
                </Button>
            </div>
        );
    }

    if (!isLeader) {
        return (
            <div className="space-y-5">
                <PageHeader title="Leader Dashboard" />
                <EmptyState
                    icon={Crown}
                    title="Access Denied"
                >
                    You are not a leader of any team.
                    Create a team to become a leader.
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <PageHeader title="Leader Dashboard" />

            {message && (
                <Alert type="success">{message}</Alert>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">My Teams</h2>
                    <p className="mt-1 text-sm text-muted">
                        Manage join requests for your teams.
                    </p>
                </div>

                <Button
                    color="secondary"
                    variant="outline"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={16} /> Refresh
                </Button>
            </div>

            {teams.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No teams found"
                >
                    You are not currently leading any teams.
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 gap-5">

                    {teams.map((team) => {
                        const teamRequests = requests[team.teamId];
                        const pending = teamRequests?.data || [];

                        return (
                            <section
                                key={team.teamId}
                                className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
                            >

                                {/* Team details */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {team.teamName}
                                        </h3>

                                        <p className="mt-2 flex items-center gap-2 text-sm text-violet-deep">
                                            <Trophy size={16} />
                                            Hackathon: {team.hackathonName}
                                        </p>
                                    </div>

                                    <Crown className="text-violet-deep" size={24} />
                                </div>

                                <div className="border-t border-line pt-4">

                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="font-bold">
                                            Pending Requests
                                        </h4>

                                        <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold">
                                            {pending.length}
                                        </span>
                                    </div>

                                    {teamRequests?.error ? (
                                        <Alert type="error">
                                            {teamRequests.error}
                                        </Alert>
                                    ) : pending.length === 0 ? (
                                        <p className="text-sm text-muted">
                                            No pending requests.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">

                                            {pending.map((request) => (
                                                <div
                                                    key={request.requestId}
                                                    className="flex flex-col justify-between gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center"
                                                >

                                                    <div>
                                                        <p className="font-bold">
                                                            UserName: {request.userName}
                                                        </p>

                                                        <p className="text-xs text-muted">
                                                            Request ID: {request.requestId}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2">

                                                        <Button
                                                            color="success"
                                                            disabled={processing !== null}
                                                            loading={processing === request.requestId}
                                                            onClick={() =>
                                                                handleRequest(
                                                                    request.requestId,
                                                                    team.teamId,
                                                                    'accept'
                                                                )
                                                            }
                                                        >
                                                            <Check size={15} /> Accept
                                                        </Button>

                                                        <Button
                                                            color="danger"
                                                            disabled={processing !== null}
                                                            onClick={() =>
                                                                handleRequest(
                                                                    request.requestId,
                                                                    team.teamId,
                                                                    'reject'
                                                                )
                                                            }
                                                        >
                                                            <X size={15} /> Reject
                                                        </Button>

                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>
                            </section>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default LeaderDashboard;
