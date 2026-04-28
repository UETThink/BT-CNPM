// Cinema Ticket System - Database Seed Script
// Run with: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

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
  const admin = await prisma.user.create({
    data: {
      email: "admin@cinema.com",
      password: adminPassword,
      name: "Admin Cinema",
      phone: "0901234567",
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create Customer User
  const customerPassword = await bcrypt.hash("user123", 12);
  const customer = await prisma.user.create({
    data: {
      email: "user@cinema.com",
      password: customerPassword,
      name: "Nguyễn Văn Khách",
      phone: "0909876543",
      role: "CUSTOMER",
    },
  });
  console.log("✅ Created customer user:", customer.email);

  // Create Rooms
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

  // Create Movies (20+ movies with various genres)
  const movies = await Promise.all([
    // NOW_SHOWING Movies
    prisma.movie.create({
      data: {
        title: "Avatar: The Way of Water",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        description: "Jake Sully và Neytiri tạo nên gia đình và thực hiện hành trình giữa hai thế giới để bảo vệ nhau.",
        director: "James Cameron",
        cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
        genre: "Sci-Fi, Action, Adventure",
        duration: 192,
        rating: 8.5,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-04-28"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Oppenheimer",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        description: "Câu chuyện về nhà khoa học J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.",
        director: "Christopher Nolan",
        cast: "Cillian Murphy, Emily Blunt, Matt Damon",
        genre: "Drama, History, Biography",
        duration: 180,
        rating: 9.0,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-04-20"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Dune: Part Two",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
        description: "Paul Atreides hợp nhất với Chani và người Fremen khi anh theo đuổi con đường trả thù chống lại những kẻ đã phá hủy gia đình mình.",
        director: "Denis Villeneuve",
        cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
        genre: "Sci-Fi, Adventure, Drama",
        duration: 166,
        rating: 8.8,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-04-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Kung Fu Panda 4",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=g10c7a5wT9U",
        description: "Po phải từ bỏ vai trò Đại sư Dragon Warrior để trở thành Thủ lĩnh Tâm Linh và tìm một con rồng mới.",
        director: "Mike Mitchell",
        cast: "Jack Black, Awkwafina, Viola Davis",
        genre: "Animation, Action, Comedy",
        duration: 94,
        rating: 7.0,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-04-10"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Godzilla x Kong: The New Empire",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=lV1OOlGwExM",
        description: "Hai Titan huyền thoại hợp nhất để chống lại một mối đe dọa khổng lồ ẩn náu trong Trái Đất.",
        director: "Adam Wingard",
        cast: "Rebecca Hall, Brian Tyree Henry, Dan Stevens",
        genre: "Action, Sci-Fi, Adventure",
        duration: 115,
        rating: 7.5,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-04-05"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Wonka",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=otNh9bTjXWg",
        description: "Câu chuyện về những năm đầu tiên của Willy Wonka và hành trình trở thành nhà phát minh chocolate nổi tiếng.",
        director: "Paul King",
        cast: "Timothée Chalamet, Calah Lane, Keegan-Michael Key",
        genre: "Comedy, Family, Fantasy",
        duration: 116,
        rating: 7.2,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-03-28"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "The Flash",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=heI3K4HofzA",
        description: "Barry Allen sử dụng sức mạnh tốc độ siêu nhiên để thay đổi vận mệnh và cứu lấy thế giới.",
        director: " Andrés Muschietti",
        cast: "Ezra Miller, Michael Keaton, Ben Affleck",
        genre: "Action, Sci-Fi, Fantasy",
        duration: 144,
        rating: 7.1,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-03-20"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Spider-Man: Across the Spider-Verse",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=shW9i6k8cB0",
        description: "Miles Morales phiêu lưu qua multiverse cùng Spider-Man群体 và đối mặt với một mối đe dọa mới.",
        director: "Joaquim Dos Santos",
        cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac",
        genre: "Animation, Action, Adventure",
        duration: 140,
        rating: 8.9,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-03-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "John Wick 4",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
        description: "John Wick tiếp tục cuộc chiến chống lại High Table trong phần tiếp theo đầy hành động.",
        director: "Chad Stahelski",
        cast: "Keanu Reeves, Donnie Yen, Bill Skarsgård",
        genre: "Action, Thriller, Crime",
        duration: 169,
        rating: 8.2,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-03-10"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Guardians of the Galaxy Vol. 3",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=u3V5KDHRQvk",
        description: "Nhóm Guardians of the Galaxy bảo vệ vũ trụ và giải cứu Rocket khỏi kẻ thù.",
        director: "James Gunn",
        cast: "Chris Pratt, Zoe Saldana, Dave Bautista",
        genre: "Action, Adventure, Comedy",
        duration: 150,
        rating: 8.4,
        language: "English",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-03-05"),
      },
    }),
    // COMING SOON Movies
    prisma.movie.create({
      data: {
        title: "Deadpool & Wolverine",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=73_1biulkYk",
        description: "Deadpool hợp nhất với Wolverine trong một cuộc phiêu lưu điên rồ qua multiverse.",
        director: "Shawn Levy",
        cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin",
        genre: "Action, Comedy, Sci-Fi",
        duration: 127,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-05-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Mufasa: The Lion King",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=CDM8i_ak fingerprint",
        description: "Câu chuyện về nguồn gốc của Mufasa, vị vua huyền thoại của Pride Lands.",
        director: "Barry Jenkins",
        cast: "Aaron Pierre, Kelvin Harrison Jr., Tiffany Boone",
        genre: "Animation, Drama, Family",
        duration: 118,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-05-20"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Mission: Impossible 8",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=avz06PDqDbM",
        description: "Ethan Hunt và đội IMF tiếp tục những nhiệm vụ nguy hiểm không thể tin được.",
        director: "Christopher McQuarrie",
        cast: "Tom Cruise, Hayley Atwell, Simon Pegg",
        genre: "Action, Thriller, Adventure",
        duration: 163,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-06-01"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Inside Out 3",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=LEjhY15eCx0",
        description: "Riley trưởng thành và đối mặt với những cảm xúc hoàn toàn mới.",
        director: "Kelsey Mann",
        cast: "Amy Poehler, Maya Hawke, Kensington Tallman",
        genre: "Animation, Family, Comedy",
        duration: 96,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-06-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "The Marvels 2",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=wl1B0o9XJnk",
        description: "Carol Danvers, Kamala Khan và Monica Rambeau một lần nữa hợp nhất sức mạnh để cứu vũ trụ.",
        director: "Nia DaCosta",
        cast: "Brie Larson, Teyonah Parris, Iman Vellani",
        genre: "Action, Adventure, Sci-Fi",
        duration: 110,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-07-01"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Transformers One",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=irXBBBHg1cI",
        description: "Câu chuyện về nguồn gốc của Optimus Prime và Megatron trước khi trở thành huyền thoại.",
        director: "Josh Cooley",
        cast: "Chris Hemsworth, Brian Tyree Henry, Scarlett Johansson",
        genre: "Animation, Action, Sci-Fi",
        duration: 104,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-07-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Venom 3",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=aKuZ4XFC8r4",
        description: "Eddie Brock tiếp tục cuộc sống chung với Venom và đối mặt với kẻ thù mới.",
        director: "Kelly Marcel",
        cast: "Tom Hardy, Chiwetel Ejiofor, Juno Temple",
        genre: "Action, Sci-Fi, Horror",
        duration: 130,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-08-01"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Thunderbolts",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=VP2Nm5M_2zE",
        description: "Một nhóm anti-hero được tuyển dụng bởi chính phủ cho nhiệm vụ nguy hiểm.",
        director: "Jake Schreier",
        cast: "Florence Pugh, Sebastian Stan, David Harbour",
        genre: "Action, Adventure, Sci-Fi",
        duration: 126,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-08-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Captain America: Brave New World",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=jSjSKVmTc5I",
        description: "Sam Wilson trở thành Captain America và đối mặt với âm mưu toàn cầu.",
        director: "Julius Onah",
        cast: "Anthony Mackie, Harrison Ford, Liv Tyler",
        genre: "Action, Adventure, Sci-Fi",
        duration: 118,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-09-01"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "The Batman Part II",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
        description: "Bruce Wayne tiếp tục cuộc chiến chống tội phạm tại Gotham City.",
        director: "Matt Reeves",
        cast: "Robert Pattinson, Zoë Kravitz, Paul Dano",
        genre: "Action, Crime, Drama",
        duration: 185,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-10-01"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Aquaman and the Lost Kingdom",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=F5z2c4pbnCo",
        description: "Arthur Curry phải bảo vệ Atlantis và thế giới dưới nước khỏi kẻ thù.",
        director: "James Wan",
        cast: "Jason Momoa, Patrick Wilson, Amber Heard",
        genre: "Action, Adventure, Fantasy",
        duration: 123,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-10-15"),
      },
    }),
    prisma.movie.create({
      data: {
        title: "Teenage Mutant Ninja Turtles: Mutant Mayhem 2",
        poster: null,
        trailer: "https://www.youtube.com/watch?v=ZyVJDIoEF48",
        description: "Các ninja rùa tiếp tục cuộc phiêu lưu chống lại lũ mutant mới.",
        director: "Jeff Rowe",
        cast: "Micah Abbey, Shamon Brown Jr., Nicolas Demorand",
        genre: "Animation, Action, Comedy",
        duration: 100,
        rating: null,
        language: "English",
        status: "COMING_SOON",
        releaseDate: new Date("2026-11-01"),
      },
    }),
  ]);
  console.log("✅ Created", movies.length, "movies");

  // Create Showtimes (for next 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showtimeData: { movieId: string; roomId: string; startTime: Date; price: number }[] = [];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    // Morning shows (10:00, 11:30)
    showtimeData.push({
      movieId: movies[dayOffset % movies.length].id,
      roomId: rooms[0].id,
      startTime: new Date(date.getTime() + 10 * 60 * 60 * 1000),
      price: 75000,
    });

    showtimeData.push({
      movieId: movies[(dayOffset + 1) % movies.length].id,
      roomId: rooms[1].id,
      startTime: new Date(date.getTime() + 10 * 60 * 60 * 1000),
      price: 120000,
    });

    // Afternoon shows (14:00, 15:30, 17:00)
    showtimeData.push({
      movieId: movies[(dayOffset + 2) % movies.length].id,
      roomId: rooms[0].id,
      startTime: new Date(date.getTime() + 14 * 60 * 60 * 1000),
      price: 75000,
    });

    showtimeData.push({
      movieId: movies[(dayOffset + 3) % movies.length].id,
      roomId: rooms[2].id,
      startTime: new Date(date.getTime() + 14 * 60 * 60 * 1000),
      price: 150000,
    });

    // Evening shows (19:00, 20:30, 22:00)
    showtimeData.push({
      movieId: movies[(dayOffset + 4) % movies.length].id,
      roomId: rooms[0].id,
      startTime: new Date(date.getTime() + 19 * 60 * 60 * 1000),
      price: 75000,
    });

    showtimeData.push({
      movieId: movies[(dayOffset + 5) % movies.length].id,
      roomId: rooms[1].id,
      startTime: new Date(date.getTime() + 19 * 60 * 60 * 1000),
      price: 120000,
    });

    showtimeData.push({
      movieId: movies[dayOffset % movies.length].id,
      roomId: rooms[3].id,
      startTime: new Date(date.getTime() + 21 * 60 * 60 * 1000),
      price: 90000,
    });
  }

  const showtimes = await Promise.all(
    showtimeData.map(async (data) => {
      const movie = movies.find((m) => m.id === data.movieId)!;
      const endTime = new Date(data.startTime.getTime() + movie.duration * 60 * 1000);

      return prisma.showtime.create({
        data: {
          ...data,
          endTime,
        },
      });
    })
  );

  console.log("✅ Created", showtimes.length, "showtimes");

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

  console.log("✅ Created seats for all showtimes");

  console.log("🎉 Database seeding completed!");
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
