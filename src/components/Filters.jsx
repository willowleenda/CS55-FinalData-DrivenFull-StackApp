// The filters shown on the race listings page

// import the tag component for displaying active filters
import Tag from "@/src/components/Tag.jsx";

// define the filter select dropdown component
function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

// export the main filters component
export default function Filters({ filters, setFilters }) {
  // handle changes to the dropdowns
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  // update specific fields in the filter state
  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            {/* changed "Restaurants" to "Races" */}
            <p>Races</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          {/* Combat Style Filter */}
          <FilterSelect
            label="Combat Style"
            options={[
              "",
              "Martial",
              "Caster",
              "Support",
              "Hybrid",
              "Stealth",
            ]}
            value={filters.category}
            onChange={(event) => handleSelectionChange(event, "category")}
            name="category"
            icon="/sword.svg"
          />

          {/* Homeland Filter */}
          <FilterSelect
            label="Homeland"
            options={[
              "",
              "Faerûn",
              "The Underdark",
              "Feywild",
              "The Sword Coast",
              "Waterdeep",
            ]}
            value={filters.city}
            onChange={(event) => handleSelectionChange(event, "city")}
            name="city"
            icon="/map.svg"
          />

          {/* TIER FILTER REMOVED HERE */}

          {/* Sort Filter */}
          <FilterSelect
            label="Sort"
            options={["Rating", "Review"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sort.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  // removed "price" from the reset list
                  setFilters({
                    city: "",
                    category: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          // skip showing the sorting as a 'tag', and skip price if it somehow exists
          if (type == "sort" || type == "price" || value == "") {
            return null;
          }
          return (
            <Tag
              key={value}
              type={type}
              value={value}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}