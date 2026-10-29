// import utility functions for random numbers and dates
import {
  randomNumberBetween, // get random number in range
  getRandomDateAfter, // get a date after another date
  getRandomDateBefore, // get a date before today
} from "@/src/lib/utils.js";

// import the mock data arrays
import { randomData } from "@/src/lib/randomData.js";

// import firestore timestamp to store dates
import { Timestamp } from "firebase/firestore";

// export async function that generates the fake data
export async function generateFakeRestaurantsAndReviews() {
  // set how many races to generate
  const racesToAdd = 9; 
  // create an empty array to hold the results
  const data = [];

  // loop through the number of races
  for (let i = 0; i < racesToAdd; i++) {
    // get a random date for the race document
    const raceTimestamp = Timestamp.fromDate(getRandomDateBefore());

    // create an empty array to hold reviews
    const ratingsData = [];

    // Generate a random number of ratings/reviews for this race
    for (let j = 0; j < randomNumberBetween(2, 6); j++) {
      // get a random date for the review that is after the race date
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(raceTimestamp.toDate())
      );

      // build the review object
      const ratingData = {
        // get a random rating from the reviews array
        rating:
          randomData.raceReviews[
            randomNumberBetween(0, randomData.raceReviews.length - 1)
          ].rating,
        // get a random text from the reviews array
        text: randomData.raceReviews[
          randomNumberBetween(0, randomData.raceReviews.length - 1)
        ].text,
        // generate a fake user id
        userId: `User #${randomNumberBetween()}`,
        // add the timestamp
        timestamp: ratingTimestamp,
      };

      // push the review to the array
      ratingsData.push(ratingData);
    }

    // calculate the average rating
    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    // build the main race document
    const raceData = {
      // pick a random class category
      category: 
        randomData.raceCategories[
          randomNumberBetween(0, randomData.raceCategories.length - 1)
        ],
      // grab the specific race name by index
      name: randomData.raceNames[i], 
      // add the calculated average
      avgRating,
      // pick a random homeland
      city: 
        randomData.raceHomelands[
          randomNumberBetween(0, randomData.raceHomelands.length - 1)
        ],
      // add the number of reviews
      numRatings: ratingsData.length,
      // add the sum of all ratings
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      // pick a random tier (1-4)
      price: randomNumberBetween(1, 4), 
      // use a random placeholder image
      photo: `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${randomNumberBetween(
        1,
        22
      )}.png`, 
      // add the main timestamp
      timestamp: raceTimestamp,
    };

    // push the combined data to the main array
    data.push({
      restaurantData: raceData, // keep this key named restaurantData so firestore.js doesn't break
      ratingsData,
    });
  }
  // return the full array of generated data
  return data;
}