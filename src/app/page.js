// import the race listings component (displays the list of races on the page)
import RestaurantListings from "@/src/components/RestaurantListings.jsx";

// import the function that retrieves race data from firestore database
import { getRestaurants } from "@/src/lib/firebase/firestore.js";

// import the function that gets the firebase app configured for authenticated user
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

// import the getFirestore function (provides access to firestore database)
import { getFirestore } from "firebase/firestore";

// force next.js to treat this route as server-side rendered
export const dynamic = "force-dynamic";

// define the home page component as asynchronous function, allowing it to wait for data to load
export default async function Home(props) {
  // get the search parameters from the page's props (may contain filters or sorting options from url)
  const searchParams = await props.searchParams;

  // get the firebase app configured for authenticated user and wait for the result
  const { firebaseServerApp } = await getAuthenticatedAppForUser();

  // retrieve race data by passing firestore database connection and search parameters to the getrestaurants function
  const races = await getRestaurants(
    // get firestore database instance from authenticated firebase app and pass it as the first argument
    getFirestore(firebaseServerApp),
    // pass the search parameters as the second argument so the race results can be filtered or sorted
    searchParams
  ); // finish the race retrieval call and store the results in the races variable

  // return the page's user interface so next.js can render it
  return (
    // creates the main html element that wraps the main content of the home page and applies its css class
    <main className="main__home">
      {/* displays the race listings component and passes the race data and search parameters into it */}
      <RestaurantListings
        // passes the retrieved race data to the component as its initial list of races
        initialRestaurants={races}
        // passes the current search parameters to the component so it can use the active filters or sorting options
        searchParams={searchParams}
      /> {/* closes the race listings component */}
    </main>
  ); // finishes returning the page's user interface
}