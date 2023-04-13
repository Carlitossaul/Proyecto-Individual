require("dotenv").config();
const { API_KEY } = process.env;
const axios = require("axios");
const { Recipe } = require("../db");

const getDetailById = async (id, source) => {
  if (source === "api") {
    id = Number(id);
    let response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?addRecipeInformation=true&apiKey=${API_KEY}`
    );
    let recipe = {
      id: response.data.id,
      name: response.data.title,
      image: response.data.image,
      summary: response.data.summary.replaceAll(
        /<(“[^”]”|'[^’]’|[^'”>])*>/g,
        ""
      ),
      healthScore: response.data.healthScore,
      steps: response.data.analyzedInstructions[0]?.steps
        .map((ste) => `${ste.number}. ${ste.step}`)
        .join("  "),
      diets: response.data.diets,
      created: false,
    };
    return recipe;
  } else {
    let receta = await Recipe.findByPk(id);
    return receta;
  }
};

module.exports = {
  getDetailById,
};
