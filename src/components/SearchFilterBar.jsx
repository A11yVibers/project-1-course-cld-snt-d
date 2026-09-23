export default function SearchFilterBar({
  query,
  onQueryChange,
  instructorId,
  onInstructorChange,
  instructors,
  sortBy,
  onSortChange,
  resultCount,
  onClear,
}) {
  const hasFilters = Boolean(query) || instructorId !== 'all' || sortBy !== 'name'

  return (
    <div className="filter-bar" role="search">
      <div className="filter-bar__field filter-bar__field--search">
        <label htmlFor="course-search" className="filter-bar__label">
          Search courses
        </label>
        <input
          id="course-search"
          type="search"
          className="filter-bar__input"
          placeholder={'Search by title or topic, e.g. “Rome” or “trade”…'}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="filter-bar__field">
        <label htmlFor="instructor-filter" className="filter-bar__label">
          Instructor
        </label>
        <select
          id="instructor-filter"
          className="filter-bar__input"
          value={instructorId}
          onChange={(e) => onInstructorChange(e.target.value)}
        >
          <option value="all">All instructors</option>
          {instructors.map((instructor) => (
            <option key={instructor.instructor_id} value={instructor.instructor_id}>
              {instructor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label htmlFor="sort-by" className="filter-bar__label">
          Sort by
        </label>
        <select
          id="sort-by"
          className="filter-bar__input"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">Title (A&ndash;Z)</option>
          <option value="weeks-asc">Length: shortest first</option>
          <option value="weeks-desc">Length: longest first</option>
        </select>
      </div>

      <div className="filter-bar__status">
        <span role="status" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'course' : 'courses'} found
        </span>
        {hasFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
