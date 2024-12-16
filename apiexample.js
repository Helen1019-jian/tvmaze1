let apiURL = 'http://api.tvmaze.com/';
var elemMain;

// initialize page after HTML loads
window.onload = function() {
   elemMain = document.getElementById("main");
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
async function searchTvShows() {

  document.getElementById("main").innerHTML = "";
  
  let search = document.getElementById("search").value;  
   
  try {   
      const response = await fetch(apiURL + 'search/shows?q=' + search);
      const data = await response.json();
      console.log(data);
      showSearchResults(data);
  } catch(error) {
    console.error('Error fetching tv show:', error);
  } // catch
} // searchTvShows 

// change the activity displayed 
function showSearchResults(data) {
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for

} // updatePage

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   let output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
 
    // get the main div tag
   
    //错误1：每次createTVShow都会清空，导致永远只有一个
    // elemMain.innerHTML = "";

    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    var elemSummary = document.createElement("div");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    elemSummary.innerHTML = tvshowJSON.show.summary;
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    let showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
async function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  try {
     const response = await fetch(apiURL + 'shows/' + showId + '/episodes');  
     const data = await response.json();
     console.log("episodes");
     console.log(data);
     showEpisodes(data, elemDiv);
  } catch(error) {
    console.error('Error fetching episodes:', error);
  } // catch
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
     
    //更改4：单集信息message框上部显示单集对应的电视剧的标题
    let name = elemDiv.getElementsByTagName("h2")[0].innerHTML;

    let elemEpisodes = document.createElement("div");  // creates a new div tag
    let output = "<ol>";
    for (episode in data) {
       //更改4：单集信息message框上部显示单集对应的电视剧的标题
        // output += "<li><a href='javascript:showLightBox(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
        output += `<li><a href='javascript:showLightBox(${data[episode].id} ,"${name}")'>${data[episode].name}</a></li>`;
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes

//更改4：单集信息message框上部显示单集对应的电视剧的标题
// open lightbox and display episode info
function showLightBox(episodeId,name){
     document.getElementById("lightbox").style.display = "block";
     
     //更改4：单集信息message框上部显示单集对应的电视剧的标题
     // show episode info in lightbox
    //  document.getElementById("message").innerHTML = "" + episodeId + "</h3>";
     document.getElementById("message").innerHTML = "" + name + "</h3>";
     
    //  更改1：去掉无用信息，由showBox->showTvShow 来创建单集信息拼接显示
    //  document.getElementById("message").innerHTML += "<p>Your job is to make a fetch for all info on this"  
    //                     + " episode and then to also show the episode image, name, season, number, and description.</p>";
  
  showBox(episodeId);
     
} // showLightBox
function showTvShow(data) {
  //更改1：不需放在main里，要显示在message框中
  // elemMain.innerHTML = "";
  // show all data returned from tv maze
  console.log(data); 
  //错误2：单集就一条数据，不需要加循环
  // for(index in data){
    //console.log(data[index]);
    let newDiv = document.createElement("div");
    let newImage = document.createElement("img");
    let newShowTitle = document.createElement("h2");
    let newGenre = document.createElement("Div");
    let newRating = document.createElement("Div");
    let newsummary = document.createElement("Div");
    let linkVideo = document.createElement("a");
    

    //更改2： 如果没有image数据，就把src置空
    newImage.src = data.image==null ? '' : data.image.medium;
    // if(data.image==null){
    //   newImage.src = '';
    // }else{
    //   newImage.src = data.image.medium;
    // }

    newShowTitle.innerHTML =  data.name;
    newGenre.innerHTML = "Genres: " + showGenres(data.genres);
    newRating.innerHTML = "Rating: " + data.rating.average;
    newsummary.innerHTML = data.summary;

    //更改3: 增加跳转观看页面的链接
    linkVideo.innerHTML = "Clik Me TO Watch..." ; 
    linkVideo.href = data.url;
    linkVideo.target = '_blank';

    console.log(newShowTitle);
    newDiv.appendChild(newImage);
    newDiv.appendChild(newShowTitle);
    newDiv.appendChild(newGenre);
    newDiv.appendChild(newRating);
    newDiv.appendChild(newsummary);

    //更改3: 增加跳转观看页面的链接
    newDiv.appendChild(linkVideo);

    //更改1：不需放在main里，要显示在message框中
    // elemMain.appendChild(newDiv);
    document.getElementById("message").appendChild(newDiv);
  // }
}
async function showBox(episodeId) {

    let episodeLink = apiURL + "episodes/" + episodeId;
    try {
      const response = await fetch(episodeLink);
      const data = await response.json();
      console.log(data);
      showTvShow(data); 
    } catch(error) {
      console.error('Error fetching tv show:', error);
      
    } // catch
} // fetchTvShow
 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";

 } // closeLightBox 

 




