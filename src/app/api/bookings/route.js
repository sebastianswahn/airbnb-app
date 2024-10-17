import dbConnect from "../../../utils/db";
import Booking from "../../../models/booking";
import { authenticate } from "../../../middleware/auth";
import Listing from "../../../models/listing";

export async function GET(req) {
  await dbConnect();

  try {
    const { listingId } = req.query;

    if (!listingId) {
      return new Response(JSON.stringify({ error: "Listing ID is required" }), {
        status: 400,
      });
    }

    const bookings = await Booking.find(
      { listing: listingId },
      "startDate endDate"
    );

    // Returnerar bara start- och slutdatum istället för användarobjekt
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for listing:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch bookings for listing" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    // Autentisera användaren och få deras ID från JWT
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse; // Returnera fel om ej autentiserad

    const userId = req.user.id; // Gästens ID (inloggad användare)
    const body = await req.json();

    // Hämta listningen för att få värdens ID (hostId)
    const listing = await Listing.findById(body.listing);
    if (!listing) {
      return new Response(JSON.stringify({ error: "Listing not found" }), {
        status: 404,
      });
    }

    const hostId = listing.host; // Hämta värdens ID från listningen

    // Lägg till logg för att verifiera att hostId hämtas korrekt
    console.log("Host ID from listing:", hostId);

    // Skapa en ny bokning och inkludera guest och host
    const newBooking = new Booking({
      ...body,
      guest: userId, // Den inloggade användaren är gästen
      host: hostId, // Värden sätts baserat på listningen
    });

    // Lägg till logg för att verifiera bokningsdatan
    console.log("New booking data:", newBooking);

    // Spara bokningen i databasen
    await newBooking.save();

    return new Response(JSON.stringify(newBooking), { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(JSON.stringify({ error: "Unable to create booking" }), {
      status: 500,
    });
  }
}
