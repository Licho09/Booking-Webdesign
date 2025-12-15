import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Lead } from '../lib/supabase';
import { sendRescheduleNotification } from '../lib/sendRescheduleNotification';

// Helper function to validate UUID format
function isValidUUID(uuid: string | null): boolean {
  if (!uuid) return false;
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function RescheduleBooking() {
  console.log('RescheduleBooking component rendering...');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawBookingId = searchParams.get('id');
  
  console.log('RescheduleBooking: bookingId from URL:', rawBookingId);
  
  // Validate booking ID format
  if (rawBookingId && !isValidUUID(rawBookingId)) {
    console.error('Invalid booking ID format:', rawBookingId);
  }
  
  const bookingId = rawBookingId && isValidUUID(rawBookingId) ? rawBookingId : null;
  
  const [booking, setBooking] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Date and time selection
  const getInitialDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Fetch booking details
  useEffect(() => {
    console.log('RescheduleBooking: Fetching booking with ID:', bookingId);
    
    if (!rawBookingId) {
      console.error('RescheduleBooking: No booking ID provided');
      setError('No booking ID provided');
      setLoading(false);
      return;
    }
    
    if (!bookingId) {
      // Invalid UUID format - likely a localStorage booking
      console.error('RescheduleBooking: Invalid booking ID format:', rawBookingId);
      setError('This booking was created when the database was unavailable. Unfortunately, rescheduling is not available for this booking. Please contact us directly to reschedule.');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      console.log('RescheduleBooking: Starting fetch...');
      
      if (!supabase) {
        console.error('RescheduleBooking: Supabase not available');
        setError('Database connection not available');
        setLoading(false);
        return;
      }

      try {
        console.log('RescheduleBooking: Querying database...');
        const { data, error: fetchError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', bookingId)
          .single();

        console.log('RescheduleBooking: Query result:', { data, error: fetchError });

        if (fetchError) {
          console.error('Error fetching booking:', fetchError);
          console.error('Error code:', fetchError.code);
          console.error('Error message:', fetchError.message);
          console.error('Error details:', fetchError.details);
          console.error('Error hint:', fetchError.hint);
          
          // Show more detailed error message
          if (fetchError.code === 'PGRST116') {
            setError('Booking not found. It may have already been cancelled.');
          } else if (fetchError.message?.includes('invalid input syntax for uuid')) {
            setError('Invalid booking ID. This booking was created when the database was unavailable. Please contact us directly to reschedule.');
          } else if (fetchError.message?.includes('permission') || fetchError.message?.includes('policy')) {
            setError('Permission denied. Please check your database policies.');
          } else {
            setError(`Error: ${fetchError.message || 'Failed to load booking'}`);
          }
          setLoading(false);
          return;
        }

        if (!data || !data.booking_date || !data.booking_time) {
          console.error('Invalid booking data:', data);
          setError('Invalid booking. This booking cannot be rescheduled.');
          setLoading(false);
          return;
        }

        console.log('RescheduleBooking: Booking loaded successfully:', data);
        setBooking(data);
        
        // Set initial selected date and time from booking
        if (data.booking_date) {
          const bookingDate = new Date(data.booking_date + 'T00:00:00');
          setSelectedDate(bookingDate);
        }
        if (data.booking_time) {
          setSelectedTime(data.booking_time);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, rawBookingId]);

  // Fetch booked time slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!supabase || !booking) return;

      setLoadingBookings(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('leads')
          .select('booking_time')
          .eq('booking_date', dateStr)
          .not('booking_time', 'is', null);

        if (error) {
          console.warn('Error fetching bookings:', error);
          setBookedSlots(new Set());
        } else {
          const booked = new Set<string>(
            (data || []).map((booking) => booking.booking_time).filter(Boolean)
          );
          // Remove current booking's time slot from booked list (user can select it again)
          if (booking.booking_time && booking.booking_date === dateStr) {
            booked.delete(booking.booking_time);
          }
          setBookedSlots(booked);
        }
      } catch (err) {
        console.warn('Error fetching bookings:', err);
        setBookedSlots(new Set());
      } finally {
        setLoadingBookings(false);
      }
    };

    if (booking) {
      fetchBookedSlots();
    }
  }, [selectedDate, booking]);

  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const lastAvailableDay = new Date(today);
    lastAvailableDay.setDate(lastAvailableDay.getDate() + 4);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate >= tomorrow && checkDate <= lastAvailableDay;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateClick = (day: number | null) => {
    if (day !== null) {
      const newDate = new Date(selectedDate);
      newDate.setDate(day);
      
      if (isDateAvailable(newDate)) {
        setSelectedDate(newDate);
        setSelectedTime(''); // Clear time when date changes
      }
    }
  };

  const handleTimeClick = (time: string) => {
    if (!bookedSlots.has(time)) {
      setSelectedTime(time);
    }
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastAvailableDay = new Date(today);
    lastAvailableDay.setDate(lastAvailableDay.getDate() + 4);
    
    const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const newMonthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    
    if (newMonthStart <= lastAvailableDay && newMonthEnd >= today) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (newDate < tomorrow) {
        setSelectedDate(new Date(tomorrow));
      } else if (newDate > lastAvailableDay) {
        setSelectedDate(new Date(lastAvailableDay));
      } else {
        setSelectedDate(newDate);
      }
    }
  };

  const handleReschedule = async () => {
    if (!booking || !bookingId || !selectedTime || !supabase) {
      setError('Please select a new date and time');
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // Check if new time slot is already booked
    if (bookedSlots.has(selectedTime)) {
      setError('This time slot is already booked. Please select another time.');
      return;
    }

    // Check if it's the same as current booking
    if (booking.booking_date === dateStr && booking.booking_time === selectedTime) {
      setError('This is already your current booking time.');
      return;
    }

    setRescheduling(true);
    setError('');

    try {
      // Update the booking
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          booking_date: dateStr,
          booking_time: selectedTime,
          notes: `Rescheduled from ${booking.booking_date} at ${booking.booking_time} to ${dateStr} at ${selectedTime}${booking.notes ? ` | ${booking.notes}` : ''}`,
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Error rescheduling booking:', updateError);
        setError('Failed to reschedule booking. Please try again.');
        setRescheduling(false);
        return;
      }

      // Format dates for emails
      const oldDateString = booking.booking_date
        ? new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : booking.booking_date || 'Unknown';

      const newDateString = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      // Send reschedule notification to both client and owner
      try {
        await sendRescheduleNotification(
          booking.email,
          booking.name,
          oldDateString,
          booking.booking_time || 'Unknown',
          newDateString,
          selectedTime,
          booking.business || undefined
        );
      } catch (emailError) {
        console.error('Failed to send reschedule notifications:', emailError);
        // Don't fail rescheduling if email fails
      }

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      setError('Failed to reschedule booking. Please try again.');
      setRescheduling(false);
    }
  };

  // Always render something - even if there's an error
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading booking details...</p>
          <p className="text-white/70 text-sm mt-2">Booking ID: {bookingId || 'None'}</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center px-8">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
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
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Booking Rescheduled!</h2>
          <p className="text-white/90 mb-8">
            Your booking has been successfully rescheduled. A confirmation email has been sent to {booking?.email}.
          </p>
          <p className="text-white/70 text-sm mb-8">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  // Safety check - if we somehow get here without booking, show error
  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center px-8">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/90 mb-8">Unable to load booking details.</p>
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

  const currentBookingDate = booking.booking_date
    ? new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const days = getDaysInMonth(selectedDate);
  const selectedDay = selectedDate.getDate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Reschedule Booking</h2>
        
        {/* Current Booking Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Current Booking</h3>
          <div className="space-y-2 text-white/90">
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Date:</strong> {currentBookingDate}</p>
            <p><strong>Time:</strong> {booking.booking_time}</p>
          </div>
        </div>

        {/* New Date/Time Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-semibold text-white mb-6">Select New Date & Time</h3>
          
          {/* Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="text-white hover:text-purple-300 font-bold text-xl"
              >
                &lt;
              </button>
              <h4 className="text-lg font-semibold text-white">
                {monthNames[currentMonth]} {currentYear}
              </h4>
              <button
                onClick={() => changeMonth(1)}
                className="text-white hover:text-purple-300 font-bold text-xl"
              >
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-white/70 py-2">
                  {day}
                </div>
              ))}
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="py-2" />;
                }
                
                const checkDate = new Date(currentYear, currentMonth, day);
                const available = isDateAvailable(checkDate);
                const isSelected = day === selectedDay && 
                  selectedDate.getMonth() === currentMonth && 
                  selectedDate.getFullYear() === currentYear;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={!available}
                    className={`
                      py-2 text-sm rounded-full transition-all
                      ${!available 
                        ? 'cursor-not-allowed opacity-30 text-gray-400' 
                        : 'hover:bg-purple-100 cursor-pointer'
                      }
                      ${isSelected ? 'text-white font-bold' : 'text-white/90'}
                    `}
                    style={isSelected ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    } : {}}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">Select Time</h4>
            {loadingBookings && (
              <p className="text-white/70 text-sm mb-4">Checking availability...</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                const isBooked = bookedSlots.has(time);
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeClick(time)}
                    disabled={isBooked}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isBooked
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-purple-600 text-white border border-purple-600'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                    title={isBooked ? 'This time slot is already booked' : ''}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleReschedule}
              disabled={rescheduling || !selectedTime}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {rescheduling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              disabled={rescheduling}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

