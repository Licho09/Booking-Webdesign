import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Lead } from '../lib/supabase';
import { sendCancellationNotification } from '../lib/sendCancellationNotification';

export function CancelBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  
  const [booking, setBooking] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      if (!supabase) {
        setError('Database connection not available');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (fetchError) {
          console.error('Error fetching booking:', fetchError);
          console.error('Error code:', fetchError.code);
          console.error('Error message:', fetchError.message);
          
          // Show more detailed error message
          if (fetchError.code === 'PGRST116') {
            setError('Booking not found. It may have already been cancelled.');
          } else if (fetchError.message?.includes('permission') || fetchError.message?.includes('policy')) {
            setError('Permission denied. Please check your database policies.');
          } else {
            setError(`Error: ${fetchError.message || 'Failed to load booking'}`);
          }
          setLoading(false);
          return;
        }

        if (!data || !data.booking_date || !data.booking_time) {
          setError('Invalid booking. This booking cannot be cancelled.');
          setLoading(false);
          return;
        }

        setBooking(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking || !bookingId || !supabase) return;

    setCancelling(true);
    setError('');

    try {
      // Delete the booking from database
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        console.error('Error cancelling booking:', deleteError);
        setError('Failed to cancel booking. Please try again.');
        setCancelling(false);
        return;
      }

      // Send cancellation notifications to both client and owner
      const bookingDate = booking.booking_date 
        ? new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : booking.booking_date || 'Unknown';

      console.log('📧 About to send cancellation notification...');
      console.log('📧 Booking data:', { 
        email: booking.email, 
        name: booking.name, 
        date: bookingDate, 
        time: booking.booking_time,
        business: booking.business 
      });

      try {
        const emailResult = await sendCancellationNotification(
          booking.email,
          booking.name,
          bookingDate,
          booking.booking_time || 'Unknown',
          booking.business || undefined
        );
        console.log('📧 Email result:', emailResult);
        if (emailResult.success) {
          console.log('✅ Cancellation notifications sent successfully');
        } else {
          console.warn('⚠️ Cancellation notifications failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Failed to send cancellation notifications:', emailError);
        // Don't fail cancellation if email fails
      }

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center px-8">
        <div className="text-center max-w-md w-full">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/90 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center px-8">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Booking Cancelled</h2>
          <p className="text-white/90 mb-8">
            Your booking has been successfully cancelled. The time slot is now available for others.
          </p>
          <p className="text-white/70 text-sm mb-8">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const bookingDate = booking.booking_date 
    ? new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center px-8 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white text-center mb-6">Cancel Booking</h2>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Booking Details</h3>
          <div className="space-y-2 text-white/90">
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Date:</strong> {bookingDate}</p>
            <p><strong>Time:</strong> {booking.booking_time}</p>
            {booking.business && <p><strong>Business:</strong> {booking.business}</p>}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cancelling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
          <button
            onClick={() => navigate('/')}
            disabled={cancelling}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

