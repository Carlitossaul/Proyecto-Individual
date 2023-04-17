require("dotenv").config();
const {
  API_KEY6,
  API_KEY7,
  API_KEY8,
  API_KEY9,
  API_KEY10,
  API_KEY11,
  API_KEY12,
  API_KEY13,
  API_KEY14,
  API_KEY15,
} = process.env;
const axios = require("axios");
const { Recipe } = require("../db");
const { Op } = require("sequelize");

let index = 0;
let index2 = 0;

const cleanArray = (array) =>
  array.map((elem) => {
    return {
      id: elem.id,
      name: elem.title,
      image: elem.image,
      summary: elem.summary.replaceAll(/<(“[^”]”|'[^’]’|[^'”>])*>/g, ""),
      healthScore: elem.healthScore,
      steps: elem.analyzedInstructions[0]?.steps
        .map((ste) => `${ste.number}. ${ste.step}`)
        .join("  "),
      diets: elem.diets,
      created: false,
    };
  });

const getAllRecipe = async () => {
  let apiKey;
  switch (index) {
    case 0:
      apiKey = API_KEY6;
      break;
    case 2:
      apiKey = API_KEY7;
      break;
    case 3:
      apiKey = API_KEY8;
      break;
    case 4:
      apiKey = API_KEY9;
      break;
    case 5:
      apiKey = API_KEY10;
      break;
    default:
      apiKey = API_KEY6;
  }

  try {
    let recipesDataBase = await Recipe.findAll();

    let recipesApiRaw = (
      await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&apiKey=${apiKey}&number=100`
      )
    ).data.results;

    const recipesApi = cleanArray(recipesApiRaw);
    return [...recipesDataBase, ...recipesApi];
  } catch (error) {
    index = (index + 1) % 5; // incrementa el valor de index y lo hace circular entre 0 y 4
    apiKey = [API_KEY6, API_KEY7, API_KEY8, API_KEY9, API_KEY10][index]; // asigna la nueva clave de API en función de su valor actual
    return [];
  }
};

const getRecipeByName = async (name) => {
  let apiKey2;
  switch (index2) {
    case 0:
      apiKey2 = API_KEY11;
      break;
    case 2:
      apiKey2 = API_KEY12;
      break;
    case 3:
      apiKey2 = API_KEY13;
      break;
    case 4:
      apiKey2 = API_KEY14;
      break;
    case 5:
      apiKey2 = API_KEY15;
      break;
    default:
      apiKey2 = API_KEY11;
  }

  try {
    let recipesDataBase = await Recipe.findAll({
      where: !!name
        ? {
            name: {
              [Op.iLike]: `%${name}%`,
              // [Op.substring]: name.toLowerCase(),
            },
          }
        : {},
    });

    let recipesApiRaw = (
      await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&apiKey=${apiKey2}&number=100&query=${name}`
      )
    ).data.results;

    const recipesApi = cleanArray(recipesApiRaw);

    return [...recipesApi, ...recipesDataBase];
  } catch (error) {
    index2 = (index2 + 1) % 5; // incrementa el valor de index y lo hace circular entre 0 y 4
    apiKey2 = [API_KEY11, API_KEY12, API_KEY13, API_KEY14, API_KEY15][index2]; // asigna la nueva clave de API en función de su valor actual
    return [];
  }
};

module.exports = {
  getRecipeByName,
  getAllRecipe,
};

//   let filteredApi = await recipesApiRaw.filter((recipe) =>
//   recipe.name.toLowerCase() === name.toLowerCase()
// );
