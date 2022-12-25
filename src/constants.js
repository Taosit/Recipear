import { v4 as uuid } from "uuid";

export const tags = {
  protein: ["Meat", "Seafood", "Vege"],
  nutrition: ["Low-carb", "High-protein", "High-fiber"],
  meal: ["Breakfast", "Main", "Desert"],
  region: ["Asian", "Arabian", "European"],
  flavor: ["Spicy", "Sour", "Sweet"],
}

export const emptyRecipe = {
  name: "",
  time: "",
  difficulty: "Easy",
  image: null,
  seasonings: [{ ingredient: "", amount: "", id: uuid() }, { ingredient: "", amount: "", id: uuid() }],
  ingredients: [{ ingredient: "", amount: "", id: uuid() }, { ingredient: "", amount: "", id: uuid() }],
  steps: [{instruction: "", image: null}],
  tags: [null, null, null, null],
  date: null,
  likes: 0,
  id: uuid(),
  date: new Date(),
};