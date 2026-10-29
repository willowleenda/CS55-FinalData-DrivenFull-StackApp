// import firebase admin to bypass security rules for seeding
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

// load env variables
require("dotenv").config({ path: ".env.local" });

// read the service account key (we will download this next)
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const races = [
  {
    name: "Human",
    category: "Hybrid",
    city: "Waterdeep",
    price: 2,
    reviews: [
      { rating: 5, text: "Versatile and gets a feat at level 1. Can't go wrong." },
      { rating: 3, text: "A bit boring compared to the exotic races, but reliable." },
      { rating: 4, text: "The extra skill proficiency is great for roleplay." },
      { rating: 2, text: "I just don't find them interesting to play." },
      { rating: 5, text: "Always my go-to for a classic hero build." }
    ]
  },
  {
    name: "Elf",
    category: "Caster",
    city: "Feywild",
    price: 4,
    reviews: [
      { rating: 5, text: "Darkvision and trance. Never needing to sleep is a game changer." },
      { rating: 1, text: "Too fragile. One good hit and they're down." },
      { rating: 2, text: "Elves are overrated. Give me a dwarf any day." },
      { rating: 4, text: "The lore and long lifespan make for amazing storytelling." }
    ]
  },
  {
    name: "Dwarf",
    category: "Martial",
    city: "The Underdark",
    price: 3,
    reviews: [
      { rating: 5, text: "Absolute tanks. Poison resistance is incredible." },
      { rating: 4, text: "Great for frontline combat. The extra HP is fantastic." },
      { rating: 5, text: "Dwarven resilience is just too good to pass up." },
      { rating: 2, text: "Slow movement speed hurts in wide-open battle maps." },
      { rating: 4, text: "The darkvision and stonecunning make them great dungeon crawlers." }
    ]
  },
  {
    name: "Tiefling",
    category: "Caster",
    city: "Faerûn",
    price: 4,
    reviews: [
      { rating: 5, text: "Fire resistance and free spells? Yes please." },
      { rating: 5, text: "The roleplay potential of having a demonic ancestor is unmatched." },
      { rating: 1, text: "Everyone in the tavern always hates you. Gets old fast." },
      { rating: 3, text: "The stat bonuses are good, but the lore can be edgy." },
      { rating: 4, text: "Playing a Tiefling Warlock is a classic for a reason." }
    ]
  },
  {
    name: "Halfling",
    category: "Stealth",
    city: "The Sword Coast",
    price: 2,
    reviews: [
      { rating: 5, text: "Lucky trait is literally the best feature in the game." },
      { rating: 4, text: "Perfect for sneaky rogue builds. Can hide behind anyone." },
      { rating: 2, text: "Small size means you can't use heavy weapons." },
      { rating: 4, text: "Brave is a surprisingly useful trait against dragons." },
      { rating: 5, text: "Nothing beats the feeling of rerolling a nat 1." }
    ]
  }
];

async function seedDatabase() {
  console.log("Seeding database...");
  
  for (const race of races) {
    // calculate ratings
    const numRatings = race.reviews.length;
    const sumRating = race.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = sumRating / numRatings;

    // add race document
    const raceRef = await db.collection("restaurants").add({
      name: race.name,
      category: race.category,
      city: race.city,
      price: race.price,
      numRatings,
      sumRating,
      avgRating,
      // look for local images in the public folder
      photo: `/races/${race.name.toLowerCase()}.jpg`, 
      timestamp: Timestamp.now(),
    });

    // add reviews subcollection
    for (const review of race.reviews) {
      await raceRef.collection("ratings").add({
        rating: review.rating,
        text: review.text,
        userId: "Seed User",
        timestamp: Timestamp.now(),
      });
    }
    console.log(`Added ${race.name}`);
  }
  console.log("Done!");
}

seedDatabase();