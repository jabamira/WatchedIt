const ContentItem = require("../models/ContentItem.js");
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const axios = require("axios");
async function cacheMovieByTitle(title) {
  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        t: title,
      },
    });

    const data = response.data;

    const existing = await ContentItem.findByPk(data.imdbID);
    if (existing) {
      console.log(`[OMDb] Уже есть в базе: ${data.Title}`);
      return existing;
    }
    if (data.Response === "False") {
      console.log(`[OMDb] Фильм не найден: ${title}`);
      return null;
    }

    const newItem = await ContentItem.create({
      id: data.imdbID,
      title: data.Title,
      year: data.Year,
      posterUrl: data.Poster,
      plot: data.Plot,
      imdbRating: parseFloat(data.imdbRating),
    });

    console.log(`[OMDb] Сохранено в БД: ${data.Title}`);
    return newItem;
  } catch (err) {
    console.error("[OMDb] Ошибка при кэшировании:", err.message);
    return null;
  }
}
async function cacheMoviesBySearch(title) {
  try {
    const res = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        s: title,
        type: "movie",
      },
    });

    if (res.data.Response === "False") {
      console.log(`[OMDb] Фильмы не найдены: ${title}`);
      return [];
    }

    const results = res.data.Search || [];
    const savedMovies = [];

    for (const item of results) {
      // найти по первичному ключу id
      const existing = await ContentItem.findByPk(item.imdbID);
      if (!existing) {
        const detailsRes = await axios.get("http://www.omdbapi.com/", {
          params: {
            apikey: OMDB_API_KEY,
            i: item.imdbID,
          },
        });

        const details = detailsRes.data;

        if (details.Response === "False") continue;

        const movie = await ContentItem.create({
          id: details.imdbID,
          title: details.Title,
          year: details.Year,
          plot: details.Plot,
          imdbRating: parseFloat(details.imdbRating) || null,
          posterUrl: details.Poster,
        });

        savedMovies.push(movie);
      } else {
        savedMovies.push(existing);
      }
    }

    return savedMovies;
  } catch (err) {
    console.error(
      "[OMDb] Ошибка при кэшировании нескольких фильмов:",
      err.message
    );
    return [];
  }
}

module.exports = { cacheMovieByTitle, cacheMoviesBySearch };
