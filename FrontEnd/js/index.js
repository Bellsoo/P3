
let categories = [{
    "id": 0,
    "name": "Tous"
  }]
  
  let works = [] ;
  
  getCategories();
  getWorks();
  isConnected();
  // partie récupérer les categories/categories depuis l'api 
  function getCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => {
        if (response.status == 200) return response.json();
      })
      .then((data) => {
  
        data.forEach(element => {
          categories.push(element);
        });
        createFilters();
  
      })
      .catch((error) => {
        console.log(error);
        alert("Une erreur est survenue Veillez contacter l'admin !");
      })
  }
  
  // partie récupérer les projets/works depuis l'api 
  function getWorks() {
    fetch("http://localhost:5678/api/works")
      .then((response) => {
        if (response.status == 200) return response.json();
      })
      .then((data) => {
        console.log(data);
        works = data; 
        createProjects(works);
      })
      .catch((error) => {
        console.log(error);
        alert("Une erreur est survenue Veillez contacter l'admin !!");
      })
  }
  
  
  
  
  // coder la creation et l'ajout des filters 
  function createFilters() {
    categories.forEach(element => {
      const button = document.createElement("button");
      //button.setAttribute("class", "filter");
      button.classList.add("filter");
      button.setAttribute("id", element.id);
      button.textContent = element.name;
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        if(element.id == 0 ) 
        {
          createProjects(works);
        }
        else{
          //filteredwork = tableau filtré par categorie 
          //tableau.filter()  c'est une fonction predefinie de javascript 
          //condition de filtrage 
          const filtredWorks = works.filter(work => work.categoryId == element.id);
          createProjects(filtredWorks);
        }
      });
      document.querySelector(".filters").appendChild(button);
    });
  }
  
  function createProjects(tableau) {
    document.querySelector(".gallery").innerHTML="";
    tableau.forEach(element => {
      const figure = createProjectGallery(element);
      document.querySelector(".gallery").appendChild(figure);
    });
  }
  
  function createProjectGallery(element){
    const figure = document.createElement("figure");
      figure.id = "figure"+element.id;
      const image = document.createElement("img");
      image.src = element.imageUrl;
      image.alt = element.title;
  
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = element.title;
  
      figure.appendChild(image);
      figure.appendChild(figcaption);
  
      return figure;
  }
  
  
  function isConnected(){
    // mettre en display none tous les elements à cacher si je ne suis pas authentifié
    if (localStorage.getItem("token")) {
     
      let elementsToDisplay = document.querySelectorAll('.element-to-display');
      elementsToDisplay.forEach(element => {
        element.style.display = 'block';
      });
      let login = document.getElementById("login");
      login.style.display = "none";
    
      const logout = document.getElementById("logout");
      logout.style.display= "block";
      // oui mais du coup je suis connectée
      logout.addEventListener('click', function(event){
        disconnect();
      })
      const filters = document.querySelector(".filters");
      filters.style.display= "none";
  
      let bband = document.getElementById("bband");
      bband.style.display="block";
    } else {
      let elementsToDisplay = document.querySelectorAll('.element-to-display');
      elementsToDisplay.forEach(function(element) {
        element.style.display = 'none';
      });
      const login = document.getElementById("login");
      login.style.display= "block";
    
      let logout = document.getElementById("logout");
      logout.style.display= "none";
  
      const filters = document.querySelector(".filters");
      filters.style.display= "flex";
      
  
      let bband = document.getElementById("bband");
      bband.style.display="none";
    }
  }
  
  
  function disconnect(){
    localStorage.clear();
    window.location.reload();
  }