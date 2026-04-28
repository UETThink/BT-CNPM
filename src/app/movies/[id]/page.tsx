"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { Star, Clock, Calendar, Play, ArrowLeft, Ticket, MapPin, X } from "lucide-react";

interface Movie {
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
  releaseDate: string;
  showtimes: {
    id: string;
    startTime: string;
    price: number;
    room: {
      id: string;
      name: string;
      roomType: string;
    };
  }[];
}

interface ShowtimeItem {
  id: string;
  startTime: string;
  price: number;
  room: {
    id: string;
    name: string;
    roomType: string;
  };
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showtimesByDate, setShowtimesByDate] = useState<Record<string, ShowtimeItem[]>>({});
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, []);

  useEffect(() => {
    if (movie?.showtimes) {
      const grouped: Record<string, ShowtimeItem[]> = {};
      movie.showtimes.forEach((st) => {
        const date = new Date(st.startTime).toISOString().split("T")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(st);
      });
      setShowtimesByDate(grouped);
      const dates = Object.keys(grouped).sort();
      if (dates.length > 0 && !selectedDate) {
        setSelectedDate(dates[0]);
      }
    }
  }, [movie]);

  const fetchMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${id}`);
      const data = await res.json();
      if (data.success) {
        setMovie(data.data);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookShowtime = (showtimeId: string) => {
    if (!user) {
      router.push(`/login?redirect=/booking/${showtimeId}`);
    } else {
      router.push(`/booking/${showtimeId}`);
    }
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    NOW_SHOWING: { label: "Đang chiếu", class: "bg-green-500" },
    COMING_SOON: { label: "Sắp chiếu", class: "bg-yellow-500" },
    ENDED: { label: "Đã kết thúc", class: "bg-gray-500" },
  };

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

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy phim</h2>
            <Link href="/movies">
              <Button>Quay lại danh sách phim</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = statusConfig[movie.status] || statusConfig.ENDED;
  const dates = Object.keys(showtimesByDate).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          <div className="relative container mx-auto px-4 py-16">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Quay lại
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="w-64 mx-auto lg:mx-0">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  {movie.trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Play className="h-5 w-5" />
                      Xem Trailer
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.class} text-white`}>
                    {statusInfo.label}
                  </span>
                  {movie.rating && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      {movie.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {movie.duration} phút
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-2">
                    🌐 {movie.language}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.split(",").map((g) => (
                    <span key={g} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                      {g.trim()}
                    </span>
                  ))}
                </div>

                {movie.description && (
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {movie.description}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {movie.director && (
                    <div>
                      <span className="text-gray-500 text-sm">Đạo diễn</span>
                      <p className="text-white font-medium">{movie.director}</p>
                    </div>
                  )}
                  {movie.cast && (
                    <div>
                      <span className="text-gray-500 text-sm">Diễn viên</span>
                      <p className="text-white font-medium">{movie.cast}</p>
                    </div>
                  )}
                </div>

                {movie.trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    Xem Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Showtimes Section */}
        {movie.status === "NOW_SHOWING" && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                <Ticket className="inline-block h-6 w-6 mr-2 text-primary-600" />
                Lịch chiếu
              </h2>

              {dates.length > 0 ? (
                <>
                  {/* Date Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                          selectedDate === date
                            ? "bg-primary-600 text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {new Date(date).toLocaleDateString("vi-VN", {
                          weekday: "short",
                          day: "numeric",
                          month: "numeric",
                        })}
                      </button>
                    ))}
                  </div>

                  {/* Showtimes */}
                  {showtimesByDate[selectedDate] && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {showtimesByDate[selectedDate].map((showtime) => (
                        <div
                          key={showtime.id}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{showtime.room.name}</h3>
                              <span className="text-xs text-gray-500">
                                {showtime.room.roomType}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-primary-600">
                              {formatCurrency(showtime.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <Clock className="h-4 w-4" />
                            {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <Button
                            className="w-full gap-2"
                            onClick={() => handleBookShowtime(showtime.id)}
                          >
                            <Ticket className="h-4 w-4" />
                            Đặt vé
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-500">
                    Hiện tại chưa có lịch chiếu cho phim này.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Trailer Modal */}
      {showTrailer && movie.trailer && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <iframe
              src={movie.trailer.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
