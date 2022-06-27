import React, {useState, useRef, useEffect} from "react"
import Recipes from "../components/Recipes";
import RecipeModal from "../components/RecipeModal";
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import searchIcon from "../assets/search.png";
import sortIcon from "../assets/sort.png"
import sendIcon from "../assets/send.png"
import {db} from "../firebase.config";
import {getDocs, collection, query, where} from "firebase/firestore";
import {useLocation} from "react-router-dom";

function Home() {
  const {tags, recipes, loading, setLoading, setLastVisitedPage} = useRecipeContext()
  const [tagOnHover, setTagOnHover] = useState(null)
  const [filteredRecipes, setFilteredRecipes] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [showSort, setShowSort] = useState(false)
  const [sortValue, setSortValue] = useState("")

  const searchBarRef = useRef()
  const sortBarRef = useRef()
  const filterContainer = useRef()

  const currentRoute = useLocation()
  setLastVisitedPage(currentRoute.pathname)

  useEffect(() => {
    if (!sortValue) return;
    setLoading(true);
    if (filteredRecipes) {
      setFilteredRecipes(prev => sortRecipes(prev))
    } else {
      setFilteredRecipes(sortRecipes(recipes))
    }
    setLoading(false)
  }, [sortValue])

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  const handleHoverTagCategory = (e, tagCategory) => {
    setTagOnHover([tagCategory, tags[tagCategory]])
  }

  const handleLeaveCategoryTags = (e) => {
    if (e.clientY < 50) setTagOnHover(null);
  }

  const handleLeaveTags = (e) => {
    setTagOnHover(null)
  }

  const sortRecipes = (recipes) => {
    if (!sortValue) return recipes;
    if (sortValue === "top") {
      recipes.sort((a, b) => b.likes - a.likes)
    } else {
      recipes.sort((a, b) => b.date - a.date)
    }
    return recipes;
  }

  const filterRecipeByTag = async (tag) => {
    setLoading(true);
    const q = query(collection(db, "recipes"), where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(q);
    const tempRecipes = []
    querySnapshot.forEach((doc) => {
      tempRecipes.push(doc.data())
    });
    setFilteredRecipes(sortRecipes(tempRecipes))
    setLoading(false)
  }

  const handleHoverSearch = () => {
    if (!showSearch) {
      searchBarRef.current.classList.add("search-bar-full-width");
      setShowSearch(true)
    }
  }

  const handleLeaveSearch = () => {
    if (!searchValue) {
      setShowSearch(false)
      searchBarRef.current.classList.remove("search-bar-full-width");
    }
  }

  const singleSearch = async (field, op, value) => {
    const q = query(collection(db, "recipes"), where(field, op, value));
    const querySnapshot1 = await getDocs(q);
    let results = [];
    querySnapshot1.forEach((doc) => {
      results.push(doc.data())
    });
    return results;
  }

  const search = async () => {
    if (!searchValue) return;
    setLoading(true);
    const formattedSearchValue = searchValue.toLowerCase().trim();
    const matchName = await singleSearch("name", "==", formattedSearchValue)
    if (matchName.length > 0) {
      setFilteredRecipes(sortRecipes(matchName));
      return
    }
    if (formattedSearchValue.slice(-1) === "s") {
      const searchPlural = await singleSearch("ingredients", "array-contains", formattedSearchValue);
      if (searchPlural.length > 0) {
        setFilteredRecipes(sortRecipes(searchPlural));
        return;
      }
      const searchSingular = await singleSearch("ingredients", "array-contains", formattedSearchValue.slice(0, -1));
      if (searchSingular.length > 0) {
        setFilteredRecipes(sortRecipes(searchSingular))
        return;
      }
      const searchEsSingular = await singleSearch("ingredients", "array-contains", formattedSearchValue.slice(0, -2));
      setFilteredRecipes(sortRecipes(searchEsSingular))
    } else {
      const searchSingular = await singleSearch("ingredients", "array-contains", formattedSearchValue);
      if (searchSingular.length > 0) {
        setFilteredRecipes(sortRecipes(searchSingular))
        return;
      }
      const searchPlural = await singleSearch("ingredients", "array-contains", `${formattedSearchValue}s`);
      if (searchPlural.length > 0) {
        setFilteredRecipes(sortRecipes(searchPlural));
        return;
      }
      const searchEsPlural = await singleSearch("ingredients", "array-contains", `${formattedSearchValue}es`);
      setFilteredRecipes(sortRecipes(searchEsPlural))
    }
    setLoading(false)
    setSearchValue("")
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
    setSortValue(sortKey);
    setShowSort(false)
  }

  const viewAllRecipes = () => {
    setFilteredRecipes(null);
    setShowSearch(false);
    setSearchValue("")
  }

  if (loading) return <h1>Loading...</h1>

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
                          <input className="search-input" type="text" value={searchValue}
                                 placeholder="Search recipe or ingredient"
                                 onKeyDown={(e) => searchByEnter(e)}
                                 onChange={(e) => setSearchValue(e.target.value)}
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
                  {filteredRecipes &&
                    <div className="all-recipes" onClick={viewAllRecipes}>All Recipes</div>}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="container">
          <div className="main">
            <Recipes recipes={filteredRecipes || recipes} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;