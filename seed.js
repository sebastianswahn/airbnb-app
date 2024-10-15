import dbConnect from "./src/utils/db.js";
import User from "./src/models/user.js";
import Listing from "./src/models/listing.js";
import Booking from "./src/models/booking.js";
import Review from "./src/models/review.js";

async function seedDatabase() {
  await dbConnect();

  // Radera alla gamla data (valfritt)
  await User.deleteMany({});
  await Listing.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});

  // Skapa några användare
  const user1 = new User({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "host",
  });
  const user2 = new User({
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "guest",
  });

  await user1.save();
  await user2.save();

  // Skapa några fastigheter
  const listing1 = new Listing({
    name: "Nice apartment",
    description: "A cozy apartment in the city center",
    location: "Stockholm",
    price: 1000,
    host: user1._id,
  });
  const listing2 = new Listing({
    name: "Countryside house",
    description: "A relaxing house in the countryside",
    location: "Uppsala",
    price: 2000,
    host: user1._id,
  });

  await listing1.save();
  await listing2.save();

  // Skapa en bokning
  const booking1 = new Booking({
    listing: listing1._id,
    guest: user2._id,
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-10"),
  });
  await booking1.save();

  // Skapa några recensioner
  const review1 = new Review({
    listing: listing1._id,
    user: user2._id, // Jane Smith skriver en recension om John's lägenhet
    rating: 5,
    text: "Amazing place! Really enjoyed my stay, super cozy and clean.",
  });

  const review2 = new Review({
    listing: listing2._id,
    user: user2._id, // Jane Smith skriver en recension om John's hus
    rating: 4,
    text: "Great countryside house, very relaxing. Could use a bit more amenities.",
  });

  await review1.save();
  await review2.save();

  console.log("Database seeded with users, listings, bookings, and reviews!");
  process.exit(0);
}

seedDatabase();
