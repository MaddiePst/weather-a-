import SearchBar from "./SearchBar";

export default function Header({
  city,
  onChange,
  onKeyDown,
  getLocation,
  toggleDarkMode,
  inputValue,
}) {
  return (
    <header className="header">
      {/* Dark/Light Mode */}
      <div className="toggle-container">
        <label className="toggle-label">
          <input type="checkbox" className="toggle-input" />
          <span className="slider" onClick={toggleDarkMode}></span>
        </label>
        <p className="dark-mode">Dark Mode</p>
      </div>

      {/* Search Bar */}
      <div className="serarch-bar-container">
        <label className="site-search"></label>
        <SearchBar
          inputValue={inputValue}
          city={city}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
      </div>

      {/* Current Location */}
      <button className="location" onClick={() => getLocation()}>
        <ion-icon name="locate" className="icon"></ion-icon>
        Current Location
      </button>
    </header>
  );
}
