"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

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

interface ApiResponse {
  success: boolean;
  data: {
    items: Movie[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [currentPage, statusFilter]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "12",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/movies?${params}`);
      const data: ApiResponse = await res.json();

      if (data.success) {
        setMovies(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-primary-600">Danh sách</span> phim
            </h1>
            <p className="text-gray-600">
              Khám phá các bộ phim đang chiếu và sắp chiếu tại rạp
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <Button type="submit">Tìm kiếm</Button>
              </form>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter("");
                    setCurrentPage(1);
                  }}
                >
                  Tất cả
                </Button>
                <Button
                  variant={statusFilter === "NOW_SHOWING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter("NOW_SHOWING");
                    setCurrentPage(1);
                  }}
                >
                  Đang chiếu
                </Button>
                <Button
                  variant={statusFilter === "COMING_SOON" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter("COMING_SOON");
                    setCurrentPage(1);
                  }}
                >
                  Sắp chiếu
                </Button>
              </div>
            </div>

            {/* Genre Filter */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                Thể loại:
              </span>
              {genres.map((genre) => (
                <button
                  key={genre}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Movie Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    showtimesCount={movie.showtimes?.length || 0}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-500 mb-4">Không tìm thấy phim nào.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
