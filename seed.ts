import dbConnect from "@/utils/db";
import User from "@/models/user";
import Listing from "@/models/listing";
import Booking from "@/models/booking";
import Review from "@/models/review";
import { Document, Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

interface ICity {
  name: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  areas: string[];
}

interface IListingData {
  name: string;
  description: string;
  location: string;
  price: number;
  host: Types.ObjectId;
  images: string[];
  type: "Villa" | "Apartment" | "House" | "Cabin";
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
}

interface IReviewTemplate {
  [key: number]: string[];
}

// Array of high-quality listing images by category
const propertyImages = {
  Villa: [
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  ],
  Apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617098474920-50a26110481f?w=800&auto=format&fit=crop",
  ],
  House: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&auto=format&fit=crop",
  ],
  Cabin: [
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515496281361-241a540151a5?w=800&auto=format&fit=crop",
  ],
};

const cities: ICity[] = [
  {
    name: "Stockholm",
    country: "Sweden",
    coordinates: { latitude: 59.3293, longitude: 18.0686 },
    areas: ["Södermalm", "Östermalm"],
  },
  {
    name: "Paris",
    country: "France",
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    areas: ["Le Marais", "Montmartre"],
  },
  {
    name: "Tokyo",
    country: "Japan",
    coordinates: { latitude: 35.6764, longitude: 139.65 },
    areas: ["Shibuya", "Shinjuku"],
  },
  {
    name: "New York",
    country: "USA",
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    areas: ["Manhattan", "Brooklyn"],
  },
  {
    name: "Barcelona",
    country: "Spain",
    coordinates: { latitude: 41.3851, longitude: 2.1734 },
    areas: ["Gothic Quarter", "Eixample"],
  },
  {
    name: "Copenhagen",
    country: "Denmark",
    coordinates: { latitude: 55.6761, longitude: 12.5683 },
    areas: ["Nørrebro", "Vesterbro"],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    coordinates: { latitude: 52.3676, longitude: 4.9041 },
    areas: ["Jordaan", "De Pijp"],
  },
  {
    name: "Berlin",
    country: "Germany",
    coordinates: { latitude: 52.52, longitude: 13.405 },
    areas: ["Mitte", "Prenzlauer Berg"],
  },
  {
    name: "Rome",
    country: "Italy",
    coordinates: { latitude: 41.9028, longitude: 12.4964 },
    areas: ["Trastevere", "Monti"],
  },
  {
    name: "London",
    country: "UK",
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    areas: ["Notting Hill", "Shoreditch"],
  },
];

const propertyTypes = ["Villa", "Apartment", "House", "Cabin"] as const;
const amenitiesList = [
  ["WiFi", "Air conditioning", "Kitchen", "Washing machine", "TV", "Elevator"],
  ["Pool", "Garden", "BBQ", "Parking", "Gym", "Terrace"],
  ["Ocean View", "Mountain View", "City View", "Balcony", "Hot tub"],
  ["Fireplace", "Heating", "Workspace", "Pet friendly", "Security system"],
];

const reviewTemplates: IReviewTemplate = {
  5: [
    "Absolutely perfect stay! {positive} The {feature1} was amazing and the {feature2} was exceptional.",
    "Couldn't have asked for a better experience! {positive} Loved the {feature1} and {feature2}.",
    "A truly outstanding property. {positive} The {feature1} exceeded expectations and the {feature2} was perfect.",
    "We'll definitely be back! {positive} The {feature1} and {feature2} made our stay memorable.",
    "An amazing experience from start to finish. {positive} Particularly impressed with the {feature1} and {feature2}.",
  ],
  4: [
    "Great stay overall! {positive} The {feature1} was great, though the {feature2} could use minor improvements.",
    "Really enjoyed our time here. {positive} Loved the {feature1}, and the {feature2} was good.",
    "Very good experience. {positive} The {feature1} was excellent, {feature2} was nice.",
    "Would recommend! {positive} Particularly enjoyed the {feature1}, {feature2} was good too.",
    "Nice property with great features. {positive} The {feature1} was a highlight, and {feature2} was good.",
  ],
  3: [
    "Decent stay with some room for improvement. The {feature1} was good, but the {feature2} needs attention.",
    "Average experience overall. The {feature1} met expectations, {feature2} could be better.",
    "OK stay, but probably wouldn't return. The {feature1} was fine, {feature2} was disappointing.",
    "Mixed feelings about this place. Liked the {feature1}, but {feature2} needs work.",
    "Has potential but needs work. {feature1} was adequate, {feature2} needs updating.",
  ],
  2: [
    "Disappointing experience. Issues with both {feature1} and {feature2}.",
    "Below expectations. Problems with {feature1} and {feature2} impacted our stay.",
    "Wouldn't recommend. The {feature1} and {feature2} need significant improvement.",
    "Not what we expected. {feature1} and {feature2} were both problematic.",
    "Several issues during our stay. Both {feature1} and {feature2} need attention.",
  ],
  1: [
    "Very disappointing stay. Major issues with {feature1} and {feature2}.",
    "Would not recommend. {feature1} and {feature2} were both unacceptable.",
    "Terrible experience. Problems with {feature1} and {feature2} ruined our stay.",
    "Avoid this place. {feature1} and {feature2} were both below standard.",
    "Regret booking this property. {feature1} and {feature2} were major problems.",
  ],
};

const positiveComments: string[] = [
  "Everything was spotless and well-maintained.",
  "The host was incredibly responsive and helpful.",
  "The location couldn't have been better.",
  "All amenities were exactly as described.",
  "The check-in process was smooth and easy.",
  "We felt right at home.",
  "The space was beautifully decorated.",
  "Everything we needed was provided.",
  "The views were breathtaking.",
  "Perfect for our needs.",
];

type PropertyType = "Villa" | "Apartment" | "House" | "Cabin";

function generateNearbyCoordinate(
  base: number,
  maxOffset: number = 0.01
): number {
  return base + (Math.random() * maxOffset * 2 - maxOffset);
}

function generatePrice(type: PropertyType, cityName: string): number {
  const basePrice: Record<PropertyType, number> = {
    Villa: 12000,
    House: 8000,
    Apartment: 5000,
    Cabin: 4000,
  };

  const cityMultiplier: Record<string, number> = {
    London: 1.4,
    Paris: 1.3,
    Tokyo: 1.3,
    "New York": 1.5,
    Stockholm: 1.2,
  };

  const randomFactor = 0.8 + Math.random() * 0.4;
  return (
    Math.round(
      (basePrice[type] * (cityMultiplier[cityName] || 1) * randomFactor) / 100
    ) * 100
  );
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateReviewText(rating: number, type: PropertyType): string {
  const template = getRandomElement(reviewTemplates[rating]);
  const feature1 = getRandomElement(amenitiesList.flat());
  let feature2: string;
  do {
    feature2 = getRandomElement(amenitiesList.flat());
  } while (feature2 === feature1);

  return template
    .replace("{feature1}", feature1.toLowerCase())
    .replace("{feature2}", feature2.toLowerCase())
    .replace(
      "{positive}",
      rating >= 4 ? getRandomElement(positiveComments) : ""
    );
}

function generateRating(): number {
  const weights = [5, 5, 5, 5, 4, 4, 4, 3, 2, 1];
  return weights[Math.floor(Math.random() * weights.length)];
}

function generateListings(host: IUser): IListingData[] {
  const listings: IListingData[] = [];

  cities.forEach((city) => {
    city.areas.forEach((area) => {
      const type = propertyTypes[
        Math.floor(Math.random() * propertyTypes.length)
      ] as PropertyType;
      const bedrooms = Math.floor(Math.random() * 3) + 1;
      const bathrooms = Math.ceil(bedrooms * 0.75);
      const maxGuests = bedrooms * 2;

      const numAmenities = Math.floor(Math.random() * 3) + 4;
      const amenities = amenitiesList
        .flat()
        .sort(() => 0.5 - Math.random())
        .slice(0, numAmenities);

      const listing: IListingData = {
        name: `${type} in ${area}`,
        description: `Beautiful ${type.toLowerCase()} in the heart of ${area}, ${
          city.name
        }. Experience the local lifestyle in this carefully curated space.`,
        location: `${area}, ${city.name}, ${city.country}`,
        price: generatePrice(type, city.name),
        host: host._id,
        images: [...propertyImages[type]]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4 + Math.floor(Math.random() * 2)),
        type,
        bedrooms,
        bathrooms,
        maxGuests,
        amenities,
        coordinates: {
          latitude: generateNearbyCoordinate(city.coordinates.latitude),
          longitude: generateNearbyCoordinate(city.coordinates.longitude),
        },
        rating: 0,
      };

      listings.push(listing);
    });
  });

  return listings;
}

async function seedDatabase(): Promise<void> {
  try {
    await dbConnect();

    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    const users = await User.find({});
    const host = users[0];

    if (!host) {
      console.error(
        "No users found in database. Please create some users first."
      );
      process.exit(1);
    }

    if (users.length < 5) {
      console.error(
        "Not enough users found. Please create at least 5 users for proper seeding."
      );
      process.exit(1);
    }

    const listings = generateListings(host);
    console.log(`Generated ${listings.length} listings`);

    for (const listingData of listings) {
      const listing = new Listing(listingData);
      await listing.save();
      console.log(`Created listing: ${listing.name}`);

      // Adjust number of reviews based on available users
      const maxPossibleReviews = users.length - 1; // Excluding host
      const desiredReviews = 15 + Math.floor(Math.random() * 11);
      const numberOfReviews = Math.min(maxPossibleReviews, desiredReviews);

      const availableReviewers = users
        .filter((user) => user._id.toString() !== host._id.toString())
        .sort(() => 0.5 - Math.random()) // Shuffle users
        .slice(0, numberOfReviews); // Take only what we need

      console.log(`Generating ${numberOfReviews} reviews for ${listing.name}`);

      for (const reviewer of availableReviewers) {
        // Generate a review date within the past year
        const reviewDate = new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        );
        const rating = generateRating();

        const review = new Review({
          listing: listing._id,
          user: reviewer._id,
          rating,
          text: generateReviewText(rating, listing.type as PropertyType),
          createdAt: reviewDate,
          updatedAt: reviewDate,
        });

        await review.save();
      }

      // Create future bookings for some listings
      if (Math.random() > 0.5 && users[1]) {
        const booking = new Booking({
          listing: listing._id,
          guest: users[1]._id,
          host: host._id,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });
        await booking.save();
      }

      console.log(`Completed processing for: ${listing.name}`);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Execute the seeding
seedDatabase().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
