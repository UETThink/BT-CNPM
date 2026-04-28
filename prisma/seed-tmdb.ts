// Fetch upcoming movies from TMDB API and seed the database
// Get your API key from: https://www.themoviedb.org/settings/api

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

async function getTMDBGenres(): Promise<TMDBGenre[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=vi-VN`
  );
  const data = await response.json();
  return data.genres || [];
}

async function getUpcomingMovies(page = 1): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}&region=VN`
  );
  const data = await response.json();
  return data.results || [];
}

async function getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=vi-VN`
  );
  if (!response.ok) return null;
  return response.json();
}

async function getMovieCredits(movieId: number): Promise<{ director: string; cast: string[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=vi-VN`
  );
  if (!response.ok) return { director: "", cast: [] };
  
  const data = await response.json();
  const director = data.crew?.find((c: { job: string }) => c.job === "Director")?.name || "";
  const cast = data.cast?.slice(0, 5).map((c: { name: string }) => c.name) || [];
  
  return { director, cast };
}

function getGenreNames(genreIds: number[], allGenres: TMDBGenre[]): string {
  return genreIds
    .map((id) => allGenres.find((g) => g.id === id)?.name || "")
    .filter(Boolean)
    .join(", ");
}

async function createRooms() {
  const existingRooms = await prisma.room.count();
  if (existingRooms > 0) {
    console.log("✅ Rooms already exist, skipping...");
    return;
  }

  const rooms = await Promise.all([
    prisma.room.create({
      data: { name: "Phòng 1", rows: 8, seatsPerRow: 12, roomType: "STANDARD" },
    }),
    prisma.room.create({
      data: { name: "Phòng 2", rows: 10, seatsPerRow: 14, roomType: "VIP" },
    }),
    prisma.room.create({
      data: { name: "IMAX 1", rows: 12, seatsPerRow: 16, roomType: "IMAX" },
    }),
    prisma.room.create({
      data: { name: "3D 1", rows: 8, seatsPerRow: 12, roomType: "THREE_D" },
    }),
  ]);
  console.log("✅ Created", rooms.length, "rooms");
  return rooms;
}

async function createUsers() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("✅ Users already exist, skipping...");
    return;
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@cinema.com",
      password: adminPassword,
      name: "Admin Cinema",
      phone: "0901234567",
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("user123", 12);
  await prisma.user.create({
    data: {
      email: "user@cinema.com",
      password: customerPassword,
      name: "Nguyễn Văn Khách",
      phone: "0909876543",
      role: "CUSTOMER",
    },
  });
  console.log("✅ Created admin and customer users");
}

async function seedMoviesFromTMDB() {
  console.log("\n🌐 Fetching movies from TMDB...");

  // Check if TMDB API key is set
  if (TMDB_API_KEY === "YOUR_TMDB_API_KEY") {
    console.log("\n⚠️  TMDB API key not set!");
    console.log("📝 Please:");
    console.log("   1. Get a free API key from: https://www.themoviedb.org/settings/api");
    console.log("   2. Add it to your .env file: TMDB_API_KEY=your_api_key");
    console.log("   3. Run this script again: npm run db:seed-tmdb\n");
    return;
  }

  // Get genres
  const genres = await getTMDBGenres();
  console.log("✅ Fetched", genres.length, "genres");

  // Get upcoming movies (multiple pages)
  const allMovies: TMDBMovie[] = [];
  for (let page = 1; page <= 3; page++) {
    const movies = await getUpcomingMovies(page);
    allMovies.push(...movies);
  }
  console.log("✅ Fetched", allMovies.length, "upcoming movies");

  // Clear existing movies (keep users and rooms)
  await prisma.bookingSeat.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  console.log("✅ Cleared existing movies and showtimes");

  // Get rooms for showtimes
  const rooms = await prisma.room.findMany();

  // Process movies and get details
  console.log("\n📽️  Processing movies with full details...");
  let successCount = 0;

  for (const movie of allMovies.slice(0, 20)) {
    // Limit to 20 movies
    try {
      const details = await getMovieDetails(movie.id);
      if (!details) continue;

      const { director, cast } = await getMovieCredits(movie.id);
      const genreString = getGenreNames(
        details.genres?.map((g) => g.id) || [],
        genres
      );

      // Determine status based on release date
      const releaseDate = new Date(details.release_date || Date.now());
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const status = releaseDate <= todayStart ? "NOW_SHOWING" : "COMING_SOON";

      // Create movie
      const createdMovie = await prisma.movie.create({
        data: {
          title: details.title,
          poster: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : null,
          description: details.overview,
          director: director,
          cast: cast.join(", "),
          genre: genreString || "Action",
          duration: details.runtime || 120,
          rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
          language: "English",
          status: status,
          releaseDate: releaseDate,
        },
      });

      // Create showtimes for the next 7 days
      const todayForShowtime = new Date();
      todayForShowtime.setHours(0, 0, 0, 0);

      for (let day = 1; day <= 7; day++) {
        const showDate = new Date(todayForShowtime);
        showDate.setDate(showDate.getDate() + day);

        // Morning show
        const morningTime = new Date(showDate);
        morningTime.setHours(10, 0, 0, 0);

        // Afternoon show
        const afternoonTime = new Date(showDate);
        afternoonTime.setHours(14, 0, 0, 0);

        // Evening show
        const eveningTime = new Date(showDate);
        eveningTime.setHours(19, 0, 0, 0);

        const times = [morningTime, afternoonTime, eveningTime];

        for (const startTime of times) {
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          const basePrice = room.roomType === "VIP" ? 120000 : room.roomType === "IMAX" ? 150000 : 75000;
          const endTime = new Date(startTime.getTime() + (details.runtime || 120) * 60000);

          const showtime = await prisma.showtime.create({
            data: {
              movieId: createdMovie.id,
              roomId: room.id,
              startTime,
              endTime,
              price: basePrice,
            },
          });

          // Create seats for this showtime
          const seats = [];
          for (let row = 0; row < room.rows; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            const isVip = row >= room.rows - 2;
            const seatPrice = isVip ? basePrice * 1.5 : basePrice;

            for (let num = 1; num <= room.seatsPerRow; num++) {
              seats.push({
                showtimeId: showtime.id,
                row: rowLetter,
                number: num,
                type: isVip ? "VIP" : "STANDARD",
                price: seatPrice,
              });
            }
          }

          await prisma.seat.createMany({ data: seats });
        }
      }

      successCount++;
      console.log(`  ✅ ${successCount}. ${details.title}`);
    } catch (error) {
      console.error(`  ❌ Error processing movie ${movie.title}:`, error);
    }
  }

  console.log(`\n🎉 Successfully processed ${successCount} movies from TMDB!`);
}

async function main() {
  console.log("🎬 Cinema Ticket System - TMDB Seed\n");
  console.log("=" .repeat(50));

  try {
    await createUsers();
    await createRooms();
    await seedMoviesFromTMDB();

    console.log("\n" + "=".repeat(50));
    console.log("📋 Login credentials:");
    console.log("   Admin: admin@cinema.com / admin123");
    console.log("   User: user@cinema.com / user123");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
