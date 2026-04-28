"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Clock, MapPin, Search, Ticket, Filter } from "lucide-react";

interface ShowtimeItem {
  id: string;
  startTime: string;
  price: number;
  movie: {
    id: string;
    title: string;
    poster: string | null;
    duration: number;
  };
  room: {
    id: string;
    name: string;
    roomType: string;
  };
}

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  duration: number;
  showtimes: ShowtimeItem[];
}

export default function ShowtimesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchShowtimes();
  }, []);

  useEffect(() => {
    const dates = getAvailableDates();
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [movies]);

  const fetchShowtimes = async () => {
    try {
      const res = await fetch("/api/movies?status=NOW_SHOWING&pageSize=50");
      const data = await res.json();
      if (data.success) {
        setMovies(data.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDates = () => {
    const dates = new Set<string>();
    movies.forEach((movie) => {
      movie.showtimes?.forEach((st: ShowtimeItem) => {
        const date = new Date(st.startTime).toISOString().split("T")[0];
        dates.add(date);
      });
    });
    return Array.from(dates).sort();
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((movie) => ({
      ...movie,
      showtimes: movie.showtimes?.filter((st: ShowtimeItem) => {
        const stDate = new Date(st.startTime).toISOString().split("T")[0];
        return stDate === selectedDate;
      }) || [],
    }))
    .filter((movie) => movie.showtimes.length > 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  };

  const dates = getAvailableDates();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary-600" />
              Lịch chiếu
            </h1>
            <p className="text-gray-600">Xem lịch chiếu phim và đặt vé trực tuyến</p>
          </div>

          {/* Search & Date Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Date Tabs */}
              {dates.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {dates.slice(0, 7).map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedDate === date
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {formatShortDate(date)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Movies List */}
          {filteredMovies.length > 0 ? (
            <div className="space-y-6">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Movie Header */}
                  <div className="p-4 border-b flex gap-4">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link href={`/movies/${movie.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {movie.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {movie.showtimes[0]?.movie?.duration || movie.duration || 0} phút
                      </p>
                    </div>
                  </div>

                  {/* Showtimes Grid */}
                  <div className="p-4">
                    {movie.showtimes.map((showtime: ShowtimeItem) => (
                      <div
                        key={showtime.id}
                        className="flex items-center justify-between p-3 mb-2 last:mb-0 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">
                              {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{showtime.room.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {showtime.room.roomType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-primary-600">
                            {formatCurrency(showtime.price)}
                          </span>
                          <Link href={`/booking/${showtime.id}`}>
                            <Button size="sm" className="gap-2">
                              <Ticket className="h-4 w-4" />
                              Đặt vé
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có lịch chiếu</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Không tìm thấy phim phù hợp"
                  : "Chưa có lịch chiếu cho ngày này"}
              </p>
              <Link href="/movies">
                <Button variant="outline">Xem danh sách phim</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
