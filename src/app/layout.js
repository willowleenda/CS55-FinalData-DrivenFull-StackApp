// import the global stylesheet
import "@/src/app/styles.css";
// import the header component
import Header from "@/src/components/Header.jsx";
// import the function to get the authenticated firebase app
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

// force next.js to treat this route as server-side rendered
// without this line, during the build process, next.js will treat this route as static and build a static html file for it
export const dynamic = "force-dynamic";

// define the metadata for the app (shows in the browser tab)
export const metadata = {
  title: "D&D Race Rankings", // changed title to D&D
  description:
    "A Dungeons & Dragons race review website built with Next.js and Firebase.", // changed description
};

// define the root layout component
export default async function RootLayout({ children }) {
  // get the current user from the server
  const { currentUser } = await getAuthenticatedAppForUser();
  
  // return the html structure
  return (
    <html lang="en">
      <body>
        {/* render the header and pass in the user data */}
        <Header initialUser={currentUser?.toJSON()} />

        {/* render the rest of the page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}