import Link from "next/link";
import { Film, Play } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string | null;
  genre: string;
  duration: number;
  rating: number | null;
  status: string;
  releaseDate: Date | string;
  showtimesCount?: number;
}

export function MovieCard({
  id,
  title,
  poster,
  genre,
  duration,
  rating,
  status,
  releaseDate,
  showtimesCount = 0,
}: MovieCardProps) {
  const statusConfig: Record<string, { label: string; class: string }> = {
    NOW_SHOWING: { label: "Đang chiếu", class: "bg-green-100 text-green-700" },
    COMING_SOON: { label: "Sắp chiếu", class: "bg-yellow-100 text-yellow-700" },
    ENDED: { label: "Đã kết thúc", class: "bg-gray-100 text-gray-700" },
  };

  const statusInfo = statusConfig[status] || statusConfig.ENDED;

  return (
    <Link href={`/movies/${id}`} className="block">
      <div className="movie-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Film className="h-16 w-16 text-gray-400" />
            </div>
          )}
          {/* Trailer Overlay - Always visible but faded */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>
          {/* Status Badge */}
          <span
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}
          >
            {statusInfo.label}
          </span>
          {/* Rating Badge */}
          {rating && (
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-sm font-medium flex items-center gap-1">
              <span>⭐</span> {rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded">{genre}</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{duration} phút</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Khởi chiếu: {new Date(releaseDate).toLocaleDateString("vi-VN")}
            </span>
            {showtimesCount > 0 && (
              <span className="text-xs text-sky-600 font-medium">
                {showtimesCount} suất chiếu
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
