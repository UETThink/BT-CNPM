"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, Search, Film } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  genre: string;
  duration: number;
  rating: number | null;
  status: string;
  releaseDate: string;
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    genre: "",
    duration: "",
    rating: "",
    description: "",
    director: "",
    cast: "",
    status: "NOW_SHOWING",
    releaseDate: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies?pageSize=100");
      const data = await res.json();
      if (data.success) {
        setMovies(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      const url = editingMovie ? `/api/movies/${editingMovie.id}` : "/api/movies";
      const method = editingMovie ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingMovie ? "Cập nhật thành công" : "Thêm phim thành công",
          variant: "success",
        });
        setShowModal(false);
        resetForm();
        fetchMovies();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      poster: movie.poster || "",
      genre: movie.genre,
      duration: movie.duration.toString(),
      rating: movie.rating?.toString() || "",
      description: "",
      director: "",
      cast: "",
      status: movie.status,
      releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phim này?")) return;

    try {
      const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Xóa phim thành công", variant: "success" });
        fetchMovies();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const resetForm = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      poster: "",
      genre: "",
      duration: "",
      rating: "",
      description: "",
      director: "",
      cast: "",
      status: "NOW_SHOWING",
      releaseDate: "",
    });
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    NOW_SHOWING: { label: "Đang chiếu", class: "bg-green-100 text-green-700" },
    COMING_SOON: { label: "Sắp chiếu", class: "bg-yellow-100 text-yellow-700" },
    ENDED: { label: "Đã kết thúc", class: "bg-gray-100 text-gray-700" },
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phim</h1>
          <p className="text-gray-500">Thêm, sửa, xóa phim trong hệ thống</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm phim mới
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Movies Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thể loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thời lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Film className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{movie.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{movie.genre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{movie.duration} phút</td>
                  <td className="px-6 py-4">
                    {movie.rating ? (
                      <span className="text-sm font-medium">
                        ⭐ {movie.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusConfig[movie.status]?.class
                      }`}
                    >
                      {statusConfig[movie.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMovie ? "Sửa phim" : "Thêm phim mới"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Tên phim"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Poster URL"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Thể loại"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                />
                <Input
                  label="Thời lượng (phút)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Rating (0-10)"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="NOW_SHOWING">Đang chiếu</option>
                    <option value="COMING_SOON">Sắp chiếu</option>
                    <option value="ENDED">Đã kết thúc</option>
                  </select>
                </div>
              </div>
              <Input
                label="Ngày khởi chiếu"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                required
              />
              <Input
                label="Đạo diễn"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              />
              <Input
                label="Diễn viên"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingMovie ? "Lưu thay đổi" : "Thêm phim"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
