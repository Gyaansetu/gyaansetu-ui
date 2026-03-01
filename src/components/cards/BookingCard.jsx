import { useState } from 'react';

const BookingCard = ({ booking, formatTimestamp }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'border-amber-300 bg-amber-50';
      case 'ACCEPTED':
        return 'border-emerald-300 bg-emerald-50';
      case 'REJECTED':
        return 'border-rose-300 bg-rose-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAccept = () => {
    // TODO: Call API to accept booking
        alert(`Booking ${booking.id} accepted!`);
  };

  const handleReject = () => {
    // TODO: Call API to reject booking
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
            alert(`Booking ${booking.id} rejected!`);
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border-l-4 ${getStatusColor(booking.status)} transition-all duration-200`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{booking.studentName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Requested on {formatTimestamp(booking.requestedOn)}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Class</p>
            <p className="font-semibold text-gray-900">{booking.class}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Subject</p>
            <p className="font-semibold text-gray-900">{booking.subject}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Time</p>
            <p className="font-semibold text-gray-900">{booking.time}</p>
          </div>
        </div>

        {/* Detailed Information (Expandable) */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-semibold text-gray-900">{booking.duration}</p>
            </div>

            {booking.status === 'ACCEPTED' && booking.address && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Student Address</p>
                <p className="text-gray-900">{booking.address}</p>
              </div>
            )}

            {booking.status === 'ACCEPTED' && booking.acceptedOn && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Accepted On</p>
                <p className="text-gray-900">{formatTimestamp(booking.acceptedOn)}</p>
              </div>
            )}

            {booking.status === 'REJECTED' && booking.rejectionReason && (
              <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-lg">
                <p className="text-sm text-rose-700 mb-1 font-medium">Rejection Reason</p>
                <p className="text-rose-800">{booking.rejectionReason}</p>
              </div>
            )}

            {booking.status === 'REJECTED' && booking.rejectedOn && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Rejected On</p>
                <p className="text-gray-900">{formatTimestamp(booking.rejectedOn)}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons (Only for Pending) */}
        {booking.status === 'PENDING' && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAccept}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ✓ Accept
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
