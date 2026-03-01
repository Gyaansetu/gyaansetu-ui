import { useState } from 'react';
import BookingCard from '../cards/BookingCard';

const BookingsSection = ({ bookingsData }) => {
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending', 'accepted', 'rejected'

  const getBookings = () => {
    switch (activeFilter) {
      case 'pending':
        return bookingsData.pending;
      case 'accepted':
        return bookingsData.accepted;
      case 'rejected':
        return bookingsData.rejected;
      default:
        return [];
    }
  };

  const currentBookings = getBookings();

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({bookingsData.pending.length})
          </button>
          <button
            onClick={() => setActiveFilter('accepted')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              activeFilter === 'accepted'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Accepted ({bookingsData.accepted.length})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              activeFilter === 'rejected'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected ({bookingsData.rejected.length})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Pending</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{bookingsData.pending.length}</p>
          <p className="text-amber-100 text-sm mt-1">Awaiting your response</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Accepted</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{bookingsData.accepted.length}</p>
          <p className="text-emerald-100 text-sm mt-1">Confirmed sessions</p>
        </div>

        <div className="bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Rejected</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{bookingsData.rejected.length}</p>
          <p className="text-rose-100 text-sm mt-1">Declined requests</p>
        </div>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings
        </h2>

        {currentBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeFilter} bookings</h3>
            <p className="text-gray-500">You don't have any {activeFilter} bookings at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                formatTimestamp={formatTimestamp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
