// A tag is shown under the filter bar when a filter is selected.
// Tags show what filters have been selected
// On click, the tag is removed and the filter is reset

// define the tag component with its props
export default function Tag({ type, value, updateField }) {
  return (
    // added a classname so we can style these as fantasy tags later
    <span className="filter-tag">
      {value} {/* display the name of the active filter */}
      <button
        type="button"
        aria-label="Remove"
        onClick={() => updateField(type, "")} // remove the filter when clicked
      >
        X {/* the x icon to clear the filter */}
      </button>
    </span>
  );
}