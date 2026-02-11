import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, logsAPI } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, logsRes, insightsRes] = await Promise.all([
        analyticsAPI.getSummary(),
        logsAPI.getHistory({ limit: 5 }),
        analyticsAPI.getInsights()
      ]);

      setSummary(summaryRes.data.summary);
      setRecentLogs(logsRes.data.logs);
      setInsights(insightsRes.data.insights);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'tip': return '💡';
      default: return 'ℹ️';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'border-red-500/50 bg-red-500/10';
      case 'success': return 'border-green-500/50 bg-green-500/10';
      case 'tip': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GigOne
            </h1>
            <p className="text-white/70 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-white/70 text-sm mb-1">7-Day Earnings</p>
              <p className="text-3xl font-bold text-green-400">
                ₹{summary.totalEarnings}
              </p>
              <p className="text-sm text-white/50 mt-1">
                Avg: ₹{summary.avgEarnings}/day
              </p>
            </div>

            <div className="card">
              <p className="text-white/70 text-sm mb-1">Total Logs</p>
              <p className="text-3xl font-bold">{summary.totalLogs}</p>
              <p className="text-sm text-white/50 mt-1">Last 7 days</p>
            </div>

            <div className="card">
              <p className="text-white/70 text-sm mb-1">Avg Sentiment</p>
              <p className="text-3xl font-bold">
                {(parseFloat(summary.avgSentimentScore) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-white/50 mt-1">
                {parseFloat(summary.avgSentimentScore) > 0 ? '😊 Positive' : '😐 Neutral'}
              </p>
            </div>

            <div className="card">
              <p className="text-white/70 text-sm mb-1">Mood Breakdown</p>
              <div className="flex gap-2 mt-2">
                <span className="text-green-400">{summary.sentimentCounts.positive} 😊</span>
                <span className="text-yellow-400">{summary.sentimentCounts.neutral} 😐</span>
                <span className="text-red-400">{summary.sentimentCounts.negative} 😔</span>
              </div>
            </div>
          </div>
        )}

        {/* Voice Recorder */}
        <div className="mb-8">
          <VoiceRecorder onLogSaved={loadDashboardData} />
        </div>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4">💡 Insights & Recommendations</h2>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                    <div>
                      <h3 className="font-semibold mb-1">{insight.title}</h3>
                      <p className="text-white/70 text-sm">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Logs */}
        {recentLogs && recentLogs.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">📜 Recent Logs</h2>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-white/70">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                    <span className="text-xl">
                      {log.sentiment.mood === 'positive' && '😊'}
                      {log.sentiment.mood === 'negative' && '😔'}
                      {log.sentiment.mood === 'neutral' && '😐'}
                    </span>
                  </div>
                  <p className="text-white/90 mb-2">{log.englishText.substring(0, 100)}...</p>
                  {log.earnings > 0 && (
                    <p className="text-green-400 font-semibold">₹{log.earnings}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
