'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import type { Event, EventStatus } from '@/types';

const STATUS_LABELS: Record<EventStatus, string> = {
  active: '진행중',
  upcoming: '예정',
  ended: '종료',
};

const STATUS_COLORS: Record<EventStatus, string> = {
  active: 'bg-green-500',
  upcoming: 'bg-blue-500',
  ended: 'bg-gray-400',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EventStatus | 'all'>('all');
  const [counts, setCounts] = useState({ active: 0, upcoming: 0, ended: 0 });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.set('status', activeTab);
      }

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data.events);
        setCounts(data.data.counts);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  }

  function getDaysLeft(endDate: Date): number {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-14 gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold">이벤트</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {[
              { id: 'all', label: '전체' },
              { id: 'active', label: `진행중 (${counts.active})` },
              { id: 'upcoming', label: `예정 (${counts.upcoming})` },
              { id: 'ended', label: `종료 (${counts.ended})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EventStatus | 'all')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500 mx-auto" />
            <p className="mt-4 text-gray-500">이벤트를 불러오는 중...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-medium text-gray-800">이벤트가 없습니다</h2>
            <p className="text-gray-500 mt-2">새로운 이벤트를 기대해주세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                formatDate={formatDate}
                getDaysLeft={getDaysLeft}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({
  event,
  formatDate,
  getDaysLeft,
}: {
  event: Event;
  formatDate: (date: Date) => string;
  getDaysLeft: (date: Date) => number;
}) {
  const daysLeft = getDaysLeft(event.endDate);
  const isActive = event.status === 'active';
  const isUpcoming = event.status === 'upcoming';

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Banner */}
        <div className="relative h-40 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl">🎁</span>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 ${STATUS_COLORS[event.status]} text-white text-xs font-medium rounded-full`}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>

          {/* Days Left */}
          {isActive && daysLeft > 0 ? (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full">
                D-{daysLeft}
              </span>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-3 text-sm text-gray-400">
            {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
          </div>

          {/* Rewards Preview */}
          <div className="mt-3 flex flex-wrap gap-2">
            {event.rewards.slice(0, 3).map((reward) => (
              <span
                key={reward.id}
                className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded"
              >
                {reward.name}
              </span>
            ))}
            {event.rewards.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{event.rewards.length - 3}
              </span>
            )}
          </div>

          {/* Participants */}
          {event.participants !== undefined && event.participants > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {event.participants.toLocaleString()}명 참여중
              </span>
              {event.maxParticipants ? (
                <span className="text-sm text-orange-500">
                  {Math.round((event.participants / event.maxParticipants) * 100)}% 마감
                </span>
              ) : null}
            </div>
          )}

          {/* CTA */}
          <div className="mt-4">
            {isActive ? (
              <button className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                참여하기
              </button>
            ) : isUpcoming ? (
              <button className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed">
                곧 시작됩니다
              </button>
            ) : (
              <button className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                종료된 이벤트
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
