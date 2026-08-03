import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilter, onSort, filters = [], sortOptions = [] }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilter = (filterKey) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== '' && value !== null && value !== undefined).length;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-3 rounded-lg"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
        />
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex items-center gap-4">
        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-lg flex items-center gap-2 relative"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
        >
          <SlidersHorizontal size={18} />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: colors.primary, color: colors.onError }}>
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        {sortOptions.length > 0 && (
          <select
            onChange={(e) => onSort(e.target.value)}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
          >
            <option value="">Sort by</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        )}

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            style={{ backgroundColor: colors.error + '20', color: colors.error }}
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: colors.text }}>Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block mb-2 text-sm font-medium" style={{ color: colors.text }}>
                  {filter.label}
                </label>
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                )}
                {filter.type === 'range' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters[`${filter.key}_min`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                    />
                    <span style={{ color: colors.textSecondary }}>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters[`${filter.key}_max`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                    />
                  </div>
                )}
                {filter.type === 'checkbox' && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValues = activeFilters[filter.key] || [];
                            if (e.target.checked) {
                              handleFilterChange(filter.key, [...currentValues, option.value]);
                            } else {
                              handleFilterChange(filter.key, currentValues.filter(v => v !== option.value));
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span style={{ color: colors.text }}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                {filter.type === 'rating' && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange(filter.key, rating)}
                        className="text-2xl"
                        style={{ color: rating <= (activeFilters[filter.key] || 0) ? colors.warning : colors.textSecondary }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
              <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value) return null;
                  const filter = filters.find(f => f.key === key || key.startsWith(f.key));
                  if (!filter) return null;
                  
                  return (
                    <span
                      key={key}
                      className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      style={{ backgroundColor: colors.primary + '20', color: colors.primary }}
                    >
                      {filter.label}: {Array.isArray(value) ? value.join(', ') : value}
                      <button
                        onClick={() => clearFilter(key)}
                        className="hover:opacity-70"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
