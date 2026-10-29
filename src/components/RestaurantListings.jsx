"use client";

// This components handles the race listings page
// It receives data from src/app/page.jsx, such as the initial races and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getRestaurantsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

// component for a single race item in the list
const RestaurantItem = ({ restaurant }) => (
  <li key={restaurant.id}>
    <Link href={`/restaurant/${restaurant.id}`}>
      <ActiveResturant restaurant={restaurant} />
    </Link>
  </li>
);

// wrapper component for the active race
const ActiveResturant = ({ restaurant }) => (
  <div>
    <ImageCover photo={restaurant.photo} name={restaurant.name} />
    <ResturantDetails restaurant={restaurant} />
  </div>
);

// the image component - we updated this to ensure local images load
const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    {/* added a key to force react to re-render the image if the photo url changes */}
    <img 
      key={photo} 
      src={photo} 
      alt={name} 
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

// the details section of the race card
const ResturantDetails = ({ restaurant }) => (
  <div className="restaurant__details">
    <h2>{restaurant.name}</h2>
    <RestaurantRating restaurant={restaurant} />
    <RestaurantMetadata restaurant={restaurant} />
  </div>
);

// displays the star rating
const RestaurantRating = ({ restaurant }) => (
  <div className="restaurant__rating">
    <ul>{renderStars(restaurant.avgRating)}</ul>
    <span>({restaurant.numRatings})</span>
  </div>
);

// displays the category, city, and price
const RestaurantMetadata = ({ restaurant }) => (
  <div className="restaurant__meta">
    <p>
      {restaurant.category} | {restaurant.city}
    </p>
    {/* changed the dollar signs to stars for D&D tier */}
    <p>{"⭐".repeat(restaurant.price)}</p>
  </div>
);

// export the main listings component
export default function RestaurantListings({
  initialRestaurants,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getRestaurantsSnapshot((data) => {
      setRestaurants(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="restaurants">
        {restaurants.map((restaurant) => (
          <RestaurantItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </ul>
    </article>
  );
}

// helper function to push filters to the url
function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}