'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Calendar, 
  CreditCard, 
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  DollarSign,
  Building,
  Plus,
  Trash2,
  Edit,
  Globe,
  ClipboardList,
  Truck,
  BarChart3,
  Link2,
  UserCheck,
  Sparkles,
  Utensils,
  Wrench,
  Shirt,
  Package,
  RefreshCw,
  Banknote,
  ImageIcon,
  Upload,
  X
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
}

interface Task {
  id: string;
  type: string;
  status: string;
  roomNumber: string;
  reservation: {
    user: { firstName: string; lastName: string };
  };
  createdAt: string;
}

interface Stats {
  totalRooms: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalReservations: number;
  pendingPayments: number;
}

const fakeReservations: Reservation[] = [
  { id: 'RES-001', guestName: 'Marie Dubois', guestEmail: 'marie.dubois@email.com', roomNumber: '101', checkIn: '2026-04-18', checkOut: '2026-04-20', status: 'CONFIRMED', totalPrice: 158 },
  { id: 'RES-002', guestName: 'James Mitchell', guestEmail: 'james.m@email.com', roomNumber: '102', checkIn: '2026-04-19', checkOut: '2026-04-22', status: 'ACTIVE', totalPrice: 267 },
  { id: 'RES-003', guestName: 'Hans Mueller', guestEmail: 'hans.m@email.com', roomNumber: '103', checkIn: '2026-04-17', checkOut: '2026-04-19', status: 'COMPLETED', totalPrice: 178 },
  { id: 'RES-004', guestName: 'Sophie Laurent', guestEmail: 'sophie.l@email.com', roomNumber: '104', checkIn: '2026-04-20', checkOut: '2026-04-23', status: 'CONFIRMED', totalPrice: 285 },
  { id: 'RES-005', guestName: 'Marco Rossi', guestEmail: 'marco.r@email.com', roomNumber: '105', checkIn: '2026-04-21', checkOut: '2026-04-24', status: 'PENDING', totalPrice: 237 },
  { id: 'RES-006', guestName: 'Emma Wilson', guestEmail: 'emma.w@email.com', roomNumber: '201', checkIn: '2026-04-18', checkOut: '2026-04-19', status: 'COMPLETED', totalPrice: 79 },
  { id: 'RES-007', guestName: 'John Smith', guestEmail: 'john.s@email.com', roomNumber: '202', checkIn: '2026-04-19', checkOut: '2026-04-21', status: 'ACTIVE', totalPrice: 158 },
  { id: 'RES-008', guestName: 'Lisa Chen', guestEmail: 'lisa.c@email.com', roomNumber: '203', checkIn: '2026-04-20', checkOut: '2026-04-22', status: 'CONFIRMED', totalPrice: 178 },
];

const fakeTasks: Task[] = [
  { id: 'TASK-001', type: 'CREATE_CARD', status: 'COMPLETED', roomNumber: '101', reservation: { user: { firstName: 'Marie', lastName: 'Dubois' } }, createdAt: '2026-04-17T10:30:00Z' },
  { id: 'TASK-002', type: 'CREATE_CARD', status: 'PROCESSING', roomNumber: '102', reservation: { user: { firstName: 'James', lastName: 'Mitchell' } }, createdAt: '2026-04-18T14:20:00Z' },
  { id: 'TASK-003', type: 'DELETE_CARD', status: 'PENDING', roomNumber: '103', reservation: { user: { firstName: 'Hans', lastName: 'Mueller' } }, createdAt: '2026-04-18T16:45:00Z' },
  { id: 'TASK-004', type: 'CREATE_CARD', status: 'COMPLETED', roomNumber: '104', reservation: { user: { firstName: 'Sophie', lastName: 'Laurent' } }, createdAt: '2026-04-19T09:15:00Z' },
  { id: 'TASK-005', type: 'RENEW_CARD', status: 'PENDING', roomNumber: '105', reservation: { user: { firstName: 'Marco', lastName: 'Rossi' } }, createdAt: '2026-04-19T11:30:00Z' },
  { id: 'TASK-006', type: 'CREATE_CARD', status: 'FAILED', roomNumber: '106', reservation: { user: { firstName: 'Emma', lastName: 'Wilson' } }, createdAt: '2026-04-17T08:00:00Z' },
  { id: 'TASK-007', type: 'DELETE_CARD', status: 'COMPLETED', roomNumber: '107', reservation: { user: { firstName: 'John', lastName: 'Smith' } }, createdAt: '2026-04-18T12:00:00Z' },
  { id: 'TASK-008', type: 'CREATE_CARD', status: 'PROCESSING', roomNumber: '201', reservation: { user: { firstName: 'Lisa', lastName: 'Chen' } }, createdAt: '2026-04-19T15:45:00Z' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>(fakeReservations);
  const [tasks, setTasks] = useState<Task[]>(fakeTasks);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [adminLang, setAdminLang] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRooms: 15,
    availableRooms: 8,
    todayCheckIns: 3,
    todayCheckOuts: 2,
    totalReservations: 45,
    pendingPayments: 5
  });
  const [loading, setLoading] = useState(false);

  const [adminRooms, setAdminRooms] = useState([
    { id: '101', name: 'Single Room', type: 'SINGLE', price: 59, status: 'Available', imageUrl: '/uploads/media/hotel/image_001.jpg' },
    { id: '102', name: 'Double Room', type: 'DOUBLE', price: 79, status: 'Occupied', imageUrl: '/uploads/media/hotel/image_005.jpg' },
    { id: '103', name: 'Twin Room', type: 'TWIN', price: 89, status: 'Available', imageUrl: '/uploads/media/hotel/image_006.jpg' },
    { id: '104', name: 'Family Room', type: 'FAMILY', price: 150, status: 'Available', imageUrl: '/uploads/media/hotel/image_007.jpg' },
    { id: '105', name: 'Deluxe Suite', type: 'SUITE', price: 200, status: 'Available', imageUrl: '/uploads/media/hotel/image_008.jpg' },
    { id: '106', name: 'Double Room', type: 'DOUBLE', price: 89, status: 'Available', imageUrl: '/uploads/media/hotel/image_011.jpg' },
    { id: '107', name: 'Twin Room', type: 'TWIN', price: 79, status: 'Available', imageUrl: '/uploads/media/hotel/image_012.jpg' },
  ]);

  const [staffList, setStaffList] = useState([
    { id: '1', firstName: 'Marie', lastName: 'Laurent', email: 'marie@hotel.com', phone: '+33 6 12 34 56 78', role: 'HOUSEKEEPER', department: 'Housekeeping', status: 'ACTIVE', shiftStart: '08:00', shiftEnd: '16:00' },
    { id: '2', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie@hotel.com', phone: '+33 6 23 45 67 89', role: 'HOUSEKEEPER', department: 'Housekeeping', status: 'ACTIVE', shiftStart: '08:00', shiftEnd: '16:00' },
    { id: '3', firstName: 'Pierre', lastName: 'Dupont', email: 'pierre@hotel.com', phone: '+33 6 34 56 78 90', role: 'RECEPTIONIST', department: 'Front Desk', status: 'ACTIVE', shiftStart: '07:00', shiftEnd: '15:00' },
    { id: '4', firstName: 'Jean', lastName: 'Martin', email: 'jean@hotel.com', phone: '+33 6 45 67 89 01', role: 'RECEPTIONIST', department: 'Front Desk', status: 'INACTIVE', shiftStart: '14:00', shiftEnd: '22:00' },
    { id: '5', firstName: 'Anna', lastName: 'Smith', email: 'anna@hotel.com', phone: '+33 6 56 78 90 12', role: 'CHEF', department: 'Kitchen', status: 'ACTIVE', shiftStart: '06:00', shiftEnd: '14:00' },
    { id: '6', firstName: 'Carlos', lastName: 'Garcia', email: 'carlos@hotel.com', phone: '+33 6 67 89 01 23', role: 'MAINTENANCE', department: 'Engineering', status: 'ACTIVE', shiftStart: '', shiftEnd: '' },
  ]);

  const [housekeepingTasks, setHousekeepingTasks] = useState([
    { id: '1', roomId: '101', status: 'IN_PROGRESS', priority: 'NORMAL', assignedToId: '1', notes: 'Standard clean' },
    { id: '2', roomId: '102', status: 'MAINTENANCE_NEEDED', priority: 'HIGH', assignedToId: null, notes: 'AC repair needed' },
    { id: '3', roomId: '103', status: 'COMPLETED', priority: 'NORMAL', assignedToId: '2', notes: '' },
    { id: '4', roomId: '104', status: 'PENDING', priority: 'NORMAL', assignedToId: null, notes: 'Guest checkout' },
    { id: '5', roomId: '105', status: 'IN_PROGRESS', priority: 'NORMAL', assignedToId: '1', notes: 'Standard clean' },
    { id: '6', roomId: '106', status: 'COMPLETED', priority: 'NORMAL', assignedToId: '2', notes: '' },
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    { id: '1', name: 'Bottled Water', category: 'MINIBAR', quantity: 50, minStock: 20, unitPrice: 4 },
    { id: '2', name: 'Soft Drinks', category: 'MINIBAR', quantity: 30, minStock: 15, unitPrice: 5 },
    { id: '3', name: 'Beer', category: 'MINIBAR', quantity: 18, minStock: 10, unitPrice: 6 },
    { id: '4', name: 'Wine (Red)', category: 'MINIBAR', quantity: 12, minStock: 8, unitPrice: 12 },
    { id: '5', name: 'Shampoo', category: 'AMENITIES', quantity: 80, minStock: 30, unitPrice: 0 },
    { id: '6', name: 'Soap', category: 'AMENITIES', quantity: 100, minStock: 40, unitPrice: 0 },
    { id: '7', name: 'Towels', category: 'LINENS', quantity: 45, minStock: 20, unitPrice: 0 },
    { id: '8', name: 'Coffee Pods', category: 'IN_ROOM_COFFEE', quantity: 8, minStock: 15, unitPrice: 0 },
  ]);

  const [seasonalRates, setSeasonalRates] = useState([
    { id: '1', name: 'Low Season', seasonType: 'LOW_SEASON', startDate: '2026-01-01', endDate: '2026-03-31', multiplier: 0.8, isActive: true },
    { id: '2', name: 'Regular', seasonType: 'REGULAR', startDate: '2026-04-01', endDate: '2026-06-30', multiplier: 1.0, isActive: true },
    { id: '3', name: 'High Season', seasonType: 'HIGH_SEASON', startDate: '2026-07-01', endDate: '2026-08-31', multiplier: 1.5, isActive: true },
    { id: '4', name: 'Regular', seasonType: 'REGULAR', startDate: '2026-09-01', endDate: '2026-10-31', multiplier: 1.0, isActive: true },
    { id: '5', name: 'Peak Season', seasonType: 'PEAK_SEASON', startDate: '2026-11-01', endDate: '2026-12-31', multiplier: 1.3, isActive: true },
  ]);

  const existingImages = [
    'image_001.jpg', 'image_005.jpg', 'image_006.jpg', 'image_007.jpg', 'image_008.jpg',
    'image_011.jpg', 'image_012.jpg', 'image_013.jpg', 'image_014.jpg', 'image_017.jpg',
    'image_018.jpg', 'image_019.jpg', 'image_020.jpg', 'image_021.jpg', 'image_022.jpg',
    'image_023.jpg', 'image_024.jpg', 'image_025.jpg', 'image_026.jpg', 'image_027.jpg',
    'image_028.jpg', 'image_029.jpg', 'image_030.jpg', 'image_031.jpg', 'image_032.jpg',
    'image_033.jpg', 'image_034.jpg', 'image_035.jpg', 'image_036.jpg', 'image_037.jpg',
    'image_038.jpg', 'image_039.jpg', 'image_040.jpg', 'image_041.jpg', 'image_042.jpg',
    'image_043.jpg', 'image_044.jpg', 'image_045.jpg', 'image_046.jpg', 'image_047.jpg',
    'image_048.jpg', 'image_049.jpg', 'image_050.jpg', 'image_051.jpg', 'image_052.jpg',
    'image_053.jpg', 'image_054.jpg', 'image_055.jpg', 'image_056.jpg', 'image_057.jpg',
    'image_058.jpg', 'image_059.jpg', 'image_060.jpg', 'image_061.jpg', 'image_062.jpg',
    'image_063.jpg', 'image_064.jpg', 'image_065.jpg', 'image_066.jpg', 'image_067.jpg',
    'image_068.jpg', 'image_069.jpg', 'image_070.jpg', 'image_071.jpg', 'image_072.jpg',
    'image_073.jpg', 'image_074.jpg', 'image_075.jpg', 'image_076.jpg', 'image_077.jpg',
    'image_078.jpg', 'image_079.jpg', 'image_080.jpg', 'image_081.jpg', 'image_082.jpg',
    'image_083.jpg', 'image_084.jpg', 'image_085.jpg', 'image_086.jpg', 'image_087.jpg', 'image_088.jpg'
  ];

  const [mediaItems, setMediaItems] = useState(
    existingImages.map((filename, index) => ({
      id: String(index + 1),
      url: `/uploads/media/hotel/${filename}`,
      filename,
      type: index < 2 ? 'ROOM' : index < 10 ? 'HOTEL' : index < 14 ? 'RESTAURANT' : index < 17 ? 'FACILITY' : 'GALLERY',
      isActive: true
    }))
  );

  useEffect(() => {
    const syncMediaToDatabase = async () => {
      try {
        const res = await fetch(`${API_URL}/api/media`);
        const data = await res.json();
        
        if (data.media && data.media.length > 0) {
          const dbMedia = data.media;
          const mergedMedia = existingImages.map((filename) => {
            const existing = dbMedia.find((m: any) => m.filename === filename);
            return {
              id: existing?.id || '',
              url: `/uploads/media/hotel/${filename}`,
              filename,
              type: existing?.type || (existingImages.indexOf(filename) < 2 ? 'ROOM' : existingImages.indexOf(filename) < 10 ? 'HOTEL' : existingImages.indexOf(filename) < 14 ? 'RESTAURANT' : existingImages.indexOf(filename) < 17 ? 'FACILITY' : 'GALLERY'),
              isActive: existing?.isActive ?? true
            };
          });
          setMediaItems(mergedMedia);
        }
      } catch (err) {
        console.log('Using local media (DB not connected)');
      }
    };
    syncMediaToDatabase();
  }, []);

  const updateMediaInDb = async (id: string, updates: any) => {
    try {
      await fetch(`${API_URL}/api/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.log('DB not connected - changes only in memory');
    }
  };

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [previewMedia, setPreviewMedia] = useState<any>(null);

  const [showAddMedia, setShowAddMedia] = useState(false);

  const [addMediaItems, setAddMediaItems] = useState<any[]>([]);

  const addMediaItem = (item: any) => {
    setAddMediaItems([...addMediaItems, { ...item, id: `new-${Date.now()}-${Math.random()}` }]);
  };

  const removeMediaToAdd = (id: string) => {
    setAddMediaItems(addMediaItems.filter(i => i.id !== id));
  };

  const submitMediaItems = async () => {
    const newItems = addMediaItems.map((item, index) => ({
      ...item,
      id: String(mediaItems.length + index + 1),
    }));
    
    for (const item of newItems) {
      try {
        await fetch(`${API_URL}/api/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: item.url, filename: item.filename, type: item.type })
        });
      } catch (err) {}
    }
    
    setMediaItems([...mediaItems, ...newItems]);
    setAddMediaItems([]);
    setShowAddMedia(false);
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems(mediaItems.filter(i => i.id !== id));
    try {
      await fetch(`${API_URL}/api/media/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const deleteSelectedMedia = async () => {
    const toDelete = mediaItems.filter(i => selectedMedia.includes(i.id));
    for (const item of toDelete) {
      if (item.id) {
        try {
          await fetch(`${API_URL}/api/media/${item.id}`, { method: 'DELETE' });
        } catch (err) {}
      }
    }
    setMediaItems(mediaItems.filter(i => !selectedMedia.includes(i.id)));
    setSelectedMedia([]);
    setShowDeleteConfirm(false);
  };

  const toggleMediaSelect = (id: string) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter(i => i !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const selectAllMedia = () => {
    if (selectedMedia.length === mediaItems.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(mediaItems.map(m => m.id));
    }
  };

  const [editItem, setEditItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemType, setItemType] = useState('');

  const addRoom = (room: { id: string; name: string; type: string; price: number; status: string }) => {
    setAdminRooms([...adminRooms, room]);
    setShowAddRoom(false);
  };

  const addTask = (task: { id: string; type: string; status: string; roomNumber: string; reservation: { user: { firstName: string; lastName: string } }; createdAt: string }) => {
    setTasks([...tasks, task]);
    setShowAddTask(false);
  };

  const addStaff = (staff: any) => {
    setStaffList([...staffList, { ...staff, id: String(staffList.length + 1) }]);
    setShowAddStaff(false);
  };

  const updateStaff = (staff: any) => {
    setStaffList(staffList.map(s => s.id === staff.id ? staff : s));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const addHousekeepingTask = (task: any) => {
    setHousekeepingTasks([...housekeepingTasks, { ...task, id: String(housekeepingTasks.length + 1) }]);
    setShowAddHousekeeping(false);
  };

  const updateHousekeepingTask = (task: any) => {
    setHousekeepingTasks(housekeepingTasks.map(t => t.id === task.id ? task : t));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteHousekeepingTask = (id: string) => {
    setHousekeepingTasks(housekeepingTasks.filter(t => t.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const addInventoryItem = (item: any) => {
    setInventoryItems([...inventoryItems, { ...item, id: String(inventoryItems.length + 1) }]);
    setShowAddInventory(false);
  };

  const updateInventoryItem = (item: any) => {
    setInventoryItems(inventoryItems.map(i => i.id === item.id ? item : i));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(inventoryItems.filter(i => i.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const addSeasonalRate = (rate: any) => {
    setSeasonalRates([...seasonalRates, { ...rate, id: String(seasonalRates.length + 1) }]);
    setShowAddSeason(false);
  };

  const updateSeasonalRate = (rate: any) => {
    setSeasonalRates(seasonalRates.map(r => r.id === rate.id ? rate : r));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteSeasonalRate = (id: string) => {
    setSeasonalRates(seasonalRates.filter(r => r.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const deleteRoom = (id: string) => {
    setAdminRooms(adminRooms.filter(r => r.id !== id));
  };

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddHousekeeping, setShowAddHousekeeping] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [showAddReservation, setShowAddReservation] = useState(false);

  const addReservation = (res: any) => {
    const newId = 'RES-' + String(reservations.length + 1).padStart(3, '0');
    setReservations([...reservations, { ...res, id: newId }]);
    setShowAddReservation(false);
  };

  const updateReservation = (res: any) => {
    setReservations(reservations.map(r => r.id === res.id ? res : r));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFileSelection = (files: FileList) => {
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (e) => {
        setAddMediaItems(prev => [...prev, { 
          id: `new-${Date.now()}-${Math.random()}`, 
          url: e.target?.result as string, 
          filename: file.name, 
          mediaType: isVideo ? 'VIDEO' : 'IMAGE',
          type: isVideo ? 'GALLERY' : 'HOTEL', 
          isActive: true 
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const handleFileAdded = (e: CustomEvent) => {
      const { url, filename } = e.detail;
      setAddMediaItems(prev => [...prev, { 
        id: `new-${Date.now()}-${Math.random()}`, 
        url, 
        filename, 
        type: 'HOTEL', 
        isActive: true 
      }]);
    };
    window.addEventListener('fileAdded', handleFileAdded as EventListener);
    return () => window.removeEventListener('fileAdded', handleFileAdded as EventListener);
  }, []);

  const handleCheckIn = (reservationId: string) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: 'ACTIVE' } : r
    ));
  };

  const handleCheckOut = (reservationId: string) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: 'COMPLETED' } : r
    ));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'tasks', label: 'Card Tasks', icon: Key },
    { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
    { id: 'staff', label: 'Staff Management', icon: Shirt },
    { id: 'inventory', label: 'Room Service', icon: Package },
    { id: 'houseguests', label: 'In-House Guests', icon: UserCheck },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: Banknote },
    { id: 'channel', label: 'Channel Manager', icon: Link2 },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeMenuItem = menuItems.find(item => item.id === activeTab);
  const ActiveIcon = activeMenuItem?.icon || LayoutDashboard;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-gray-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PROCESSING': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <aside className="w-64 bg-[#0d0d0d] border-r border-white/10 fixed h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-2 bg-white rounded-full p-2">
            <Image
              src="/logo/gold_logo.png"
              alt="Citadel Hôtel"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display text-base font-semibold text-white">Citadel Hôtel</span>
          <p className="text-xs text-white/50">Admin Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-[var(--radius-md)] text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 bg-white min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <ActiveIcon className="w-5 h-5 text-[#867050]" />
              <span className="font-medium text-gray-700">{activeMenuItem?.label}</span>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
              />
            </div>
          </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{languages.find(l => l.code === adminLang)?.flag}</span>
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setAdminLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        adminLang === lang.code ? 'bg-gray-50 text-[#867050]' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#867050] rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">admin@citadelhotel.fr</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-[var(--secondary)]">Welcome back! Here&apos;s your hotel overview.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Total Rooms</span>
                    <Bed className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalRooms}</p>
                  <p className="text-sm text-[var(--success)] mt-1">{stats.availableRooms} available</p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Today&apos;s Activity</span>
                    <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.todayCheckIns + stats.todayCheckOuts}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">
                    {stats.todayCheckIns} check-ins, {stats.todayCheckOuts} check-outs
                  </p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Reservations</span>
                    <Users className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalReservations}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">This month</p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Pending Payments</span>
                    <CreditCard className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                  <p className="text-sm text-[var(--warning)] mt-1">Requires attention</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)]">
                  <div className="p-6 border-b border-[var(--border-light)]">
                    <h2 className="font-semibold text-lg">Recent Reservations</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {reservations.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{res.guestName}</p>
                          <p className="text-sm text-[var(--secondary)]">Room {res.roomNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                          <p className="text-sm text-[var(--secondary)] mt-1">
                            €{res.totalPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                    {reservations.length === 0 && (
                      <p className="text-center text-[var(--secondary)] py-4">No reservations yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)]">
                  <div className="p-6 border-b border-[var(--border-light)]">
                    <h2 className="font-semibold text-lg">Pending Card Tasks</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {tasks.filter(t => t.status === 'PENDING' || t.status === 'PROCESSING').slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-[var(--primary)]" />
                          <div>
                            <p className="font-medium">Room {task.roomNumber}</p>
                            <p className="text-sm text-[var(--secondary)]">
                              {task.reservation?.user?.firstName} {task.reservation?.user?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTaskStatusIcon(task.status)}
                          <span className="text-sm">{task.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status === 'PENDING').length === 0 && (
                      <p className="text-center text-[var(--secondary)] py-4">No pending tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Reservations</h1>
                  <p className="text-[var(--secondary)]">Manage all hotel reservations</p>
                </div>
                <button onClick={() => { setItemType('reservation'); setShowAddReservation(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Reservation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'CONFIRMED').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Confirmed</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'ACTIVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checked In</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'PENDING').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Pending</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Check-in</th>
                      <th className="text-left p-4 font-medium text-sm">Check-out</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Amount</th>
                      <th className="text-left p-4 font-medium text-sm">Check In/Out</th>
                      <th className="text-left p-4 font-medium text-sm"></th>
                      <th className="text-left p-4 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{res.id}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{res.guestName}</p>
                          <p className="text-sm text-[var(--secondary)]">{res.guestEmail}</p>
                        </td>
                        <td className="p-4">{res.roomNumber}</td>
                        <td className="p-4">{new Date(res.checkIn).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(res.checkOut).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4">€{res.totalPrice}</td>
                        <td className="p-4">
                          {res.status === 'CONFIRMED' && (
                            <button onClick={() => handleCheckIn(res.id)} className="text-xs bg-green-500 text-white px-2.5 py-1.5 rounded-md hover:bg-green-600 font-medium">Check In</button>
                          )}
                          {res.status === 'ACTIVE' && (
                            <button onClick={() => handleCheckOut(res.id)} className="text-xs bg-amber-500 text-white px-2.5 py-1.5 rounded-md hover:bg-amber-600 font-medium">Check Out</button>
                          )}
                          {res.status === 'COMPLETED' && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md font-medium">Done</span>}
                          {res.status === 'CANCELLED' && <span className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-medium">X</span>}
                          {res.status === 'PENDING' && <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md font-medium">Wait</span>}
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('reservation'); setEditItem(res); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('reservation'); setDeleteId(res.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Card Tasks</h1>
                  <p className="text-[var(--secondary)]">Manage access card operations</p>
                </div>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Card Task
                </button>
              </div>

              {showAddTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="font-display text-xl mb-4">Add New Card Task</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const firstName = (form.elements.namedItem('guestFirstName') as HTMLInputElement).value;
                      const lastName = (form.elements.namedItem('guestLastName') as HTMLInputElement).value;
                      addTask({
                        id: 'TASK-' + String(tasks.length + 1).padStart(3, '0'),
                        type: (form.elements.namedItem('taskType') as HTMLSelectElement).value,
                        status: 'PENDING',
                        roomNumber: (form.elements.namedItem('taskRoom') as HTMLInputElement).value,
                        reservation: { user: { firstName, lastName } },
                        createdAt: new Date().toISOString()
                      });
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Task Type</label>
                          <select name="taskType" required className="w-full px-3 py-2 border rounded">
                            <option value="CREATE_CARD">Create Card</option>
                            <option value="DELETE_CARD">Delete Card</option>
                            <option value="RENEW_CARD">Renew Card</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Room Number</label>
                          <input name="taskRoom" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 101" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Guest First Name</label>
                          <input name="guestFirstName" required className="w-full px-3 py-2 border rounded" placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Guest Last Name</label>
                          <input name="guestLastName" required className="w-full px-3 py-2 border rounded" placeholder="Doe" />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowAddTask(false)} className="px-4 py-2 border rounded">Cancel</button>
                          <button type="submit" className="btn-primary">Add Task</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'PENDING').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Failed</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'FAILED').length}</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Task</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Created</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{task.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-2">
                            <Key className="w-4 h-4 text-[var(--primary)]" />
                            {task.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          {task.reservation?.user?.firstName} {task.reservation?.user?.lastName}
                        </td>
                        <td className="p-4">{task.roomNumber}</td>
                        <td className="p-4">{new Date(task.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 ${
                            task.status === 'COMPLETED' ? 'text-green-500' :
                            task.status === 'FAILED' ? 'text-red-500' :
                            task.status === 'PROCESSING' ? 'text-yellow-500' :
                            'text-gray-500'
                          }`}>
                            {getTaskStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Rooms</h1>
                  <p className="text-[var(--secondary)]">Manage hotel rooms</p>
                </div>
                <button 
                  onClick={() => setShowAddRoom(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              {showAddRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <h3 className="font-display text-xl mb-4">Add New Room</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const selectedImage = (form.elements.namedItem('roomImage') as HTMLSelectElement).value;
                      addRoom({
                        id: (form.elements.namedItem('roomId') as HTMLInputElement).value,
                        name: (form.elements.namedItem('roomType') as HTMLSelectElement).value + ' Room',
                        type: (form.elements.namedItem('roomType') as HTMLSelectElement).value,
                        price: parseInt((form.elements.namedItem('roomPrice') as HTMLInputElement).value),
                        status: 'Available',
                        imageUrl: selectedImage || '/uploads/media/hotel/image_001.jpg'
                      });
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Room Number</label>
                          <input name="roomId" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 201" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Type</label>
                          <select name="roomType" required className="w-full px-3 py-2 border rounded">
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Twin">Twin</option>
                            <option value="Family">Family</option>
                            <option value="Suite">Suite</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Price per night (€)</label>
                          <input name="roomPrice" type="number" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 150" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Select Image</label>
                          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                            {mediaItems.filter(m => m.type === 'ROOM' || m.type === 'HOTEL').map((media) => (
                              <label key={media.id} className="cursor-pointer relative group">
                                <input 
                                  type="radio" 
                                  name="roomImage" 
                                  value={media.url}
                                  className="sr-only"
                                />
                                <img 
                                  src={media.url} 
                                  alt={media.filename}
                                  className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-[#867050] peer-checked:border-[#867050]" 
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowAddRoom(false)} className="px-4 py-2 border rounded">Cancel</button>
                          <button type="submit" className="btn-primary">Add Room</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminRooms.map((room) => (
                  <div key={room.id} className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden group">
                    <div className="relative h-40">
                      <Image
                        src={room.imageUrl || '/uploads/media/hotel/image_001.jpg'}
                        alt={`Room ${room.id}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => { setItemType('room'); setEditItem(room); setShowEditModal(true); }} className="p-2 bg-white/90 rounded-full hover:bg-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setItemType('room'); setDeleteId(room.id); setShowDeleteConfirm(true); }}
                          className="p-2 bg-white/90 rounded-full hover:bg-white text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Room {room.id}</h3>
                        <span className={`text-sm ${
                          room.status === 'Available' ? 'text-green-500' :
                          room.status === 'Occupied' ? 'text-blue-500' :
                          'text-red-500'
                        }`}>{room.status}</span>
                      </div>
                      <p className="text-sm text-[var(--secondary)] mb-3">{room.name} • €{room.price}/night</p>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded-full">WiFi</span>
                        <span className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded-full">TV</span>
                        <span className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded-full">Bath</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Payments</h1>
                <p className="text-[var(--secondary)]">Manage all payments and transactions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Total Revenue</span>
                  </div>
                  <p className="text-3xl font-bold">€12,450</p>
                  <p className="text-sm text-green-500 mt-1">+15% this month</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">€2,340</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">5 transactions</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <p className="text-3xl font-bold">€45</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">This week</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Reservation</th>
                      <th className="text-left p-4 font-medium text-sm">Method</th>
                      <th className="text-left p-4 font-medium text-sm">Date</th>
                      <th className="text-left p-4 font-medium text-sm">Amount</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'PAY-001', guest: 'John Smith', resId: 'RES-001', method: 'Credit Card', date: '2026-04-18', amount: 158, status: 'Completed' },
                      { id: 'PAY-002', guest: 'Marie Dubois', resId: 'RES-002', method: 'Credit Card', date: '2026-04-17', amount: 89, status: 'Completed' },
                      { id: 'PAY-003', guest: 'Pierre Martin', resId: 'RES-003', method: 'Bank Transfer', date: '2026-04-17', amount: 360, status: 'Pending' },
                      { id: 'PAY-004', guest: 'Sophie Blanc', resId: 'RES-004', method: 'Credit Card', date: '2026-04-16', amount: 180, status: 'Completed' },
                    ].map((payment) => (
                      <tr key={payment.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{payment.id}</span>
                        </td>
                        <td className="p-4 font-medium">{payment.guest}</td>
                        <td className="p-4">{payment.resId}</td>
                        <td className="p-4">{payment.method}</td>
                        <td className="p-4">{payment.date}</td>
                        <td className="p-4">€{payment.amount}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            payment.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
                <p className="text-[var(--secondary)]">Manage hotel settings and preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Hotel Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Hotel Name</label>
                      <input type="text" defaultValue="Citadel Hôtel" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Address</label>
                      <input type="text" defaultValue="28 rue Royale, 62100 Calais, France" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Phone</label>
                      <input type="text" defaultValue="+33 3 21 97 00 00" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Email</label>
                      <input type="email" defaultValue="contact@citadelhotel.fr" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Booking Settings</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Check-in Time</label>
                      <input type="time" defaultValue="16:00" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Check-out Time</label>
                      <input type="time" defaultValue="11:30" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Cancellation Policy</label>
                      <select className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]">
                        <option>Free cancellation (24h before)</option>
                        <option>Free cancellation (48h before)</option>
                        <option>Non-refundable</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Notifications</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Email notifications for new reservations</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Email notifications for payments</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Guests</h1>
                <p className="text-[var(--secondary)]">Manage guest information and history</p>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-sm">Email</th>
                      <th className="text-left p-4 font-medium text-sm">Phone</th>
                      <th className="text-left p-4 font-medium text-sm">Stays</th>
                      <th className="text-left p-4 font-medium text-sm">Total Spent</th>
                      <th className="text-left p-4 font-medium text-sm">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'GUEST-001', name: 'John Smith', email: 'john.smith@email.com', phone: '+33 6 12 34 56 78', stays: 5, spent: 890, lastVisit: '2026-04-15' },
                      { id: 'GUEST-002', name: 'Marie Dubois', email: 'marie.dubois@email.com', phone: '+33 6 23 45 67 89', stays: 3, spent: 445, lastVisit: '2026-04-10' },
                      { id: 'GUEST-003', name: 'Pierre Martin', email: 'pierre.martin@email.com', phone: '+33 6 34 56 78 90', stays: 8, spent: 1560, lastVisit: '2026-04-17' },
                      { id: 'GUEST-004', name: 'Sophie Blanc', email: 'sophie.blanc@email.com', phone: '+33 6 45 67 89 01', stays: 2, spent: 320, lastVisit: '2026-04-05' },
                    ].map((guest) => (
                      <tr key={guest.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{guest.id}</span>
                        </td>
                        <td className="p-4 font-medium">{guest.name}</td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{guest.email}</td>
                        <td className="p-4 text-sm">{guest.phone}</td>
                        <td className="p-4">{guest.stays}</td>
                        <td className="p-4">€{guest.spent}</td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{guest.lastVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'housekeeping' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Housekeeping</h1>
                  <p className="text-[var(--secondary)]">Manage room cleaning and maintenance</p>
                </div>
                <button onClick={() => { setItemType('housekeeping'); setShowAddHousekeeping(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Ready</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">In Progress</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Maintenance</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'MAINTENANCE_NEEDED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'PENDING').length}</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Assigned To</th>
                      <th className="text-left p-4 font-medium text-sm">Priority</th>
                      <th className="text-left p-4 font-medium text-sm">Notes</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {housekeepingTasks.map((task) => (
                      <tr key={task.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">Room {task.roomId}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                            task.status === 'COMPLETED' ? 'bg-green-500' :
                            task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                            task.status === 'MAINTENANCE_NEEDED' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">{staffList.find(s => s.id === task.assignedToId)?.firstName || '-'}</td>
                        <td className="p-4">
                          <span className={`text-xs ${task.priority === 'HIGH' ? 'text-red-500 font-medium' : ''}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{task.notes || '-'}</td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('housekeeping'); setEditItem(task); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('housekeeping'); setDeleteId(task.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Staff Management</h1>
                  <p className="text-[var(--secondary)]">Manage hotel staff and schedules</p>
                </div>
                <button onClick={() => { setItemType('staff'); setShowAddStaff(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Staff</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.filter(s => s.status === 'ACTIVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">On Duty Today</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.filter(s => s.status === 'ON_LEAVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">On Leave</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-sm">Role</th>
                      <th className="text-left p-4 font-medium text-sm">Department</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Shift</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff) => (
                      <tr key={staff.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{staff.firstName} {staff.lastName}</td>
                        <td className="p-4">{staff.role}</td>
                        <td className="p-4">{staff.department}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            staff.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                            staff.status === 'INACTIVE' ? 'bg-gray-500/10 text-gray-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {staff.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{staff.shiftStart && staff.shiftEnd ? `${staff.shiftStart} - ${staff.shiftEnd}` : '-'}</td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('staff'); setEditItem(staff); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('staff'); setDeleteId(staff.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Room Service / Inventory</h1>
                  <p className="text-[var(--secondary)]">Manage minibar, amenities, and room supplies</p>
                </div>
                <button onClick={() => { setItemType('inventory'); setShowAddInventory(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.reduce((sum, i) => sum + i.quantity, 0)}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Items in Stock</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.filter(i => i.quantity < i.minStock).length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Low Stock</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.filter(i => i.category === 'MINIBAR').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Minibar Items</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Item</th>
                      <th className="text-left p-4 font-medium text-sm">Category</th>
                      <th className="text-left p-4 font-medium text-sm">Stock</th>
                      <th className="text-left p-4 font-medium text-sm">Min Stock</th>
                      <th className="text-left p-4 font-medium text-sm">Price</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">{item.minStock}</td>
                        <td className="p-4">€{item.unitPrice}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            item.quantity >= item.minStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.quantity >= item.minStock ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('inventory'); setEditItem(item); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('inventory'); setDeleteId(item.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'houseguests' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">In-House Guests</h1>
                <p className="text-[var(--secondary)]">Manage currently checked-in guests</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">6</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checked In</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checkouts Today</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">9</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Guests</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Check-in</th>
                      <th className="text-left p-4 font-medium text-sm">Check-out</th>
                      <th className="text-left p-4 font-medium text-sm">Guests</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'James Mitchell', room: '102', checkIn: '2026-04-19', checkOut: '2026-04-22', guests: 2, status: 'In House' },
                      { name: 'John Smith', room: '202', checkIn: '2026-04-19', checkOut: '2026-04-21', guests: 1, status: 'In House' },
                      { name: 'Marie Dubois', room: '101', checkIn: '2026-04-18', checkOut: '2026-04-20', guests: 2, status: 'In House' },
                      { name: 'Lisa Chen', room: '203', checkIn: '2026-04-20', checkOut: '2026-04-22', guests: 1, status: 'In House' },
                    ].map((guest) => (
                      <tr key={guest.room} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{guest.name}</td>
                        <td className="p-4">Room {guest.room}</td>
                        <td className="p-4">{guest.checkIn}</td>
                        <td className="p-4">{guest.checkOut}</td>
                        <td className="p-4">{guest.guests}</td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                            {guest.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-sm text-[var(--primary)] hover:underline mr-3">View</button>
                          <button className="text-sm text-[var(--warning)] hover:underline">Checkout</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Reports</h1>
                <p className="text-[var(--secondary)]">View hotel performance analytics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">€12,450</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Revenue</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">67%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Occupancy Rate</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">€89</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Avg. Daily Rate</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">45</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Reservations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold mb-4">Revenue by Month</h3>
                  <div className="space-y-3">
                    {[
                      { month: 'April 2026', amount: 12450 },
                      { month: 'March 2026', amount: 10200 },
                      { month: 'February 2026', amount: 8900 },
                      { month: 'January 2026', amount: 11500 },
                    ].map((item) => (
                      <div key={item.month} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <span className="font-medium">€{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold mb-4">Room Type Performance</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Double Room', revenue: 4200, occupancy: 75 },
                      { type: 'Twin Room', revenue: 3100, occupancy: 65 },
                      { type: 'Family Room', revenue: 2800, occupancy: 60 },
                      { type: 'Suite', revenue: 2350, occupancy: 70 },
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <span className="text-sm">{item.type}</span>
                        <div className="text-right">
                          <span className="font-medium">€{item.revenue}</span>
                          <span className="text-xs text-gray-500 ml-2">({item.occupancy}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

{activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Pricing & Seasonal Rates</h1>
                  <p className="text-[var(--secondary)]">Manage room rates and seasonal pricing</p>
                </div>
                <button onClick={() => { setItemType('pricing'); setShowAddSeason(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Season
                </button>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                <h3 className="font-semibold mb-4">Base Room Rates</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Room Type</th>
                      <th className="text-left p-3 font-medium text-sm">Base Price</th>
                      <th className="text-left p-3 font-medium text-sm">Weekend Premium</th>
                      <th className="text-left p-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Single Room', base: 59, weekend: 69 },
                      { type: 'Double Room', base: 79, weekend: 89 },
                      { type: 'Twin Room', base: 89, weekend: 99 },
                      { type: 'Family Room', base: 150, weekend: 180 },
                      { type: 'Suite', base: 200, weekend: 250 },
                    ].map((room) => (
                      <tr key={room.type} className="border-t border-[var(--border-light)]">
                        <td className="p-3">{room.type}</td>
                        <td className="p-3">€{room.base}</td>
                        <td className="p-3">€{room.weekend}</td>
                        <td className="p-3">
                          <button className="text-sm text-[var(--primary)] hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                <h3 className="font-semibold mb-4">Seasonal Pricing</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Season</th>
                      <th className="text-left p-3 font-medium text-sm">Start Date</th>
                      <th className="text-left p-3 font-medium text-sm">End Date</th>
                      <th className="text-left p-3 font-medium text-sm">Multiplier</th>
                      <th className="text-left p-3 font-medium text-sm">Edit</th>
                      <th className="text-left p-3 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonalRates.map((season) => (
                      <tr key={season.id} className="border-t border-[var(--border-light)]">
                        <td className="p-3 font-medium">{season.name}</td>
                        <td className="p-3">{season.startDate}</td>
                        <td className="p-3">{season.endDate}</td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-1 bg-[var(--primary)]/10 rounded text-sm">
                            {season.multiplier}x
                          </span>
                        </td>
                        <td className="p-3">
                          <button onClick={() => { setItemType('pricing'); setEditItem(season); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-3">
                          <button onClick={() => { setItemType('pricing'); setDeleteId(season.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Media Library</h1>
                  <p className="text-[var(--secondary)]">Manage hotel images and media files</p>
                </div>
                <div className="flex gap-2">
                  {selectedMedia.length > 0 && (
                    <button onClick={() => { setItemType('media'); setShowDeleteConfirm(true); }} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedMedia.length})
                    </button>
                  )}
                  <button onClick={() => setShowAddMedia(true)} className="btn-primary flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add Media
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={selectedMedia.length === mediaItems.length && mediaItems.length > 0}
                      onChange={selectAllMedia}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${selectedMedia.length === mediaItems.length && mediaItems.length > 0 ? 'bg-[#867050] border-[#867050]' : 'border-gray-300'}`}>
                      {selectedMedia.length === mediaItems.length && mediaItems.length > 0 && (
                        <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">Select All</span>
                </label>
                {selectedMedia.length > 0 && (
                  <span className="text-sm text-[var(--secondary)] bg-gray-100 px-2 py-1 rounded">{selectedMedia.length} selected</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Images</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.filter(m => m.type === 'ROOM').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Room Images</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.filter(m => m.type === 'HOTEL').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Hotel Images</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaItems.map((media) => (
                  <div key={media.id} className={`relative group rounded-lg overflow-hidden border-2 ${selectedMedia.includes(media.id) ? 'border-[#867050] ring-2 ring-[#867050]/30' : 'border-[var(--border-light)]'}`}>
                    <div className="absolute top-2 left-2 z-10">
                      <div 
                        onClick={() => toggleMediaSelect(media.id)}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${selectedMedia.includes(media.id) ? 'bg-[#867050] border-[#867050]' : 'border-white/70 bg-white/30'}`}
                      >
                        {selectedMedia.includes(media.id) && (
                          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div onClick={() => setPreviewMedia(media)} className="cursor-pointer">
                      {(media as any).mediaType === 'VIDEO' ? (
                        <video src={media.url} className="w-full h-32 object-cover" />
                      ) : (
                        <img src={media.url} alt={media.filename || 'Media'} className="w-full h-32 object-cover" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setItemType('media'); setEditItem(media); setShowEditModal(true); }} className="bg-amber-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-amber-600">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); setItemType('media'); setDeleteId(media.id); setShowDeleteConfirm(true); }} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-600">Delete</button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pointer-events-none">
                      <p className="text-white text-xs truncate">{(media as any).mediaType === 'VIDEO' ? 'VIDEO' : media.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              {mediaItems.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-[var(--secondary)]">No images yet. Click "Add Media" to upload.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'channel' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Channel Manager</h1>
                <p className="text-[var(--secondary)]">Manage distribution channels and bookings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Link2 className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Booking.com</span>
                  </div>
                  <p className="text-3xl font-bold">45%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Link2 className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Expedia</span>
                  </div>
                  <p className="text-3xl font-bold">30%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Direct Website</span>
                  </div>
                  <p className="text-3xl font-bold">25%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Channel</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Rooms Synced</th>
                      <th className="text-left p-4 font-medium text-sm">Last Sync</th>
                      <th className="text-left p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { channel: 'Booking.com', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:30' },
                      { channel: 'Expedia', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:28' },
                      { channel: 'Hotels.com', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:25' },
                      { channel: 'Direct Website', status: 'Active', rooms: 15, lastSync: '-' },
                    ].map((ch) => (
                      <tr key={ch.channel} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{ch.channel}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            ch.status === 'Connected' || ch.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            <CheckCircle className="w-3 h-3" />
                            {ch.status}
                          </span>
                        </td>
                        <td className="p-4">{ch.rooms}</td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{ch.lastSync}</td>
                        <td className="p-4">
                          <button className="text-sm text-[var(--primary)] hover:underline mr-3">Sync Now</button>
                          <button className="text-sm text-gray-500 hover:underline">Settings</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddStaff && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add New Staff</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addStaff({
                    firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
                    lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
                    email: (form.elements.namedItem('email') as HTMLInputElement).value,
                    phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                    role: (form.elements.namedItem('role') as HTMLSelectElement).value,
                    department: (form.elements.namedItem('department') as HTMLInputElement).value,
                    status: 'ACTIVE',
                    shiftStart: (form.elements.namedItem('shiftStart') as HTMLInputElement).value,
                    shiftEnd: (form.elements.namedItem('shiftEnd') as HTMLInputElement).value,
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">First Name</label><input name="firstName" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Last Name</label><input name="lastName" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Email</label><input name="email" type="email" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Phone</label><input name="phone" className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Role</label>
                      <select name="role" required className="w-full px-3 py-2 border rounded">
                        <option value="HOUSEKEEPER">Housekeeper</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="CHEF">Chef</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="MANAGER">Manager</option>
                        <option value="BELLBOY">Bellboy</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Department</label><input name="department" required className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2">
                      <div className="flex-1"><label className="block text-sm mb-1">Shift Start</label><input name="shiftStart" type="time" className="w-full px-3 py-2 border rounded" /></div>
                      <div className="flex-1"><label className="block text-sm mb-1">Shift End</label><input name="shiftEnd" type="time" className="w-full px-3 py-2 border rounded" /></div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddStaff(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Staff</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Edit {itemType === 'staff' ? 'Staff' : itemType === 'housekeeping' ? 'Housekeeping' : itemType === 'media' ? 'Image' : itemType === 'room' ? 'Room' : 'Item'}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  if (itemType === 'staff') {
                    updateStaff({
                      ...editItem,
                      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
                      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
                      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                      role: (form.elements.namedItem('role') as HTMLSelectElement).value,
                      department: (form.elements.namedItem('department') as HTMLInputElement).value,
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    });
                  } else if (itemType === 'housekeeping') {
                    updateHousekeepingTask({
                      ...editItem,
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
                      assignedToId: (form.elements.namedItem('assignedToId') as HTMLSelectElement).value,
                      notes: (form.elements.namedItem('notes') as HTMLInputElement).value,
                    });
                  } else if (itemType === 'inventory') {
                    updateInventoryItem({
                      ...editItem,
                      name: (form.elements.namedItem('name') as HTMLInputElement).value,
                      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
                      quantity: parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value),
                      minStock: parseInt((form.elements.namedItem('minStock') as HTMLInputElement).value),
                      unitPrice: parseFloat((form.elements.namedItem('unitPrice') as HTMLInputElement).value),
                    });
                  } else if (itemType === 'pricing') {
                    updateSeasonalRate({
                      ...editItem,
                      name: (form.elements.namedItem('name') as HTMLInputElement).value,
                      seasonType: (form.elements.namedItem('seasonType') as HTMLSelectElement).value,
                      startDate: (form.elements.namedItem('startDate') as HTMLInputElement).value,
                      endDate: (form.elements.namedItem('endDate') as HTMLInputElement).value,
                      multiplier: parseFloat((form.elements.namedItem('multiplier') as HTMLInputElement).value),
                    });
                  } else if (itemType === 'reservation') {
                    updateReservation({
                      ...editItem,
                      guestName: (form.elements.namedItem('guestName') as HTMLInputElement).value,
                      guestEmail: (form.elements.namedItem('guestEmail') as HTMLInputElement).value,
                      guestPhone: (form.elements.namedItem('guestPhone') as HTMLInputElement).value,
                      roomNumber: (form.elements.namedItem('roomNumber') as HTMLInputElement).value,
                      checkIn: (form.elements.namedItem('checkIn') as HTMLInputElement).value,
                      checkOut: (form.elements.namedItem('checkOut') as HTMLInputElement).value,
                      totalPrice: parseInt((form.elements.namedItem('totalPrice') as HTMLInputElement).value),
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    });
                  } else if (itemType === 'room') {
                    const updatedRooms = adminRooms.map(r => 
                      r.id === editItem.id 
                        ? { 
                            ...r, 
                            name: (form.elements.namedItem('roomName') as HTMLInputElement).value,
                            type: (form.elements.namedItem('roomType') as HTMLSelectElement).value,
                            price: parseInt((form.elements.namedItem('roomPrice') as HTMLInputElement).value),
                            status: (form.elements.namedItem('roomStatus') as HTMLSelectElement).value,
                            imageUrl: (form.elements.namedItem('roomImage') as HTMLSelectElement).value || r.imageUrl
                          }
                        : r
                    );
                    setAdminRooms(updatedRooms);
                  } else if (itemType === 'media') {
                    const newFilename = (form.elements.namedItem('filename') as HTMLInputElement).value;
                    const newType = (form.elements.namedItem('type') as HTMLSelectElement).value;
                    const updatedMedia = mediaItems.map(item => 
                      item.id === editItem.id 
                        ? { 
                            ...item, 
                            filename: newFilename,
                            type: newType,
                            url: item.url.replace(item.filename, newFilename)
                          }
                        : item
                    );
                    setMediaItems(updatedMedia);
                    if (editItem.id) {
                      updateMediaInDb(editItem.id, { filename: newFilename, type: newType });
                    }
                  }
                  setShowEditModal(false);
                  setEditItem(null);
                }}>
                  <div className="space-y-4">
                    {itemType === 'staff' && (
                      <>
                        <div><label className="block text-sm mb-1">First Name</label><input name="firstName" defaultValue={editItem?.firstName} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Last Name</label><input name="lastName" defaultValue={editItem?.lastName} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Phone</label><input name="phone" defaultValue={editItem?.phone} className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Role</label>
                          <select name="role" defaultValue={editItem?.role} required className="w-full px-3 py-2 border rounded">
                            <option value="HOUSEKEEPER">Housekeeper</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="CHEF">Chef</option>
                            <option value="MAINTENANCE">Maintenance</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Department</label><input name="department" defaultValue={editItem?.department} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="ON_LEAVE">On Leave</option>
                          </select>
                        </div>
                      </>
                    )}
                    {itemType === 'housekeeping' && (
                      <>
                        <div><label className="block text-sm mb-1">Room</label><input name="roomId" defaultValue={editItem?.roomId} disabled className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="MAINTENANCE_NEEDED">Maintenance Needed</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Priority</label>
                          <select name="priority" defaultValue={editItem?.priority} required className="w-full px-3 py-2 border rounded">
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Assign To</label>
                          <select name="assignedToId" defaultValue={editItem?.assignedToId || ''} className="w-full px-3 py-2 border rounded">
                            <option value="">Unassigned</option>
                            {staffList.filter(s => s.status === 'ACTIVE').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Notes</label><input name="notes" defaultValue={editItem?.notes} className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'inventory' && (
                      <>
                        <div><label className="block text-sm mb-1">Name</label><input name="name" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Category</label>
                          <select name="category" defaultValue={editItem?.category} required className="w-full px-3 py-2 border rounded">
                            <option value="MINIBAR">Minibar</option>
                            <option value="AMENITIES">Amenities</option>
                            <option value="LINENS">Linens</option>
                            <option value="IN_ROOM_COFFEE">In-Room Coffee</option>
                            <option value="CLEANING_SUPPLIES">Cleaning Supplies</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Quantity</label><input name="quantity" type="number" defaultValue={editItem?.quantity} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Min Stock</label><input name="minStock" type="number" defaultValue={editItem?.minStock} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Unit Price (€)</label><input name="unitPrice" type="number" step="0.01" defaultValue={editItem?.unitPrice} required className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'pricing' && (
                      <>
                        <div><label className="block text-sm mb-1">Name</label><input name="name" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Season Type</label>
                          <select name="seasonType" defaultValue={editItem?.seasonType} required className="w-full px-3 py-2 border rounded">
                            <option value="LOW_SEASON">Low Season</option>
                            <option value="REGULAR">Regular</option>
                            <option value="HIGH_SEASON">High Season</option>
                            <option value="PEAK_SEASON">Peak Season</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Start Date</label><input name="startDate" type="date" defaultValue={editItem?.startDate} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">End Date</label><input name="endDate" type="date" defaultValue={editItem?.endDate} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Multiplier</label><input name="multiplier" type="number" step="0.1" defaultValue={editItem?.multiplier} required className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'reservation' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Guest Name</label><input name="guestName" defaultValue={editItem?.guestName} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Room</label><input name="roomNumber" defaultValue={editItem?.roomNumber} required className="w-full px-3 py-2 border rounded" /></div>
                        </div>
                        <div><label className="block text-sm mb-1">Email</label><input name="guestEmail" type="email" defaultValue={editItem?.guestEmail} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Phone</label><input name="guestPhone" defaultValue={editItem?.guestPhone} className="w-full px-3 py-2 border rounded" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Check-in</label><input name="checkIn" type="date" defaultValue={editItem?.checkIn} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Check-out</label><input name="checkOut" type="date" defaultValue={editItem?.checkOut} required className="w-full px-3 py-2 border rounded" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Total Price (€)</label><input name="totalPrice" type="number" defaultValue={editItem?.totalPrice} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Status</label>
                            <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="ACTIVE">Active</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {itemType === 'room' && (
                      <>
                        <div><label className="block text-sm mb-1">Room Name</label><input name="roomName" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Type</label>
                          <select name="roomType" defaultValue={editItem?.type} required className="w-full px-3 py-2 border rounded">
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Twin">Twin</option>
                            <option value="Family">Family</option>
                            <option value="Suite">Suite</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Price per night (€)</label><input name="roomPrice" type="number" defaultValue={editItem?.price} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="roomStatus" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Image</label>
                          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                            {mediaItems.filter(m => m.type === 'ROOM' || m.type === 'HOTEL').map((media) => (
                              <label key={media.id} className="cursor-pointer relative group">
                                <input 
                                  type="radio" 
                                  name="roomImage" 
                                  value={media.url}
                                  defaultChecked={editItem?.imageUrl === media.url}
                                  className="sr-only"
                                />
                                <img 
                                  src={media.url} 
                                  alt={media.filename}
                                  className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-[#867050] peer-checked:border-[#867050]" 
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {itemType === 'media' && (
                      <>
                        <div><label className="block text-sm mb-1">Image Name</label>
                          <input name="filename" defaultValue={editItem?.filename} required className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div><label className="block text-sm mb-1">Image Type</label>
                          <select name="type" defaultValue={editItem?.type} required className="w-full px-3 py-2 border rounded">
                            <option value="ROOM">Room</option>
                            <option value="HOTEL">Hotel</option>
                            <option value="RESTAURANT">Restaurant</option>
                            <option value="FACILITY">Facility</option>
                            <option value="GALLERY">Gallery</option>
                          </select>
                        </div>
                      </>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h3 className="font-display text-xl mb-4">Confirm Delete</h3>
                <p className="text-[var(--secondary)] mb-4">
                  {itemType === 'media' && selectedMedia.length > 0 
                    ? `Are you sure you want to delete ${selectedMedia.length} item(s)? This action cannot be undone.`
                    : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
                  }
                </p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteId(null); setSelectedMedia([]); }} className="px-4 py-2 border rounded">Cancel</button>
                  <button onClick={() => {
                    if (itemType === 'staff') deleteStaff(deleteId!);
                    else if (itemType === 'housekeeping') deleteHousekeepingTask(deleteId!);
                    else if (itemType === 'inventory') deleteInventoryItem(deleteId!);
                    else if (itemType === 'pricing') deleteSeasonalRate(deleteId!);
                    else if (itemType === 'reservation') deleteReservation(deleteId!);
                    else if (itemType === 'room') deleteRoom(deleteId!);
                    else if (itemType === 'media' && selectedMedia.length > 0) deleteSelectedMedia();
                    else if (itemType === 'media') deleteMediaItem(deleteId!);
                  }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          )}

          {previewMedia && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setPreviewMedia(null)}>
              <button onClick={() => setPreviewMedia(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
                <X className="w-8 h-8" />
              </button>
              {previewMedia.mediaType === 'VIDEO' ? (
                <video 
                  src={previewMedia.url} 
                  controls 
                  autoPlay 
                  className="max-h-[80vh] max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.filename} 
                  className="max-h-[80vh] max-w-[90vw] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}

          {showAddHousekeeping && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Housekeeping Task</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addHousekeepingTask({
                    roomId: (form.elements.namedItem('roomId') as HTMLInputElement).value,
                    priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
                    assignedToId: (form.elements.namedItem('assignedToId') as HTMLSelectElement).value || null,
                    notes: (form.elements.namedItem('notes') as HTMLInputElement).value,
                    status: 'PENDING',
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Room Number</label><input name="roomId" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 101" /></div>
                    <div><label className="block text-sm mb-1">Priority</label>
                      <select name="priority" required className="w-full px-3 py-2 border rounded">
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Assign To</label>
                      <select name="assignedToId" className="w-full px-3 py-2 border rounded">
                        <option value="">Unassigned</option>
                        {staffList.filter(s => s.status === 'ACTIVE').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Notes</label><input name="notes" className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddHousekeeping(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Task</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddInventory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Inventory Item</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addInventoryItem({
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    category: (form.elements.namedItem('category') as HTMLSelectElement).value,
                    quantity: parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value),
                    minStock: parseInt((form.elements.namedItem('minStock') as HTMLInputElement).value),
                    unitPrice: parseFloat((form.elements.namedItem('unitPrice') as HTMLInputElement).value),
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Item Name</label><input name="name" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Category</label>
                      <select name="category" required className="w-full px-3 py-2 border rounded">
                        <option value="MINIBAR">Minibar</option>
                        <option value="AMENITIES">Amenities</option>
                        <option value="LINENS">Linens</option>
                        <option value="IN_ROOM_COFFEE">In-Room Coffee</option>
                        <option value="CLEANING_SUPPLIES">Cleaning Supplies</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Quantity</label><input name="quantity" type="number" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Min Stock</label><input name="minStock" type="number" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Unit Price (€)</label><input name="unitPrice" type="number" step="0.01" required className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddInventory(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Item</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddSeason && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Seasonal Rate</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addSeasonalRate({
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    seasonType: (form.elements.namedItem('seasonType') as HTMLSelectElement).value,
                    startDate: (form.elements.namedItem('startDate') as HTMLInputElement).value,
                    endDate: (form.elements.namedItem('endDate') as HTMLInputElement).value,
                    multiplier: parseFloat((form.elements.namedItem('multiplier') as HTMLInputElement).value),
                    isActive: true,
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Name</label><input name="name" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Season Type</label>
                      <select name="seasonType" required className="w-full px-3 py-2 border rounded">
                        <option value="LOW_SEASON">Low Season</option>
                        <option value="REGULAR">Regular</option>
                        <option value="HIGH_SEASON">High Season</option>
                        <option value="PEAK_SEASON">Peak Season</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Start Date</label><input name="startDate" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">End Date</label><input name="endDate" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Multiplier</label><input name="multiplier" type="number" step="0.1" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 1.5" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddSeason(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Season</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddReservation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="font-display text-xl mb-4">Add New Reservation (Phone/Call)</h3>
                <p className="text-sm text-[var(--secondary)] mb-4">Create reservation for client calling by phone</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const checkIn = new Date((form.elements.namedItem('checkIn') as HTMLInputElement).value);
                  const checkOut = new Date((form.elements.namedItem('checkOut') as HTMLInputElement).value);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                  const pricePerNight = parseInt((form.elements.namedItem('pricePerNight') as HTMLInputElement).value);
                  const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
                  const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
                  addReservation({
                    guestName: firstName + ' ' + lastName,
                    guestEmail: (form.elements.namedItem('guestEmail') as HTMLInputElement).value,
                    guestPhone: (form.elements.namedItem('guestPhone') as HTMLInputElement).value,
                    roomNumber: (form.elements.namedItem('roomNumber') as HTMLInputElement).value,
                    checkIn: (form.elements.namedItem('checkIn') as HTMLInputElement).value,
                    checkOut: (form.elements.namedItem('checkOut') as HTMLInputElement).value,
                    totalPrice: nights * pricePerNight,
                    status: 'CONFIRMED',
                  });
                }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Guest First Name</label><input name="firstName" required className="w-full px-3 py-2 border rounded" placeholder="John" /></div>
                      <div><label className="block text-sm mb-1">Guest Last Name</label><input name="lastName" required className="w-full px-3 py-2 border rounded" placeholder="Doe" /></div>
                    </div>
                    <div><label className="block text-sm mb-1">Email</label><input name="guestEmail" type="email" required className="w-full px-3 py-2 border rounded" placeholder="john@example.com" /></div>
                    <div><label className="block text-sm mb-1">Phone</label><input name="guestPhone" type="tel" required className="w-full px-3 py-2 border rounded" placeholder="+33 6 12 34 56 78" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Room Number</label>
                        <select name="roomNumber" required className="w-full px-3 py-2 border rounded">
                          <option value="">Select Room</option>
                          {adminRooms.map(r => <option key={r.id} value={r.id}>Room {r.id} - {r.name}</option>)}
                        </select>
                      </div>
                      <div><label className="block text-sm mb-1">Price per Night (€)</label><input name="pricePerNight" type="number" required className="w-full px-3 py-2 border rounded" placeholder="79" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Check-in Date</label><input name="checkIn" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                      <div><label className="block text-sm mb-1">Check-out Date</label><input name="checkOut" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    </div>
                    <div><label className="block text-sm mb-1">Number of Guests</label><input name="guests" type="number" defaultValue="2" min="1" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Special Requests (Optional)</label><textarea name="specialRequests" className="w-full px-3 py-2 border rounded" rows={2} placeholder="Any special requests..." /></div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button type="button" onClick={() => setShowAddReservation(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Create Reservation</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddMedia && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl">Add New Image(s)</h3>
                  <button onClick={() => { setShowAddMedia(false); setAddMediaItems([]); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                </div>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-[#867050] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files) handleFileSelection(files);
                  }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-[var(--secondary)] mb-1">Drag & drop images or videos here or click to browse</p>
                  <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF, WebP, MP4, WebM</p>
                </div>

                <input 
                  id="file-input"
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFileSelection(e.target.files);
                  }}
                />

                {addMediaItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{addMediaItems.length} item(s) selected</p>
                      <button 
                        type="button" 
                        onClick={() => setAddMediaItems([])} 
                        className="text-sm text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                      {addMediaItems.map((item) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          {item.mediaType === 'VIDEO' ? (
                            <video src={item.url} className="w-full h-24 object-cover" />
                          ) : (
                            <img src={item.url} alt={item.filename} className="w-full h-24 object-cover" />
                          )}
                          <button 
                            type="button"
                            onClick={() => removeMediaToAdd(item.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <button type="button" onClick={() => { setShowAddMedia(false); setAddMediaItems([]); }} className="px-4 py-2 border rounded">Cancel</button>
                  <button 
                    type="button" 
                    onClick={submitMediaItems}
                    disabled={addMediaItems.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload {addMediaItems.length > 0 ? `(${addMediaItems.length})` : ''} Image(s)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}