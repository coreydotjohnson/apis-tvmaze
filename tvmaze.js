/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
async function searchShows(query) {
  let res = await axios.get("https://api.tvmaze.com/search/shows?", {
    params: { q: query },
  });
  let showResults = res.data.map((result) => {
    return {
      id: result.show.id,
      name: result.show.name,
      summary: result.show.summary,
      image: result.show.image
        ? result.show.image.medium
        : "http://tinyurl.com/missing-tv",
    };
  });
  return showResults;
}

//Adds shows to DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodeResults = res.data.map((result) => {
    return {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number,
    };
  });
  return episodeResults;
}

//Adds episodes to DOM
function populateEpisodes(episodes) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`
    );
    $episodeList.append($item);
  }
  $("#episodes-area").show();
}

//Handles click. Unhides episode list and populates
$("#shows-list").on(
  "click",
  ".get-episodes",
  async function handleEpisodeClick(e) {
    let showId = $(e.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);
