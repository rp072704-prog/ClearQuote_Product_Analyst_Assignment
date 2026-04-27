function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search",
  filters = [],
  children
}) {
  return (
    <div className="filter-bar">
      {onSearchChange ? (
        <input
          aria-label={searchPlaceholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          type="search"
        />
      ) : null}

      {filters.map((filter) => (
        <select
          aria-label={filter.label}
          key={filter.key}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      {children}
    </div>
  );
}

export default FilterBar;
