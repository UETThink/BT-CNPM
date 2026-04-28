"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Search, Play, ChevronRight, Star, Ticket } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  genre: string;
  duration: number;
  rating: number | null;
  status: string;
  releaseDate: string;
  showtimes: { id: string }[];
}

export default function HomePage() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [nowRes, comingRes] = await Promise.all([
        fetch("/api/movies?status=NOW_SHOWING&pageSize=8"),
        fetch("/api/movies?status=COMING_SOON&pageSize=4"),
      ]);

      const nowData = await nowRes.json();
      const comingData = await comingRes.json();

      setNowShowing(nowData.data?.items || []);
      setComingSoon(comingData.data?.items || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredMovie = nowShowing[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 bg-black/40" />
          {featuredMovie && (
            <div className="absolute inset-0">
              {featuredMovie.poster ? (
                <img
                  src={featuredMovie.poster}
                  alt={featuredMovie.title}
                  className="w-full h-full object-cover opacity-50"
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
            </div>
          )}
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-2xl">
              {featuredMovie && (
                <>
                  <span className="inline-block px-3 py-1 bg-primary-600 rounded-full text-sm font-medium mb-4">
                    Đang chiếu
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {featuredMovie.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4 text-gray-300">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      {featuredMovie.rating?.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{featuredMovie.genre}</span>
                    <span>•</span>
                    <span>{featuredMovie.duration} phút</span>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    Khám phá bộ phim đang gây sốt tại các rạp chiếu phim trên toàn quốc. 
                    Đặt vé ngay hôm nay để không bỏ lỡ những trải nghiệm điện ảnh tuyệt vời nhất.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href={`/movies/${featuredMovie.id}`}>
                      <Button size="lg" className="gap-2 bg-primary-600 hover:bg-primary-700">
                        <Ticket className="h-5 w-5" />
                        Đặt vé ngay
                      </Button>
                    </Link>
                    <Link href={`/movies/${featuredMovie.id}`}>
                      <button className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border h-12 px-6 text-lg gap-2 text-white border-white hover:bg-white/10">
                        <Play className="h-5 w-5" />
                        Xem trailer
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Link href="/movies">
                <Button size="lg">Tìm kiếm</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Now Showing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="text-primary-600">Phim</span> đang chiếu
              </h2>
              <Link href="/movies?status=NOW_SHOWING" className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : nowShowing.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {nowShowing.slice(0, 8).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    showtimesCount={movie.showtimes?.length || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Không có phim nào đang chiếu.</p>
                <Link href="/movies" className="text-primary-600 hover:underline">
                  Xem tất cả phim
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="text-secondary-600">Phim</span> sắp chiếu
              </h2>
              <Link href="/movies?status=COMING_SOON" className="flex items-center gap-1 text-secondary-600 hover:text-secondary-700 font-medium">
                Xem tất cả <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : comingSoon.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {comingSoon.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    showtimesCount={movie.showtimes?.length || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Không có phim sắp chiếu.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Đặt vé ngay - Không bỏ lỡ bộ phim yêu thích!
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Đăng ký tài khoản ngay hôm nay để nhận nhiều ưu đãi hấp dẫn và 
              đặt vé nhanh chóng, tiện lợi.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-primary-600 bg-white hover:bg-gray-100">
                  Đăng ký ngay
                </Button>
              </Link>
              <Link href="/movies">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Xem phim ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
