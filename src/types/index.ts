export interface MovieWithShowtimes {
  id: string;
  title: string;
  poster: string | null;
  trailer: string | null;
  description: string | null;
  director: string | null;
  cast: string | null;
  genre: string;
  duration: number;
  rating: number | null;
  language: string;
  status: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  showtimes?: ShowtimeWithRoom[];
}

export interface ShowtimeWithRoom {
  id: string;
  movieId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  isActive: boolean;
  room?: {
    id: string;
    name: string;
    roomType: string;
  };
}

export interface SeatInfo {
  id: string;
  showtimeId: string;
  row: string;
  number: number;
  type: string;
  price: number;
  isBooked?: boolean;
}

export interface BookingWithDetails {
  id: string;
  userId: string;
  showtimeId: string;
  totalAmount: number;
  status: string;
  paymentId: string | null;
  qrCode: string | null;
  bookingCode: string;
  expiresAt: Date;
  createdAt: Date;
  showtime?: {
    id: string;
    startTime: Date;
    movie: {
      id: string;
      title: string;
      poster: string | null;
    };
    room: {
      id: string;
      name: string;
    };
  };
  bookingSeats?: {
    id: string;
    seatId: string;
    price: number;
    seat?: {
      row: string;
      number: number;
    };
  }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalMovies: number;
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  todayRevenue: number;
}

export interface CreateBookingRequest {
  showtimeId: string;
  seatIds: string[];
}

export interface PaymentRequest {
  bookingId: string;
  method: string;
}
