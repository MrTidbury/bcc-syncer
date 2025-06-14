import { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface Booking {
  id: string
  fullname: string
  email: string
  arrival_date: string
  party_adults: number
  party_teenagers: number
  party_children: number
  rally_name: string
  status: string
  vehicleReg?: string
  outfitType?: string
  outfitLength?: number
}

interface BookingListProps {
  status: string
}

// Realistic names for demo data
const firstNames = [
  'John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Laura', 'Chris', 'Olivia',
  'James', 'Sophia', 'Daniel', 'Emma', 'Matthew', 'Ava', 'Andrew', 'Mia', 'Ryan', 'Ella',
];
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez',
  'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
];

function getRandomName(idx: number) {
  // Use idx to get deterministic but varied names
  const first = firstNames[idx % firstNames.length];
  const last = lastNames[(idx * 7) % lastNames.length];
  return { first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com` };
}

// Helper arrays for demo data
const outfitTypes = ['Caravan', 'Motorhome', 'Campervan', 'Tent'];
function getRandomReg(idx: number) {
  // UK-style reg: 2 letters, 2 digits, 3 letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = letters[idx % 26];
  const l2 = letters[(idx * 3) % 26];
  const d1 = (idx * 7) % 10;
  const d2 = (idx * 13) % 10;
  const l3 = letters[(idx * 5) % 26];
  const l4 = letters[(idx * 11) % 26];
  const l5 = letters[(idx * 17) % 26];
  return `${l1}${l2}${d1}${d2} ${l3}${l4}${l5}`;
}
function getRandomOutfit(idx: number) {
  const type = outfitTypes[idx % outfitTypes.length];
  let length: number;
  if (type === 'Tent') length = parseFloat((Math.random() * 3 + 2).toFixed(1)); // 2.0–5.0
  else length = parseFloat((Math.random() * 3.5 + 5).toFixed(1)); // 5.0–8.5
  return { type, length };
}

// Dummy data for all statuses
export const allDummyBookings: Booking[] = [
  // Active bookings (15)
  ...Array.from({ length: 15 }, (_, i) => {
    const { first, last, email } = getRandomName(i);
    const { type, length } = getRandomOutfit(i);
    return {
      id: `a${i+1}`,
      fullname: `${first} ${last}`,
      email,
      arrival_date: '2024-04-01',
      party_adults: 2,
      party_teenagers: 1,
      party_children: 0,
      rally_name: 'Spring Rally 2024',
      status: 'active',
      vehicleReg: getRandomReg(i),
      outfitType: type,
      outfitLength: length,
    };
  }),
  // Pending bookings (3)
  ...Array.from({ length: 3 }, (_, i) => {
    const { first, last, email } = getRandomName(i + 20);
    const { type, length } = getRandomOutfit(i + 20);
    return {
      id: `p${i+1}`,
      fullname: `${first} ${last}`,
      email,
      arrival_date: '2024-04-02',
      party_adults: 2,
      party_teenagers: 0,
      party_children: 1,
      rally_name: 'Spring Rally 2024',
      status: 'pending',
      vehicleReg: getRandomReg(i + 20),
      outfitType: type,
      outfitLength: length,
    };
  }),
  // No demo data for rejected bookings
];

// Helper to get count by status
export function getBookingCountByStatus(status: string) {
  return allDummyBookings.filter(b => b.status === status).length;
}

export default function BookingList({ status }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState<Booking[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [dialogBooking, setDialogBooking] = useState<Booking | null>(null)

  useEffect(() => {
    setLoading(true);
    const fetchBookings = async () => {
      try {
        // Use the new dummy data for the current status
        const newBookings = allDummyBookings.filter(b => b.status === status);
        setBookings(newBookings);
        // Immediately update filtered to match new bookings and current search query
        const searchLower = searchQuery.toLowerCase();
        setFiltered(
          newBookings.filter(booking =>
            booking.fullname.toLowerCase().includes(searchLower) ||
            booking.email.toLowerCase().includes(searchLower)
          )
        );
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [status])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const searchLower = searchQuery.toLowerCase()
      const filtered = bookings.filter(booking =>
        booking.fullname.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower)
      )
      setFiltered(filtered)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, bookings])

  // When selectedBooking is set, open dialog and set dialogBooking
  useEffect(() => {
    if (selectedBooking) {
      setDialogBooking(selectedBooking);
      setIsDialogVisible(true);
    }
  }, [selectedBooking]);

  // When dialog closes, clear dialogBooking after animation
  const handleDialogClose = () => {
    setIsDialogVisible(false);
    setTimeout(() => {
      setDialogBooking(null);
      setSelectedBooking(null);
    }, 250); // match animation duration
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Bookings List */}
      <div className="relative">
        <div style={{ maxHeight: '40rem', overflowY: 'auto' }} className="pr-2 space-y-4 custom-scrollbar rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm select-none">
              <span className="text-3xl mb-2">😶</span>
              <span>No bookings to display for this status.</span>
            </div>
          ) : (
            filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white shadow rounded-xl px-4 py-3 mb-3 flex flex-row items-center gap-4 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex-1 flex flex-row justify-between items-center min-w-0 gap-4">
                  {/* Left: Name and Email */}
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{booking.fullname}</h3>
                    <p className="text-xs text-gray-500 truncate">{booking.email}</p>
                  </div>
                  {/* Right: Arriving and Party Size */}
                  <div className="flex flex-col items-end text-xs text-gray-500 whitespace-nowrap min-w-fit">
                    <span>Arriving: <span className="text-gray-700 font-medium">{new Date(booking.arrival_date).toLocaleDateString()}</span></span>
                    <span>Party Size: <span className="text-gray-700 font-medium">{booking.party_adults + booking.party_teenagers + booking.party_children}</span></span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog
        open={isDialogVisible}
        onClose={handleDialogClose}
        className="relative z-50"
      >
        {/* Backdrop with radial gradient vignette */}
        <div 
          className="fixed inset-0 transition-opacity pointer-events-auto"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)`,
            backdropFilter: 'blur(4px)',
          }}
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <Dialog.Panel className={`mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl drop-shadow-2xl p-0 relative transition-all duration-200 ${isDialogVisible ? (dialogBooking ? 'animate-fade-in-up' : 'animate-fade-out-down') : ''}`}>
            {/* Top Accent Bar */}
            <div className="w-full h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600" />
            {/* Close Button */}
            <button
              onClick={handleDialogClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition"
              aria-label="Close dialog"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            {dialogBooking && (
              <div className="p-8 pt-6">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">Booking Details</Dialog.Title>
                <div className="space-y-5 mt-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</h4>
                    <p className="mt-1 text-base text-gray-900 font-medium">{dialogBooking.fullname}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</h4>
                    <p className="mt-1 text-base text-gray-900">{dialogBooking.email}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rally</h4>
                    <p className="mt-1 text-base text-gray-900">{dialogBooking.rally_name}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Arrival Date</h4>
                      <p className="mt-1 text-base text-gray-900">{new Date(dialogBooking.arrival_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Party Size</h4>
                      <p className="mt-1 text-base text-gray-900">
                        Adults: <span className="font-semibold">{dialogBooking.party_adults}</span><br />
                        Teenagers: <span className="font-semibold">{dialogBooking.party_teenagers}</span><br />
                        Children: <span className="font-semibold">{dialogBooking.party_children}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Reg</h4>
                    <p className="mt-1 text-base text-gray-900">{dialogBooking.vehicleReg || '-'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outfit Type</h4>
                    <p className="mt-1 text-base text-gray-900">{dialogBooking.outfitType || '-'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outfit Length</h4>
                    <p className="mt-1 text-base text-gray-900">{dialogBooking.outfitLength ? `${dialogBooking.outfitLength} m` : '-'}</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-row-reverse gap-3">
                  <button
                    onClick={handleDialogClose}
                    className="px-5 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Close
                  </button>
                  {status === 'pending' && (
                    <>
                      <button
                        onClick={() => {/* TODO: Implement approve */}}
                        className="px-5 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {/* TODO: Implement reject */}}
                        className="px-5 py-2 text-base font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

/* Add this at the end of the file or in your global CSS */
// Custom scrollbar styles
// If not using Tailwind's plugin, add this to your CSS:
// .custom-scrollbar::-webkit-scrollbar { width: 8px; border-radius: 8px; background: #f1f5f9; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 8px; transition: background 0.2s; }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #60a5fa; }
// .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #c7d2fe #f1f5f9; }

// (ScrollShadows removed) 

// Add fade-in-up and fade-out-down animation for dialog panel
// In your global CSS (e.g., index.css or tailwind.css), add:
// @keyframes fade-in-up { from { opacity: 0; transform: translateY(32px) scale(0.98); } to { opacity: 1; transform: none; } }
// .animate-fade-in-up { animation: fade-in-up 0.25s cubic-bezier(0.4,0,0.2,1); }
// @keyframes fade-out-down { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(32px) scale(0.98); } }
// .animate-fade-out-down { animation: fade-out-down 0.25s cubic-bezier(0.4,0,0.2,1); } 