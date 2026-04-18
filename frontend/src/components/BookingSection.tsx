'use client';

import { useState } from 'react';
import { Calendar, Users, ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDateForInput(date: Date) {
  return date.toISOString().split('T')[0];
}

export function BookingSection() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(formatDateForInput(today));
  const [checkOutDate, setCheckOutDate] = useState(formatDateForInput(tomorrow));
  const [guests, setGuests] = useState('2 Adults');
  const [room, setRoom] = useState('1 Room');
  const [specialCode, setSpecialCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [tempAdults, setTempAdults] = useState(2);
  const [tempChildren, setTempChildren] = useState(0);
  const [tempRooms, setTempRooms] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const guestsMatch = guests.match(/(\d+)/);
      const guestsCount = guestsMatch ? parseInt(guestsMatch[1]) : 2;
      
      const roomMatch = room.match(/(\d+)/);
      const roomCount = roomMatch ? parseInt(roomMatch[1]) : 1;

      const defaultRoomId = 'double';
      
      const reservationData = {
        roomId: defaultRoomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestsCount,
        adults: guestsCount,
        children: 0,
        specialRequests: specialCode || undefined
      };

      const response = await api.reservations.create(reservationData);
      
      if (response.reservation) {
        setSuccess('Reservation created successfully!');
        setTimeout(() => {
          router.push(`/rooms?booked=${response.reservation.id}`);
        }, 1500);
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setIsLoading(false);
    }
  };

  const applyGuests = () => {
    setGuests(`${tempAdults} Adult${tempAdults > 1 ? 's' : ''}`);
    setRoom(`${tempRooms} Room${tempRooms > 1 ? 's' : ''}`);
    setShowGuestsPicker(false);
  };

  return (
    <section className="relative -mt-24 z-10 mb-16 px-4">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-2xl overflow-visible">
          <div className="p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-end gap-6">
              {/* Check-in */}
              <div className="flex-1 w-full">
                <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-2">
                  Check-in
                </label>
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2 hover:border-[var(--primary)] transition-colors cursor-pointer">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <input 
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="text-lg bg-transparent border-none outline-none cursor-pointer w-full"
                    min={formatDateForInput(new Date())}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block text-[var(--secondary)]">-</div>

              {/* Check-out */}
              <div className="flex-1 w-full">
                <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-2">
                  Check-out
                </label>
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2 hover:border-[var(--primary)] transition-colors cursor-pointer">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <input 
                    type="date" 
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="text-lg bg-transparent border-none outline-none cursor-pointer w-full"
                    min={checkInDate}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block text-[var(--secondary)]">-</div>

              {/* Guests & Room */}
              <div className="flex-1 w-full relative">
                <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-2">
                  Guests
                </label>
                <div 
                  className="flex items-center gap-3 border-b border-[var(--border)] pb-2 hover:border-[var(--primary)] transition-colors cursor-pointer"
                  onClick={() => setShowGuestsPicker(!showGuestsPicker)}
                >
                  <Users className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-lg">{room} · {guests}</span>
                  <ChevronDown className="w-4 h-4 ml-auto text-[var(--secondary)]" />
                </div>
                {showGuestsPicker && (
                  <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-2xl p-4 z-[9999] min-w-[280px] border border-gray-200" style={{ width: '100%', maxWidth: '300px' }}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Adults</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setTempAdults(Math.max(1, tempAdults - 1))} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">-</button>
                          <span className="w-10 text-center font-semibold text-lg">{tempAdults}</span>
                          <button type="button" onClick={() => setTempAdults(tempAdults + 1)} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Children</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setTempChildren(Math.max(0, tempChildren - 1))} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">-</button>
                          <span className="w-10 text-center font-semibold text-lg">{tempChildren}</span>
                          <button type="button" onClick={() => setTempChildren(tempChildren + 1)} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Rooms</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setTempRooms(Math.max(1, tempRooms - 1))} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">-</button>
                          <span className="w-10 text-center font-semibold text-lg">{tempRooms}</span>
                          <button type="button" onClick={() => setTempRooms(tempRooms + 1)} className="w-10 h-10 rounded-full bg-[#867050]/10 text-[#867050] hover:bg-[#867050]/20 font-bold text-lg">+</button>
                        </div>
                      </div>
                      <button type="button" onClick={applyGuests} className="w-full btn-primary mt-4 py-3 text-base font-semibold">Confirm</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Codes Toggle */}
              <div className="w-full lg:w-auto">
                <button 
                  onClick={() => setShowCode(!showCode)}
                  className="text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-2"
                >
                  <span>Special Codes</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCode ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Reserve Button */}
              <button 
                onClick={handleSubmit}
                className="btn-primary min-w-[180px] flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Search className="w-5 h-5" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span className="ml-2">Reserve</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                {success}
              </div>
            )}

            {/* Special Code Input */}
            {showCode && (
              <div className="mt-6 pt-6 border-t border-[var(--border)] animate-slide-down">
                <div className="max-w-md">
                  <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] mb-2">
                    Add Special Codes
                  </label>
                  <input
                    type="text"
                    value={specialCode}
                    onChange={(e) => setSpecialCode(e.target.value)}
                    placeholder="Enter promotional code or corporate ID"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-md focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}