import React, { useRef, useState } from 'react'
import searchIcon from "../assets/search.svg";
import sortIcon from "../assets/sort.svg";
import sendIcon from "../assets/send.svg";

const TopControls = ({controlValues, setControlValues}) => {
  const [showSort, setShowSort] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const searchBarRef = useRef();
	const sortBarRef = useRef();

  const handleHoverSearch = () => {
		if (!showSearch) {
			searchBarRef.current.classList.add("search-bar-full-width");
			setShowSearch(true);
		}
	};

	const handleLeaveSearch = () => {
		if (!searchInputValue) {
			setShowSearch(false);
			searchBarRef.current.classList.remove("search-bar-full-width");
		}
	};

  const handleHoverSort = () => {
		setShowSort(true);
		sortBarRef.current.classList.add("sort-bar-full-width");
	};

	const handleLeaveSort = () => {
		setShowSort(false);
		sortBarRef.current.classList.remove("sort-bar-full-width");
	};

  const sortBy = sortKey => {
		setControlValues(prev => ({...prev, sortValue: sortKey}))
		setShowSort(false);
		sortBarRef.current.classList.remove("sort-bar-full-width");
	};

  const search = async () => {
		if (!searchInputValue) return;
		const formattedSearchValue = searchInputValue.toLowerCase().trim();
		const singularValue = formattedSearchValue.replaceAll(
			/([^\s]+?)(es|e|s)\b$/g,
			"$1"
		);
		setControlValues(prev => ({...prev, searchValue: singularValue}))
		setSearchInputValue("");
		setShowSearch(false);
		searchBarRef.current.classList.remove("search-bar-full-width");
	};

  const searchByEnter = async e => {
		if (e.key === "Enter") {
			e.preventDefault();
			await search();
		}
	};

  const isFiltered = () => {
    return controlValues.searchValue || controlValues.filterValue;
  }

  const viewAllRecipes = () => {
		setControlValues({filterValue: "", searchValue: "", sortValue: ""});
		setShowSearch(false);
		setSearchInputValue("");
	};

  return (
    <div className="top-icon-container">
      <div className="search-container">
        <div
          className="search-bar"
          ref={searchBarRef}
          onMouseEnter={handleHoverSearch}
          onMouseLeave={handleLeaveSearch}
        >
          <div className="search-image-container" 
          tabIndex="0" 
          role="button"
          onKeyDown={e => e.key === "Enter" && handleHoverSearch()}>
            <img src={searchIcon} alt="search" />
          </div>
          {showSearch && (
            <>
              <input
                className="search-input"
                type="text"
                value={searchInputValue}
                placeholder="Search recipe or ingredient"
                onKeyDown={e => searchByEnter(e)}
                onChange={e => setSearchInputValue(e.target.value)}
              />
              <div className="send-image-container"
                tabIndex="0"
                role="button"
                onKeyDown={e => {
                  e.key === "Enter" && search();
                  e.key === "Tab" && setTimeout(() => handleLeaveSearch(), 500);
                }}>
                <img
                  src={sendIcon}
                  className="send-icon"
                  alt="send"
                  onClick={search}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {!showSearch && (
        <div className="sort-container">
          <div
            className="sort-bar"
            ref={sortBarRef}
            onMouseEnter={handleHoverSort}
            onMouseLeave={handleLeaveSort}
          >
            <div className="search-image-container" 
              tabIndex="0"
              role="button"
              onKeyDown={e => e.key === "Enter" && handleHoverSort()}>
              <img
                className="sort-icon"
                src={sortIcon}
                alt="sort"
              />
            </div>
            {showSort && (
              <div className="sort-item-container">
                <span
                  className={`sort-tag ${
                    controlValues.sortValue === "new" ? "sort-tag-active" : ""
                  }`}
                  tabIndex="0"
                  role="button"
                  onKeyDown={e => e.key === "Enter" && sortBy("new")}
                  onClick={() => sortBy("new")}
                >
                  New
                </span>
                <span
                  className={`sort-tag ${
                    controlValues.sortValue === "top" ? "sort-tag-active" : ""
                  }`}
                  tabIndex="0"
                  role="button"
                  onKeyDown={e => e.key === "Enter" && sortBy("top")}
                  onClick={() => sortBy("top")}
                >
                  Top
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {isFiltered() &&
        !showSearch &&
        !showSort && (
          <div className="all-recipes" 
          tabIndex="0" 
          onKeyDown={e => e.key === "Enter" && viewAllRecipes()}
          onClick={viewAllRecipes}>
            All Recipes
          </div>
        )}
    </div>
  )
}

export default TopControls;
