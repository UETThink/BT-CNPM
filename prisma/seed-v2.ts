// Cinema Ticket System - Database Seed Script v2
// Run with: npx tsx prisma/seed-v2.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed v2...");

  // Clean existing data
  await prisma.bookingSeat.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleaned existing data");

  // Create Admin User
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

  // Create Customer User
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
  console.log("✅ Created users");

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.create({ data: { name: "Phòng 1", rows: 8, seatsPerRow: 12, roomType: "STANDARD" } }),
    prisma.room.create({ data: { name: "Phòng 2", rows: 10, seatsPerRow: 14, roomType: "VIP" } }),
    prisma.room.create({ data: { name: "IMAX 1", rows: 12, seatsPerRow: 16, roomType: "IMAX" } }),
    prisma.room.create({ data: { name: "3D 1", rows: 8, seatsPerRow: 12, roomType: "THREE_D" } }),
  ]);
  console.log("✅ Created", rooms.length, "rooms");

  // NOW SHOWING MOVIES (10 phim)
  const nowShowingMovies = [
    {
      title: "Avatar: The Way of Water",
      poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
      description: "Jake Sully và Neytiri tạo nên gia đình và thực hiện hành trình giữa hai thế giới để bảo vệ nhau.",
      director: "James Cameron",
      cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
      genre: "Sci-Fi, Action, Adventure",
      duration: 192,
      rating: 8.5,
      language: "English",
      releaseDate: new Date("2026-04-28"),
    },
    {
      title: "Dune: Part Two",
      poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      trailer: "https://www.youtube.com/embed/Was6 ng8P6e0",
      description: "Paul Atreides hợp nhất với Chani và người Fremen khi anh theo đuổi con đường trả thù.",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
      genre: "Sci-Fi, Adventure, Drama",
      duration: 166,
      rating: 8.8,
      language: "English",
      releaseDate: new Date("2026-04-15"),
    },
    {
      title: "Oppenheimer",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
      description: "Câu chuyện về nhà khoa học J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.",
      director: "Christopher Nolan",
      cast: "Cillian Murphy, Emily Blunt, Matt Damon",
      genre: "Drama, History, Biography",
      duration: 180,
      rating: 9.0,
      language: "English",
      releaseDate: new Date("2026-04-20"),
    },
    {
      title: "Kung Fu Panda 4",
      poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
      trailer: "https://www.youtube.com/embed/_inKs4eeHiI",
      description: "Po phải từ bỏ vai trò Đại sư Dragon Warrior để trở thành Thủ lĩnh Tâm Linh.",
      director: "Mike Mitchell",
      cast: "Jack Black, Awkwafina, Viola Davis",
      genre: "Animation, Action, Comedy",
      duration: 94,
      rating: 7.0,
      language: "English",
      releaseDate: new Date("2026-04-10"),
    },
    {
      title: "Godzilla x Kong: The New Empire",
      poster: "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
      trailer: "https://www.youtube.com/embed/lV1OOlGwExM",
      description: "Hai Titan huyền thoại hợp nhất để chống lại một mối đe dọa khổng lồ ẩn náu trong Trái Đất.",
      director: "Adam Wingard",
      cast: "Rebecca Hall, Brian Tyree Henry, Dan Stevens",
      genre: "Action, Sci-Fi, Adventure",
      duration: 115,
      rating: 7.5,
      language: "English",
      releaseDate: new Date("2026-04-05"),
    },
    {
      title: "Wonka",
      poster: "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
      trailer: "https://www.youtube.com/embed/otNh9bTjXWg",
      description: "Câu chuyện về những năm đầu tiên của Willy Wonka và hành trình trở thành nhà phát minh chocolate.",
      director: "Paul King",
      cast: "Timothée Chalamet, Calah Lane, Keegan-Michael Key",
      genre: "Comedy, Family, Fantasy",
      duration: 116,
      rating: 7.2,
      language: "English",
      releaseDate: new Date("2026-03-28"),
    },
    {
      title: "Inside Out 2",
      poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
      trailer: "https://www.youtube.com/embed/LEjhY15eCx0",
      description: "Riley teenage years với những cảm xúc mới và thử thách mới.",
      director: "Kelsey Mann",
      cast: "Amy Poehler, Phyllis Smith, Maya Hawke",
      genre: "Animation, Comedy, Family",
      duration: 96,
      rating: 8.2,
      language: "English",
      releaseDate: new Date("2026-04-12"),
    },
    {
      title: "The Fall Guy",
      poster: "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
      trailer: "https://www.youtube.com/embed/aVs6P_8azDI",
      description: "Một stuntman phải đi tìm kẻ giết người khi bị quy kết oan.",
      director: "David Leitch",
      cast: "Ryan Gosling, Emily Blunt, Aaron Taylor-Johnson",
      genre: "Action, Comedy, Thriller",
      duration: 126,
      rating: 7.4,
      language: "English",
      releaseDate: new Date("2026-04-18"),
    },
    {
      title: "Kingdom of the Planet of the Apes",
      poster: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
      trailer: "https://www.youtube.com/embed/XtFI7SNtVpY",
      description: "Nhiều thế hệ sau chiến tranh giữa người và khỉ, một chúa tể khỉ trẻ bắt đầu cuộc hành trình.",
      director: "Wes Ball",
      cast: "Owen Teague, Freya Allan, Kevin Durand",
      genre: "Sci-Fi, Action, Adventure",
      duration: 145,
      rating: 7.8,
      language: "English",
      releaseDate: new Date("2026-04-22"),
    },
    {
      title: "Challengers",
      poster: "https://image.tmdb.org/t/p/w500/NTJvXdcA2f2ADj05jLZF6TT5dxR.jpg",
      trailer: "https://www.youtube.com/embed/VIBm31aHkFE",
      description: "Một cựu thiên tài quần vợt biến đồng đội cũ thành đối thủ để giành lại vị trí.",
      director: "Luca Guadagnino",
      cast: "Zendaya, Josh O'Connor, Mike Faist",
      genre: "Drama, Romance, Sport",
      duration: 131,
      rating: 7.6,
      language: "English",
      releaseDate: new Date("2026-04-25"),
    },
  ];

  // COMING SOON MOVIES (20 phim)
  const comingSoonMovies = [
    {
      title: "Deadpool & Wolverine",
      poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      trailer: "https://www.youtube.com/embed/73_1biulkYk",
      description: "Deadpool sử dụng Wolverine để cứu vãn thực tại của mình.",
      director: "Shawn Levy",
      cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin",
      genre: "Action, Comedy, Sci-Fi",
      duration: 127,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-07-26"),
    },
    {
      title: "Venom 3",
      poster: "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      trailer: "https://www.youtube.com/embed/aN2Tf7fP3hA",
      description: "Eddie và Venom đối mặt với kẻ thù mới.",
      director: "Kelly Marcel",
      cast: "Tom Hardy, Chiwetel Ejiofor, Juno Temple",
      genre: "Action, Sci-Fi, Thriller",
      duration: 110,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-06-12"),
    },
    {
      title: "Despicable Me 4",
      poster: "https://image.tmdb.org/t/p/w500/3w84hCFJATpiCNt68HCNQ5JGmqpL.jpg",
      trailer: "https://www.youtube.com/embed/qQlr9-rF32A",
      description: "Gru và gia đình phải đối mặt với kẻ thù mới.",
      director: "Chris Renaud",
      cast: "Steve Carell, Kristen Wiig, Joey King",
      genre: "Animation, Comedy, Family",
      duration: 94,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-07-03"),
    },
    {
      title: "Mufasa: The Lion King",
      poster: "https://image.tmdb.org/t/p/w500/tCheXCm1s3aG4cT4K3qJ9vKjO.jpg",
      trailer: "https://www.youtube.com/embed/9LtQDBqDlAo",
      description: "Câu chuyện về nguồn gốc của Mufasa.",
      director: "Barry Jenkins",
      cast: "Aaron Pierre, Kelvin Harrison Jr., Beyoncé",
      genre: "Animation, Drama, Family",
      duration: 120,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-05-30"),
    },
    {
      title: "Thunderbolts",
      poster: "https://image.tmdb.org/t/p/w500/lqe51jlHLZyMNFdzAWN8YAvxu1t.jpg",
      trailer: "https://www.youtube.com/embed/VPxN8tT4U0M",
      description: "Một nhóm anti-hero được tập hợp cho nhiệm vụ bí mật.",
      director: "Jake Schreier",
      cast: "Florence Pugh, Sebastian Stan, Harrison Ford",
      genre: "Action, Adventure, Sci-Fi",
      duration: 126,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-06-27"),
    },
    {
      title: "Mission: Impossible 8",
      poster: "https://image.tmdb.org/t/p/w500/628Rpy5NlCIxa3Wm1VF7v9T0y.jpg",
      trailer: "https://www.youtube.com/embed/lOM9cQ6NnXg",
      description: "Ethan Hunt và IMF tiếp tục những nhiệm vụ nguy hiểm.",
      director: "Christopher McQuarrie",
      cast: "Tom Cruise, Hayley Atwell, Ving Rhames",
      genre: "Action, Adventure, Thriller",
      duration: 163,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-05-23"),
    },
    {
      title: "Captain America: Brave New World",
      poster: "https://image.tmdb.org/t/p/w500/pzIddUEMWhWPZXYYmXbPKLgB8iH.jpg",
      trailer: "https://www.youtube.com/embed/4LXVDsVul1E",
      description: "Sam Wilson trở thành Captain America và đối mặt với âm mưu mới.",
      director: "Julius Onah",
      cast: "Anthony Mackie, Harrison Ford, Liv Tyler",
      genre: "Action, Adventure, Sci-Fi",
      duration: 118,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-02-14"),
    },
    {
      title: "Aquaman and the Lost Kingdom",
      poster: "https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TQ0b3H8yEX.jpg",
      trailer: "https://www.youtube.com/embed/F6iVvL-FqFc",
      description: "Arthur Curry phải bảo vệ Atlantis và thế giới.",
      director: "James Wan",
      cast: "Jason Momoa, Amber Heard, Patrick Wilson",
      genre: "Action, Adventure, Fantasy",
      duration: 123,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-06-05"),
    },
    {
      title: "The Batman Part II",
      poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez9j7W3z0HtxqO.jpg",
      trailer: "https://www.youtube.com/embed/mqqft2x_Aac",
      description: "Batman tiếp tục cuộc chiến chống tội phạm ở Gotham.",
      director: "Matt Reeves",
      cast: "Robert Pattinson, Zoë Kravitz, Paul Dano",
      genre: "Action, Crime, Drama",
      duration: 185,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-10-03"),
    },
    {
      title: "Gladiator 2",
      poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      trailer: "https://www.youtube.com/embed/4rgYUipGJNo",
      description: "Câu chuyện tiếp theo trong đấu trường La Mã.",
      director: "Ridley Scott",
      cast: "Paul Mescal, Denzel Washington, Pedro Pascal",
      genre: "Action, Drama, History",
      duration: 148,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-11-15"),
    },
    {
      title: "Moana 2",
      poster: "https://image.tmdb.org/t/p/w500/4LNSa6rLvLBksX1L3OT0lR6Qqi.jpg",
      trailer: "https://www.youtube.com/embed/u3Dq4CjA-Ms",
      description: "Moana trở lại với cuộc phiêu lưu mới trên biển.",
      director: "David Derrick Jr.",
      cast: "Auli'i Cravalho, Dwayne Johnson",
      genre: "Animation, Adventure, Family",
      duration: 100,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-11-27"),
    },
    {
      title: "Wicked",
      poster: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
      trailer: "https://www.youtube.com/embed/qiD8Rj6ZLhc",
      description: "Câu chuyện về phù thủy xấu xa phương Tây.",
      director: "Jon M. Chu",
      cast: "Cynthia Erivo, Ariana Grande, Jonathan Bailey",
      genre: "Fantasy, Musical, Romance",
      duration: 160,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-07-25"),
    },
    {
      title: "The Lord of the Rings: The War of the Rohirrim",
      poster: "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3QqdYQD0.jpg",
      trailer: "https://www.youtube.com/embed/YlBH4P0q6uM",
      description: "Một thế hệ trước Hobbit, Rohan phải đối mặt với cuộc tấn công của Saruman.",
      director: "Kenji Kamiyama",
      cast: "Milly Brady, Brian Cox",
      genre: "Animation, Action, Adventure",
      duration: 130,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-12-13"),
    },
    {
      title: "Kraven the Hunter",
      poster: "https://image.tmdb.org/t/p/w500/ungN3N8j6t7fLBfFMf7SbuvLLwZ.jpg",
      trailer: "https://www.youtube.com/embed/JGqCUs_5hNg",
      description: "Câu chuyện nguồn gốc của Kraven, thợ săn huyền thoại.",
      director: "J.C. Chandor",
      cast: "Aaron Taylor-Johnson, Russell Crowe, Alessandro Nivola",
      genre: "Action, Adventure, Thriller",
      duration: 127,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-06-13"),
    },
    {
      title: "Sonic 3",
      poster: "https://image.tmdb.org/t/p/w500/ajzt9HqCJd2Z5KTCSEiNYEdOAK.jpg",
      trailer: "https://www.youtube.com/embed/YvKQoLDkGoE",
      description: "Sonic đối mặt với Shadow trong cuộc chiến mới.",
      director: "Jeff Fowler",
      cast: "James Marsden, Jim Carrey, Keanu Reeves",
      genre: "Animation, Action, Comedy",
      duration: 100,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-07-01"),
    },
    {
      title: "The Conjuring 4",
      poster: "https://image.tmdb.org/t/p/w500/e1mjopzAS2KNsvpbpahQ1a6SkSn.jpg",
      trailer: "https://www.youtube.com/embed/9Pqq13hBHqc",
      description: "Ed và Lorraine Warren đối mặt với thế lực quỷ dữ mới.",
      director: "Michael Chaves",
      cast: "Vera Farmiga, Patrick Wilson",
      genre: "Horror, Mystery, Thriller",
      duration: 112,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-09-05"),
    },
    {
      title: "Jurassic World Rebirth",
      poster: "https://image.tmdb.org/t/p/w500/bEqXcR1TH7RXdGdGg8jYDWzrF6G.jpg",
      trailer: "https://www.youtube.com/embed/_mvjreVCQMQ",
      description: "Đội tìm kiếm mẫu vật khủng long hiếm có.",
      director: "Gareth Edwards",
      cast: " Scarlett Johansson, Jonathan Bailey, Mahershala Ali",
      genre: "Action, Adventure, Sci-Fi",
      duration: 155,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-07-02"),
    },
    {
      title: "Furiosa: A Mad Max Saga",
      poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
      trailer: "https://www.youtube.com/embed/XJMuhwVlca4",
      description: "Câu chuyện về nhân vật Furiosa trong vùng đất hoang dã.",
      director: "George Miller",
      cast: "Anya Taylor-Joy, Chris Hemsworth",
      genre: "Action, Adventure, Sci-Fi",
      duration: 148,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-08-15"),
    },
    {
      title: "Transformers One",
      poster: "https://image.tmdb.org/t/p/w500/qsvMDLiPkRoCUxknfNz9O3TBQH8.jpg",
      trailer: "https://www.youtube.com/embed/5aBDPTRxVLA",
      description: "Câu chuyện về Optimus Prime và Megatron khi còn là anh em.",
      director: "Josh Cooley",
      cast: "Chris Hemsworth, Brian Tyree Henry",
      genre: "Animation, Action, Sci-Fi",
      duration: 104,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-09-13"),
    },
    {
      title: "Beetlejuice 2",
      poster: "https://image.tmdb.org/t/p/w500/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg",
      trailer: "https://www.youtube.com/embed/QTrN-vIlBH4",
      description: "Beetlejuice trở lại sau nhiều năm im lặng.",
      director: "Tim Burton",
      cast: "Michael Keaton, Winona Ryder, Jenna Ortega",
      genre: "Comedy, Fantasy, Horror",
      duration: 104,
      rating: null,
      language: "English",
      releaseDate: new Date("2026-09-06"),
    },
  ];

  // Create movies
  const nowShowing = await Promise.all(
    nowShowingMovies.map((movie) =>
      prisma.movie.create({
        data: { ...movie, status: "NOW_SHOWING" },
      })
    )
  );

  const comingSoon = await Promise.all(
    comingSoonMovies.map((movie) =>
      prisma.movie.create({
        data: { ...movie, status: "COMING_SOON" },
      })
    )
  );

  console.log(`✅ Created ${nowShowing.length} NOW_SHOWING movies`);
  console.log(`✅ Created ${comingSoon.length} COMING_SOON movies`);

  // Create Showtimes (for next 7 days) - only for NOW_SHOWING
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showtimeData: { movieId: string; roomId: string; startTime: Date; price: number }[] = [];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    for (let i = 0; i < Math.min(nowShowing.length, 6); i++) {
      showtimeData.push({
        movieId: nowShowing[i % nowShowing.length].id,
        roomId: rooms[i % rooms.length].id,
        startTime: new Date(date.getTime() + (10 + i * 2) * 60 * 60 * 1000),
        price: 75000 + i * 15000,
      });
    }
  }

  const showtimes = await Promise.all(
    showtimeData.map(async (data) => {
      const movie = nowShowing.find((m) => m.id === data.movieId)!;
      const endTime = new Date(data.startTime.getTime() + (movie.duration || 120) * 60 * 1000);
      return prisma.showtime.create({ data: { ...data, endTime } });
    })
  );

  // Create seats for each showtime
  for (const showtime of showtimes) {
    const room = rooms.find((r) => r.id === showtime.roomId)!;
    const basePrice = showtime.price;
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

  console.log("✅ Created", showtimes.length, "showtimes with seats");
  console.log("\n🎉 Database seeding completed!");
  console.log("\n📋 Login credentials:");
  console.log("   Admin: admin@cinema.com / admin123");
  console.log("   User: user@cinema.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
