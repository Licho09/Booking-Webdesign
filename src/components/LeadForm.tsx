import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendEmailConfirmation } from '../lib/sendEmail';
import { sendOwnerNotification } from '../lib/sendOwnerNotification';
import {
  trackFormView,
  trackFormStart,
  trackFormFieldInteraction,
  trackFormSubmitAttempt,
  trackFormSubmitSuccess,
  trackFormSubmitError,
  trackDateSelection,
  trackTimeSelection,
} from '../lib/analytics';

export interface Lead {
  id?: string;
  name: string;
  business: string;
  email: string;
  phone?: string;
  industry?: string;
  notes?: string;
  created_at?: string;
  status?: string;
  booking_date?: string;
  booking_time?: string;
}

export function LeadForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
  });
  // Set initial date to tomorrow
  const getInitialDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showFormOnMobile, setShowFormOnMobile] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Track form view when component mounts
  useEffect(() => {
    trackFormView();
  }, []);

  // Fetch booked time slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!supabase) {
        // Fallback: check localStorage for bookings
        const saved = JSON.parse(localStorage.getItem('leads') || '[]');
        const dateStr = selectedDate.toISOString().split('T')[0];
        const booked = new Set<string>();
        saved.forEach((lead: any) => {
          if (lead.booking_date === dateStr && lead.booking_time) {
            booked.add(lead.booking_time);
          }
        });
        setBookedSlots(booked);
        // Clear selected time if it's now booked
        if (selectedTime && booked.has(selectedTime)) {
          setSelectedTime('');
        }
        return;
      }

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
          setBookedSlots(booked);
          // Clear selected time if it's now booked
          if (selectedTime && booked.has(selectedTime)) {
            setSelectedTime('');
          }
        }
      } catch (err) {
        console.warn('Error fetching bookings:', err);
        setBookedSlots(new Set());
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookedSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Generate time slots (30 minutes apart)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    trackFormSubmitAttempt();

    if (!formData.name || !formData.email || !formData.phone || !formData.businessName || !selectedTime) {
      setError('Please fill in all fields and select a time.');
      trackFormSubmitError('missing_fields');
      return;
    }

    // Check if the selected time slot is already booked
    const dateStr = selectedDate.toISOString().split('T')[0];
    if (bookedSlots.has(selectedTime)) {
      setError('This time slot is already booked. Please select another time.');
      trackFormSubmitError('time_slot_taken');
      return;
    }

    // Double-check with database before submitting
    if (supabase) {
      try {
        const { data, error: checkError } = await supabase
          .from('leads')
          .select('id')
          .eq('booking_date', dateStr)
          .eq('booking_time', selectedTime)
          .limit(1);

        if (checkError) {
          console.warn('Error checking booking availability:', checkError);
        } else if (data && data.length > 0) {
          setError('This time slot was just booked by someone else. Please select another time.');
          trackFormSubmitError('time_slot_taken');
          // Refresh booked slots
          const booked = new Set(bookedSlots);
          booked.add(selectedTime);
          setBookedSlots(booked);
          return;
        }
      } catch (err) {
        console.warn('Error checking booking availability:', err);
      }
    }

    setIsSubmitting(true);

    const dateString = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    let bookingId: string | null = null;
    let bookingSaved = false;

    // Save to database first to get booking ID
    try {
      const lead: Lead = {
        name: formData.name.trim(),
        business: formData.businessName.trim() || 'Website Project',
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        notes: `Scheduled call: ${selectedDate.toLocaleDateString()} at ${selectedTime}${formData.businessName ? ` | Business: ${formData.businessName}` : ''}`,
        created_at: new Date().toISOString(),
        booking_date: dateStr,
        booking_time: selectedTime,
      };

      // Try Supabase if available, otherwise use localStorage
      if (supabase) {
        const { error: supabaseError } = await supabase.from('leads').insert([lead]);
        if (supabaseError) {
          // Check if it's a unique constraint violation (double booking)
          if (supabaseError.code === '23505' || supabaseError.message.includes('unique') || supabaseError.message.includes('duplicate')) {
            setError('This time slot was just booked by someone else. Please select another time.');
            trackFormSubmitError('time_slot_taken');
            setIsSubmitting(false);
            // Refresh booked slots
            const booked = new Set(bookedSlots);
            booked.add(selectedTime);
            setBookedSlots(booked);
            return;
          }
          console.warn('Database save failed, trying localStorage fallback:', supabaseError);
          // Fallback to localStorage if Supabase fails
          try {
            const saved = JSON.parse(localStorage.getItem('leads') || '[]');
            const tempId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            lead.id = tempId;
            saved.push(lead);
            localStorage.setItem('leads', JSON.stringify(saved));
            bookingId = tempId;
            bookingSaved = true;
            console.log('Lead saved to localStorage as fallback:', lead);
            console.log('📋 Booking ID (localStorage):', bookingId);
          } catch (localStorageError) {
            console.error('Failed to save to localStorage:', localStorageError);
            setError('Failed to save your booking. Please try again.');
            trackFormSubmitError('database_error');
            setIsSubmitting(false);
            return;
          }
        } else {
          // Successfully saved to Supabase
          bookingSaved = true;
          
          // Query for the booking ID using email + date + time
          console.log('📋 Querying for booking ID with:', { email: lead.email, date: dateStr, time: selectedTime });
          const { data: bookingData, error: queryError } = await supabase
            .from('leads')
            .select('id')
            .eq('email', lead.email)
            .eq('booking_date', dateStr)
            .eq('booking_time', selectedTime)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (queryError) {
            console.warn('⚠️ Error querying for booking ID:', queryError);
          } else if (bookingData && bookingData.length > 0 && bookingData[0].id) {
            bookingId = bookingData[0].id;
            console.log('📋 Booking ID captured:', bookingId);
          } else {
            console.warn('⚠️ No booking ID found after insert');
          }
          
          // Add to booked slots
          const booked = new Set(bookedSlots);
          booked.add(selectedTime);
          setBookedSlots(booked);
        }
      } else {
        // Fallback to localStorage for frontend-only mode
        try {
          const saved = JSON.parse(localStorage.getItem('leads') || '[]');
          const tempId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          lead.id = tempId;
          saved.push(lead);
          localStorage.setItem('leads', JSON.stringify(saved));
          bookingId = tempId;
          bookingSaved = true;
          console.log('Lead saved to localStorage:', lead);
          // Add to booked slots
          const booked = new Set(bookedSlots);
          booked.add(selectedTime);
          setBookedSlots(booked);
        } catch (localStorageError) {
          console.error('Failed to save to localStorage:', localStorageError);
          setError('Failed to save your booking. Please try again.');
          trackFormSubmitError('database_error');
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error saving to database:', err);
      setError('Failed to save your booking. Please try again.');
      trackFormSubmitError('database_error');
      setIsSubmitting(false);
      return;
    }

    // Only proceed if booking was successfully saved
    if (!bookingSaved) {
      setError('Failed to save your booking. Please try again.');
      trackFormSubmitError('database_error');
      setIsSubmitting(false);
      return;
    }

    // Send email confirmation with booking ID (if available)
    console.log('📧 Sending email with booking ID:', bookingId);
    let emailSent = false;
    if (formData.email.trim()) {
      try {
        const emailResult = await sendEmailConfirmation(
          formData.email.trim(),
          formData.name.trim(),
          dateString,
          selectedTime,
          formData.businessName.trim() || undefined,
          bookingId || undefined
        );
        emailSent = emailResult.success;
        if (!emailResult.success) {
          console.error('Failed to send email confirmation:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Failed to send email confirmation:', emailError);
      }
    }

    // Send SMS notification to owner
    try {
      await sendOwnerNotification(
        formData.name.trim(),
        formData.email.trim(),
        formData.phone.trim() || undefined,
        formData.businessName.trim(),
        dateString,
        selectedTime
      );
    } catch (notificationError) {
      console.error('Failed to send owner notification:', notificationError);
    }

    // Track successful submission
    trackFormSubmitSuccess({
      hasDate: !!selectedDate,
      hasTime: !!selectedTime,
      hasBusinessName: !!formData.businessName,
    });

    // Track Lead event for Meta Pixel - ONLY after successful booking save
    // This ensures we only track real, successful conversions
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    // Navigate to thank you page - ONLY after successful booking save
    setIsSubmitting(false);
    navigate('/thank-you');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    // Track form start on first field interaction
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart();
    }
    
    // Track field interaction
    trackFormFieldInteraction(e.target.name);
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateClick = (day: number | null) => {
    if (day !== null) {
      const newDate = new Date(selectedDate);
      newDate.setDate(day);
      
      // Check if the date is within the allowed range (tomorrow + 3 more days)
      if (isDateAvailable(newDate)) {
        setSelectedDate(newDate);
        trackDateSelection(newDate.toLocaleDateString());
      }
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    trackTimeSelection(time);
  };

  // Check if a date is available (tomorrow + next 3 days)
  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const lastAvailableDay = new Date(today);
    lastAvailableDay.setDate(lastAvailableDay.getDate() + 4); // Tomorrow + 3 more days
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate >= tomorrow && checkDate <= lastAvailableDay;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const days = getDaysInMonth(selectedDate);
  const selectedDay = selectedDate.getDate();

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + direction);
    
    // Only allow navigation if the new month contains available dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastAvailableDay = new Date(today);
    lastAvailableDay.setDate(lastAvailableDay.getDate() + 4);
    
    // Check if the new month is within the available range
    const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const newMonthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    
    // Only allow if the month overlaps with available dates
    if (newMonthStart <= lastAvailableDay && newMonthEnd >= today) {
      // Set to first available date in that month if current date is not available
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

  return (
    <section id="offer" className="max-w-5xl mx-auto px-8 py-8">
      <p className="text-2xl lg:text-3xl text-white font-semibold mb-6 text-center fade-in-slide-up-delay-3 whitespace-nowrap">
        👇 Schedule A Call With Us To Learn How We Do it 👇
      </p>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden slide-up">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Panel - Event Details (Form) - Hidden on mobile until Continue is clicked */}
          <div className={`bg-white p-8 border-r border-gray-200 ${showFormOnMobile ? 'block' : 'hidden lg:block'}`}>
            {/* Back button for mobile */}
            {showFormOnMobile && (
              <button
                onClick={() => setShowFormOnMobile(false)}
                className="lg:hidden mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Calendar</span>
              </button>
            )}
            <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-2">Get Started!</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Free Website Consultation</h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800 font-medium">
                I only take a few new clients each month — get your spot now.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="font-medium">30 Mins</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <input
                type="text"
                name="businessName"
                placeholder="Website idea / business name"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || !selectedTime || !formData.name || !formData.email || !formData.phone || !formData.businessName}
                className="submit-button relative overflow-hidden h-12 px-8 rounded-3xl bg-[#3d3a4e] text-white border-none cursor-pointer text-xl font-bold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundSize: '400%'
                }}
              >
                <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </form>
          </div>

          {/* Right Panel - Calendar & Time Selection - Show first on mobile */}
          <div className={`bg-gray-50 p-8 ${showFormOnMobile ? 'hidden lg:block' : 'block'}`}>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h4>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-gray-600 hover:text-gray-900 font-bold text-xl"
                >
                  &lt;
                </button>
                <h5 className="text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth]} {currentYear}
                </h5>
                <button
                  onClick={() => changeMonth(1)}
                  className="text-gray-600 hover:text-gray-900 font-bold text-xl"
                >
                  &gt;
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  if (day === null) {
                    return (
                      <button
                        key={index}
                        disabled
                        className="py-2 text-sm rounded-lg cursor-default"
                      >
                        {''}
                      </button>
                    );
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
                        ${isSelected ? 'text-white font-bold' : 'text-gray-700'}
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
            <div className="max-h-64 overflow-y-auto">
              {loadingBookings && (
                <div className="text-sm text-gray-500 text-center py-2">Checking availability...</div>
              )}
              <div className="space-y-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  const isBooked = bookedSlots.has(time);
                  return (
                    <div key={time} className="relative">
                      {/* Mobile: Split animation when selected */}
                      {isSelected ? (
                        <>
                          <div className="lg:hidden time-split-container flex h-10 rounded-lg overflow-visible relative gap-1">
                            {/* Left half - Selected time (shrinks from right) */}
                            <div 
                              className="time-split-left bg-blue-600 text-white flex items-center justify-center font-medium text-sm rounded-l-lg"
                            >
                              {time}
                            </div>
                            {/* Right half - Next button (grows from right) */}
                            <button
                              onClick={() => setShowFormOnMobile(true)}
                              className="time-split-right bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold text-sm hover:from-purple-700 hover:to-purple-900 rounded-r-lg"
                            >
                              Next
                            </button>
                          </div>
                          {/* Desktop: Show selected state normally */}
                          <button
                            onClick={() => !isBooked && handleTimeClick(time)}
                            disabled={isBooked}
                            className="hidden lg:block w-full px-4 py-2.5 rounded-lg font-medium text-sm bg-blue-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {time}
                          </button>
                        </>
                      ) : (
                        // Regular time button (when not selected - both mobile and desktop)
                        <button
                          onClick={() => !isBooked && handleTimeClick(time)}
                          disabled={isBooked}
                          className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                            isBooked
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through'
                              : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                          }`}
                          title={isBooked ? 'This time slot is already booked' : ''}
                        >
                          {time} {isBooked && '(Booked)'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
