"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";

interface Movie {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
}

interface Showtime {
  id: string;
  startTime: string;
  price: number;
  movie: Movie;
  room: Room;
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [showtimesRes, moviesRes, roomsRes] = await Promise.all([
        fetch("/api/showtimes"),
        fetch("/api/movies"),
        fetch("/api/rooms"),
      ]);

      const showtimesData = await showtimesRes.json();
      const moviesData = await moviesRes.json();
      const roomsData = await roomsRes.json();

      if (showtimesData.success) setShowtimes(showtimesData.data.items);
      if (moviesData.success) setMovies(moviesData.data.items);
      if (roomsData.success) setRooms(roomsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: formData.movieId,
          roomId: formData.roomId,
          startTime: formData.startTime,
          price: parseFloat(formData.price),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: "Thêm suất chiếu thành công", variant: "success" });
        setShowModal(false);
        setFormData({ movieId: "", roomId: "", startTime: "", price: "" });
        fetchData();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error creating showtime:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;

    try {
      const res = await fetch(`/api/showtimes/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Xóa suất chiếu thành công", variant: "success" });
        fetchData();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting showtime:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group showtimes by date
  const groupedShowtimes: Record<string, Showtime[]> = {};
  showtimes.forEach((st) => {
    const date = new Date(st.startTime).toLocaleDateString("vi-VN");
    if (!groupedShowtimes[date]) groupedShowtimes[date] = [];
    groupedShowtimes[date].push(st);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Suất chiếu</h1>
          <p className="text-gray-500">Thêm, sửa, xóa suất chiếu trong hệ thống</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm suất chiếu
        </Button>
      </div>

      {/* Showtimes List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />
          ))}
        </div>
      ) : Object.keys(groupedShowtimes).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedShowtimes).map(([date, stimes]) => (
            <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-primary-600" />
                  {date}
                </h3>
              </div>
              <div className="divide-y">
                {stimes.map((st) => (
                  <div key={st.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{st.movie.title}</p>
                        <p className="text-sm text-gray-500">{st.room.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(st.startTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="font-medium text-primary-600">
                          {formatCurrency(st.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(st.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <CalendarClock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có suất chiếu</h3>
          <p className="text-gray-500 mb-4">Hãy thêm suất chiếu đầu tiên cho hệ thống.</p>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm suất chiếu
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Thêm suất chiếu mới</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phim
                </label>
                <select
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Chọn phim</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng chiếu
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Ngày giờ chiếu"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
              <Input
                label="Giá vé cơ bản (VNĐ)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="75000"
                min="0"
                required
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ movieId: "", roomId: "", startTime: "", price: "" });
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit">Thêm suất chiếu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
