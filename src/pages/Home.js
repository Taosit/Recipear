import React, {useState, useRef, useMemo} from "react"
import Recipes from "../components/Recipes";
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import searchIcon from "../assets/search.png";
import sortIcon from "../assets/sort.png"
import sendIcon from "../assets/send.png"
import {useLocation} from "react-router-dom";

function Home() {
  const {tags, recipes, loading, setLastVisitedPage} = useRecipeContext()
  const [tagOnHover, setTagOnHover] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState("")
  const [filterValue, setFilterValue] = useState([])
  const [showSort, setShowSort] = useState(false)
  const [sortValue, setSortValue] = useState("")

  const searchBarRef = useRef()
  const sortBarRef = useRef()
  const filterContainer = useRef()

  const currentRoute = useLocation()
  setLastVisitedPage(currentRoute.pathname)

  const filterRecipes = ({key, value}) => {
    if (key === "name") return recipes.filter(recipe => recipe.name === value);
    if (key === "tags") return recipes.filter(recipe => recipe.tags.includes(value));
    if (key === "ingredients") return recipes.filter(recipe => recipe.ingredients.some(ingredient => ingredient.includes(value)));
  }

  const sortRecipes = (recipes) => {
    if (sortValue === "top") {
      recipes.sort((a, b) => b.likes - a.likes)
    } else {
      recipes.sort((a, b) => b.date - a.date)
    }
    return recipes;
  }


  let filteredAndSortedRecipes = useMemo(() => {
    if (filterValue.length === 0 && !sortValue) return recipes;
    let filteredRecipes = recipes;
    if (filterValue.length !== 0) {
      filteredRecipes = filterValue.reduce((resultingRecipes, filterTerm) => {
        return [...resultingRecipes, ...filterRecipes(filterTerm)]
      }, [])
    }
    if (!sortValue) return filteredRecipes;
    return sortRecipes(filteredRecipes)
  }, [filterValue, sortValue, recipes])

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  console.log({filteredAndSortedRecipes})

  const handleHoverTagCategory = (e, tagCategory) => {
    setTagOnHover([tagCategory, tags[tagCategory]])
  }

  const handleLeaveCategoryTags = (e) => {
    if (e.clientY < 50) setTagOnHover(null);
  }

  const handleLeaveTags = (e) => {
    setTagOnHover(null)
  }

  const handleHoverSearch = () => {
    if (!showSearch) {
      searchBarRef.current.classList.add("search-bar-full-width");
      setShowSearch(true)
    }
  }

  const handleLeaveSearch = () => {
    if (!searchInputValue) {
      setShowSearch(false)
      searchBarRef.current.classList.remove("search-bar-full-width");
    }
  }

  const filterRecipeByTag = async (tag) => {
    setFilterValue([{key: "tags", value: tag}])
  }

  const search = async () => {
    if (!searchInputValue) return;
    const formattedSearchValue = searchInputValue.toLowerCase().trim();
    const singularValue = formattedSearchValue.replaceAll(/([^\s]+?)(es|e|s)\b$/g, '$1');
    setFilterValue([{key: "name", value: formattedSearchValue}, {key: "ingredients", value: singularValue}])
    setSearchInputValue("")
  }

  const searchByEnter = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await search();
    }
  }

  const handleHoverSort = () => {
    setShowSort(true);
    sortBarRef.current.classList.add("sort-bar-full-width");
  }

  const handleLeaveSort = () => {
    setShowSort(false);
    sortBarRef.current.classList.remove("sort-bar-full-width");
  }

  const sortBy = (sortKey) => {
    setSortValue(sortKey)
    setShowSort(false)
    sortBarRef.current.classList.remove("sort-bar-full-width");
  }

  console.log(showSort)

  const viewAllRecipes = () => {
    setFilterValue([])
    setSortValue("")
    setShowSearch(false);
    setSearchInputValue("")
  }

  if (loading) return <div className="main-container">
    <div className="loader"></div>
  </div>

  return (
    <>
      <div className="main-container-top">
        <div className="container">
          <div className="main-header">
            <div className="filters" ref={filterContainer}>
              <div className="filter-container" onMouseLeave={(e) => handleLeaveCategoryTags(e)}>
                {
                  Object.keys(tags).map((tagCategory, i) => (
                    <span className="tag-category" key={i}
                          onMouseEnter={(e) => handleHoverTagCategory(e, tagCategory)}
                    >
                {capitalize(tagCategory)}
              </span>
                  ))
                }
              </div>
              {tagOnHover ?
                <div className={`tags-to-filter-container hover-${tagOnHover[0]}`}
                     onMouseLeave={(e) => handleLeaveTags(e)}>
                  {tagOnHover[1].map((tag, i) => (
                    <span className="tag-category" key={i}
                          onClick={() => filterRecipeByTag(tag)}
                    >{tag}</span>
                  ))}
                </div> :
                <div className="top-icon-container">
                  <div className="search-container">
                    <div className="search-bar" ref={searchBarRef} onMouseEnter={() => handleHoverSearch()}
                         onMouseLeave={handleLeaveSearch}>
                      <div className="search-image-container">
                        <img src={searchIcon} alt="search"/>
                      </div>
                      {showSearch &&
                        <>
                          <input className="search-input" type="text" value={searchInputValue}
                                 placeholder="Search recipe or ingredient"
                                 onKeyDown={(e) => searchByEnter(e)}
                                 onChange={(e) => setSearchInputValue(e.target.value)}
                          />
                          <div className="send-image-container">
                            <img src={sendIcon} className="send-icon" alt="send" onClick={search}/>
                          </div>
                        </>
                      }
                    </div>
                  </div>
                  {!showSearch && <div className="sort-container">
                    <div className="sort-bar" ref={sortBarRef} onMouseEnter={handleHoverSort}
                         onMouseLeave={handleLeaveSort}>
                      <div className="search-image-container">
                        <img className="sort-icon" src={sortIcon} alt="sort"/>
                      </div>
                      {showSort &&
                        <div className="sort-item-container">
                      <span className={`sort-tag ${sortValue === "new" ? "sort-tag-active" : ""}`}
                            onClick={() => sortBy("new")}>New</span>
                          <span className={`sort-tag ${sortValue === "top" ? "sort-tag-active" : ""}`}
                                onClick={() => sortBy("top")}>Top</span>
                        </div>
                      }
                    </div>
                  </div>}
                  {(filterValue.length > 0 || sortValue) &&
                    <div className="all-recipes" onClick={viewAllRecipes}>All Recipes</div>}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="main-container" onTouchStart={() => setTagOnHover(null)}>
        <div className="container">
          <div className="main">
            <Recipes recipes={filteredAndSortedRecipes} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;