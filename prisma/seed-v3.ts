// Cinema Ticket System - Database Seed Script v3
// Run with: npx tsx prisma/seed-v3.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Using Unsplash images for reliable poster URLs
const nowShowingMovies = [
  {
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    description: "Jake Sully và Neytiri tạo nên gia đình và thực hiện hành trình giữa hai thế giới để bảo vệ nhau.",
    director: "James Cameron",
    cast: "Sam Worthington, Zoe Saldana",
    genre: "Sci-Fi, Action, Adventure",
    duration: 192,
    rating: 8.5,
    language: "English",
    releaseDate: new Date("2026-04-28"),
  },
  {
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/Was68 ng8P6e0",
    description: "Paul Atreides hợp nhất với Chani và người Fremen khi anh theo đuổi con đường trả thù.",
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya",
    genre: "Sci-Fi, Adventure, Drama",
    duration: 166,
    rating: 8.8,
    language: "English",
    releaseDate: new Date("2026-04-15"),
  },
  {
    title: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
    description: "Câu chuyện về nhà khoa học J. Robert Oppenheimer và bom nguyên tử.",
    director: "Christopher Nolan",
    cast: "Cillian Murphy, Emily Blunt",
    genre: "Drama, History, Biography",
    duration: 180,
    rating: 9.0,
    language: "English",
    releaseDate: new Date("2026-04-20"),
  },
  {
    title: "Kung Fu Panda 4",
    poster: "https://images.unsplash.com/photo-1566167258217-7a577c0481b5?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/_inKs4eeHiI",
    description: "Po phải từ bỏ vai trò Đại sư Dragon Warrior để trở thành Thủ lĩnh Tâm Linh.",
    director: "Mike Mitchell",
    cast: "Jack Black, Awkwafina",
    genre: "Animation, Action, Comedy",
    duration: 94,
    rating: 7.0,
    language: "English",
    releaseDate: new Date("2026-04-10"),
  },
  {
    title: "Godzilla x Kong",
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/lV1OOlGwExM",
    description: "Hai Titan huyền thoại hợp nhất để chống lại mối đe dọa khổng lồ.",
    director: "Adam Wingard",
    cast: "Rebecca Hall, Brian Tyree Henry",
    genre: "Action, Sci-Fi, Adventure",
    duration: 115,
    rating: 7.5,
    language: "English",
    releaseDate: new Date("2026-04-05"),
  },
  {
    title: "Wonka",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/otNh9bTjXWg",
    description: "Câu chuyện về những năm đầu của Willy Wonka.",
    director: "Paul King",
    cast: "Timothée Chalamet",
    genre: "Comedy, Family, Fantasy",
    duration: 116,
    rating: 7.2,
    language: "English",
    releaseDate: new Date("2026-03-28"),
  },
  {
    title: "Inside Out 2",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/LEjhY15eCx0",
    description: "Riley teenage years với những cảm xúc mới.",
    director: "Kelsey Mann",
    cast: "Amy Poehler, Maya Hawke",
    genre: "Animation, Comedy, Family",
    duration: 96,
    rating: 8.2,
    language: "English",
    releaseDate: new Date("2026-04-12"),
  },
  {
    title: "The Fall Guy",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/aVs6P_8azDI",
    description: "Một stuntman phải đi tìm kẻ giết người khi bị quy kết oan.",
    director: "David Leitch",
    cast: "Ryan Gosling, Emily Blunt",
    genre: "Action, Comedy, Thriller",
    duration: 126,
    rating: 7.4,
    language: "English",
    releaseDate: new Date("2026-04-18"),
  },
  {
    title: "Kingdom of the Apes",
    poster: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/XtFI7SNtVpY",
    description: "Nhiều thế hệ sau chiến tranh giữa người và khỉ.",
    director: "Wes Ball",
    cast: "Owen Teague",
    genre: "Sci-Fi, Action, Adventure",
    duration: 145,
    rating: 7.8,
    language: "English",
    releaseDate: new Date("2026-04-22"),
  },
  {
    title: "Challengers",
    poster: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/VIBm31aHkFE",
    description: "Cựu thiên tài quần vợt biến đồng đội cũ thành đối thủ.",
    director: "Luca Guadagnino",
    cast: "Zendaya, Josh O'Connor",
    genre: "Drama, Romance, Sport",
    duration: 131,
    rating: 7.6,
    language: "English",
    releaseDate: new Date("2026-04-25"),
  },
];

const comingSoonMovies = [
  { title: "Deadpool & Wolverine", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/73_1biulkYk", description: "Deadpool sử dụng Wolverine để cứu vãn thực tại.", director: "Shawn Levy", cast: "Ryan Reynolds, Hugh Jackman", genre: "Action, Comedy, Sci-Fi", duration: 127, releaseDate: new Date("2026-07-26") },
  { title: "Venom 3", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/aN2Tf7fP3hA", description: "Eddie và Venom đối mặt với kẻ thù mới.", director: "Kelly Marcel", cast: "Tom Hardy", genre: "Action, Sci-Fi, Thriller", duration: 110, releaseDate: new Date("2026-06-12") },
  { title: "Despicable Me 4", poster: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/qQlr9-rF32A", description: "Gru và gia đình phải đối mặt với kẻ thù mới.", director: "Chris Renaud", cast: "Steve Carell", genre: "Animation, Comedy, Family", duration: 94, releaseDate: new Date("2026-07-03") },
  { title: "Mufasa: The Lion King", poster: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/9LtQDBqDlAo", description: "Câu chuyện về nguồn gốc của Mufasa.", director: "Barry Jenkins", cast: "Aaron Pierre", genre: "Animation, Drama, Family", duration: 120, releaseDate: new Date("2026-05-30") },
  { title: "Thunderbolts", poster: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/VPxN8tT4U0M", description: "Nhóm anti-hero được tập hợp cho nhiệm vụ bí mật.", director: "Jake Schreier", cast: "Florence Pugh", genre: "Action, Adventure, Sci-Fi", duration: 126, releaseDate: new Date("2026-06-27") },
  { title: "Mission: Impossible 8", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/lOM9cQ6NnXg", description: "Ethan Hunt tiếp tục những nhiệm vụ nguy hiểm.", director: "Christopher McQuarrie", cast: "Tom Cruise", genre: "Action, Adventure, Thriller", duration: 163, releaseDate: new Date("2026-05-23") },
  { title: "Captain America 4", poster: "https://images.unsplash.com/photo-1626274433066-a2375605b18c?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/4LXVDsVul1E", description: "Sam Wilson trở thành Captain America.", director: "Julius Onah", cast: "Anthony Mackie", genre: "Action, Adventure, Sci-Fi", duration: 118, releaseDate: new Date("2026-02-14") },
  { title: "Aquaman 2", poster: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/F6iVvL-FqFc", description: "Arthur Curry phải bảo vệ Atlantis.", director: "James Wan", cast: "Jason Momoa", genre: "Action, Adventure, Fantasy", duration: 123, releaseDate: new Date("2026-06-05") },
  { title: "The Batman Part II", poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/mqqft2x_Aac", description: "Batman tiếp tục cuộc chiến ở Gotham.", director: "Matt Reeves", cast: "Robert Pattinson", genre: "Action, Crime, Drama", duration: 185, releaseDate: new Date("2026-10-03") },
  { title: "Gladiator II", poster: "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/4rgYUipGJNo", description: "Câu chuyện tiếp theo trong đấu trường La Mã.", director: "Ridley Scott", cast: "Paul Mescal", genre: "Action, Drama, History", duration: 148, releaseDate: new Date("2026-11-15") },
  { title: "Moana 2", poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/u3Dq4CjA-Ms", description: "Moana trở lại với cuộc phiêu lưu mới.", director: "David Derrick Jr.", cast: "Auli'i Cravalho", genre: "Animation, Adventure, Family", duration: 100, releaseDate: new Date("2026-11-27") },
  { title: "Wicked", poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/qiD8Rj6ZLhc", description: "Câu chuyện về phù thủy xấu xa phương Tây.", director: "Jon M. Chu", cast: "Cynthia Erivo", genre: "Fantasy, Musical, Romance", duration: 160, releaseDate: new Date("2026-07-25") },
  { title: "LOTR: War of Rohirrim", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/YlBH4P0q6uM", description: "Rohan phải đối mặt với cuộc tấn công.", director: "Kenji Kamiyama", cast: "Milly Brady", genre: "Animation, Action, Adventure", duration: 130, releaseDate: new Date("2026-12-13") },
  { title: "Kraven the Hunter", poster: "https://images.unsplash.com/photo-1566167258217-7a577c0481b5?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/JGqCUs_5hNg", description: "Câu chuyện nguồn gốc của Kraven.", director: "J.C. Chandor", cast: "Aaron Taylor-Johnson", genre: "Action, Adventure, Thriller", duration: 127, releaseDate: new Date("2026-06-13") },
  { title: "Sonic 3", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/YvKQoLDkGoE", description: "Sonic đối mặt với Shadow.", director: "Jeff Fowler", cast: "James Marsden", genre: "Animation, Action, Comedy", duration: 100, releaseDate: new Date("2026-07-01") },
  { title: "The Conjuring 4", poster: "https://images.unsplash.com/photo-1509248961895-b4c7a79e1ac3?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/9Pqq13hBHqc", description: "Ed và Lorraine Warren đối mặt với thế lực quỷ dữ.", director: "Michael Chaves", cast: "Vera Farmiga", genre: "Horror, Mystery, Thriller", duration: 112, releaseDate: new Date("2026-09-05") },
  { title: "Jurassic World Rebirth", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/_mvjreVCQMQ", description: "Đội tìm kiếm mẫu vật khủng long hiếm có.", director: "Gareth Edwards", cast: "Scarlett Johansson", genre: "Action, Adventure, Sci-Fi", duration: 155, releaseDate: new Date("2026-07-02") },
  { title: "Furiosa", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/XJMuhwVlca4", description: "Câu chuyện về nhân vật Furiosa.", director: "George Miller", cast: "Anya Taylor-Joy", genre: "Action, Adventure, Sci-Fi", duration: 148, releaseDate: new Date("2026-08-15") },
  { title: "Transformers One", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/5aBDPTRxVLA", description: "Câu chuyện về Optimus Prime và Megatron.", director: "Josh Cooley", cast: "Chris Hemsworth", genre: "Animation, Action, Sci-Fi", duration: 104, releaseDate: new Date("2026-09-13") },
  { title: "Beetlejuice 2", poster: "https://images.unsplash.com/photo-1509248961895-b4c7a79e1ac3?w=400&h=600&fit=crop", trailer: "https://www.youtube.com/embed/QTrN-vIlBH4", description: "Beetlejuice trở lại.", director: "Tim Burton", cast: "Michael Keaton", genre: "Comedy, Fantasy, Horror", duration: 104, releaseDate: new Date("2026-09-06") },
];

async function main() {
  console.log("🌱 Starting database seed v3...");

  // Clean existing data
  await prisma.bookingSeat.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({ data: { email: "admin@cinema.com", password: adminPassword, name: "Admin Cinema", phone: "0901234567", role: "ADMIN" } });
  const customerPassword = await bcrypt.hash("user123", 12);
  await prisma.user.create({ data: { email: "user@cinema.com", password: customerPassword, name: "Nguyễn Văn Khách", phone: "0909876543", role: "CUSTOMER" } });
  console.log("✅ Created users");

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({ data: { name: "Phòng 1", rows: 8, seatsPerRow: 12, roomType: "STANDARD" } }),
    prisma.room.create({ data: { name: "Phòng 2", rows: 10, seatsPerRow: 14, roomType: "VIP" } }),
    prisma.room.create({ data: { name: "IMAX 1", rows: 12, seatsPerRow: 16, roomType: "IMAX" } }),
    prisma.room.create({ data: { name: "3D 1", rows: 8, seatsPerRow: 12, roomType: "THREE_D" } }),
  ]);
  console.log("✅ Created rooms");

  // Create movies
  const nowShowing = await Promise.all(nowShowingMovies.map(m => prisma.movie.create({ data: { ...m, status: "NOW_SHOWING" } })));
  const comingSoon = await Promise.all(comingSoonMovies.map(m => prisma.movie.create({ data: { ...m, status: "COMING_SOON", rating: null } })));
  console.log(`✅ Created ${nowShowing.length} NOW_SHOWING + ${comingSoon.length} COMING_SOON movies`);

  // Create showtimes
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const showtimes = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today); date.setDate(date.getDate() + d);
    for (let i = 0; i < Math.min(nowShowing.length, 6); i++) {
      const movie = nowShowing[i];
      const room = rooms[i % rooms.length];
      const start = new Date(date.getTime() + (10 + i * 2) * 60 * 60 * 1000);
      const end = new Date(start.getTime() + (movie.duration || 120) * 60 * 1000);
      showtimes.push(await prisma.showtime.create({ data: { movieId: movie.id, roomId: room.id, startTime: start, endTime: end, price: 75000 + i * 15000 } }));
    }
  }
  console.log("✅ Created showtimes");

  // Create seats
  for (const st of showtimes) {
    const room = rooms.find(r => r.id === st.roomId)!;
    const seats = [];
    for (let row = 0; row < room.rows; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      const isVip = row >= room.rows - 2;
      for (let num = 1; num <= room.seatsPerRow; num++) {
        seats.push({ showtimeId: st.id, row: rowLetter, number: num, type: isVip ? "VIP" : "STANDARD", price: isVip ? st.price * 1.5 : st.price });
      }
    }
    await prisma.seat.createMany({ data: seats });
  }
  console.log("✅ Created seats");

  console.log("\n🎉 Done! Refresh http://localhost:3002");
}

main().catch(console.error).finally(() => prisma.$disconnect());
