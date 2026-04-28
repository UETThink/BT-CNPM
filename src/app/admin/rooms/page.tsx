"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { Plus, Pencil, Trash2, Search, Building } from "lucide-react";

interface Room {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  roomType: string;
  isActive: boolean;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rows: "",
    seatsPerRow: "",
    roomType: "STANDARD",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        rows: parseInt(formData.rows),
        seatsPerRow: parseInt(formData.seatsPerRow),
        roomType: formData.roomType,
      };

      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : "/api/rooms";
      const method = editingRoom ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingRoom ? "Cập nhật thành công" : "Thêm phòng thành công",
          variant: "success",
        });
        setShowModal(false);
        resetForm();
        fetchRooms();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error saving room:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      rows: room.rows.toString(),
      seatsPerRow: room.seatsPerRow.toString(),
      roomType: room.roomType,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Xóa phòng thành công", variant: "success" });
        fetchRooms();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      rows: "",
      seatsPerRow: "",
      roomType: "STANDARD",
    });
  };

  const roomTypeConfig: Record<string, { label: string; class: string }> = {
    STANDARD: { label: "Standard", class: "bg-gray-100 text-gray-700" },
    VIP: { label: "VIP", class: "bg-purple-100 text-purple-700" },
    IMAX: { label: "IMAX", class: "bg-blue-100 text-blue-700" },
    THREE_D: { label: "3D", class: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng chiếu</h1>
          <p className="text-gray-500">Thêm, sửa, xóa phòng chiếu trong hệ thống</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm phòng mới
        </Button>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Building className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{room.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roomTypeConfig[room.roomType]?.class
                      }`}
                    >
                      {roomTypeConfig[room.roomType]?.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Số hàng ghế</p>
                  <p className="font-medium text-gray-900">{room.rows}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ghế/hàng</p>
                  <p className="font-medium text-gray-900">{room.seatsPerRow}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Tổng số ghế</p>
                  <p className="font-medium text-gray-900">{room.rows * room.seatsPerRow}</p>
                </div>
              </div>

              {/* Seat Layout Preview */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Sơ đồ ghế:</p>
                <div className="flex justify-center gap-0.5">
                  {[...Array(Math.min(room.seatsPerRow, 10))].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-primary-200 rounded-t text-xs flex items-center justify-center text-primary-600"
                    >
                      {String.fromCharCode(65)}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {[...Array(Math.min(room.seatsPerRow, 10))].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-primary-100 rounded text-xs" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phòng chiếu</h3>
          <p className="text-gray-500 mb-4">Hãy thêm phòng chiếu đầu tiên cho hệ thống.</p>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm phòng mới
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRoom ? "Sửa phòng chiếu" : "Thêm phòng chiếu mới"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Tên phòng"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Phòng 1"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Số hàng ghế"
                  type="number"
                  value={formData.rows}
                  onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                  min="1"
                  max="15"
                  required
                />
                <Input
                  label="Ghế mỗi hàng"
                  type="number"
                  value={formData.seatsPerRow}
                  onChange={(e) => setFormData({ ...formData, seatsPerRow: e.target.value })}
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại phòng
                </label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="VIP">VIP</option>
                  <option value="IMAX">IMAX</option>
                  <option value="THREE_D">3D</option>
                </select>
              </div>
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
                  {editingRoom ? "Lưu thay đổi" : "Thêm phòng"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
