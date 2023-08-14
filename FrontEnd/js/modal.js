
// Get the modal
let modal = document.getElementById("myModal");
let content1 = document.querySelector(".modal-content1");
let content2 = document.querySelector(".modal-content2");


// Get the button that opens the modal
const tableauBtnModifier = document.querySelectorAll(".btnModifier");
tableauBtnModifier.forEach(element => {
  // When the user clicks on the button, open the modal
  element.onclick = function (event) {

    modal.style.display = "flex";
    createContent1();
  }

});



// Get the <span> element that closes the modal
let listBtnClose = document.querySelectorAll(".close");


// Get the <span> element that returns the modal
let spanr = document.getElementsByClassName("return");

listBtnClose.forEach(element => {
  // When the user clicks on <span> (x), close the modal
element.addEventListener('click' , function () {
  modal.style.display = "none";
});
});


// When the user clicks on <span> (<-), return to <div class="modal-content1"> the modal
spanr.onclick = function () {
  modal.window.history.back();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// afficher gallery dans modale
function createContent1() {

  // chargement des projets depuis l'api : ils sont deja dispo dans works
  const gallery = document.querySelector("#gallery");

  gallery.innerHTML = ""; // reset de la gallery 
  // coder la boucle pour afficher la gallery comme la maquette 
  works.forEach(element => {
    const figure = createProject(element);
    gallery.appendChild(figure);
  });

// Ajouter l'action du bouton ajouter photo pour ouvrir la deuxieme modale 
const ajouterPhoto = document.getElementById("ajouterPhoto");
ajouterPhoto.addEventListener("click", function () {
  content1.style.display = "none";
  content2.style.display = "flex";
  createContent2();
}); 
}

function createProject(projet) {

  const figure = document.createElement("figure");

  figure.className = "figureModal";
  figure.id = "figureModal" + projet.id;

  const image = document.createElement("img");
  image.src = projet.imageUrl;
  image.alt = projet.title;
  figure.appendChild(image);
 
  const deleteIcon = document.createElement("div");
  deleteIcon.className = "deleteIcon";
  // Ajouter les event listener click pour proceder au fetch de suppression d'un projet
  const trash = document.createElement("i");
  trash.className = "fa-solid fa-trash-can";
  deleteIcon.appendChild(trash);
  deleteIcon.addEventListener('click', function (event) {
    console.log("suppression du projet", projet.id);
    const result = confirm("Voulez vous supprimer le projet " + projet.id + " ?");
    if (result) {
      deleteProject(projet.id);
    }
  });
  const figcaption = document.createElement("figcaption");
  figcaption.className = "editer";
  figcaption.textContent = "Editer";

  figure.appendChild(image);
  figure.appendChild(deleteIcon);
  figure.appendChild(figcaption);

  return figure;
}


function createContent2() {


  const selectCategories = document.querySelector("#Categorie");
  // remplir l'element select du html content 2 avec les categories du tableau 

  for (let index = 1; index < categories.length; index++) {
    const element = categories[index];
    console.log("element", element);
    // creer une option et l'attacher à l'element de id Categorie
    const optionCategory = document.createElement("option");
    optionCategory.value = element.id;
    optionCategory.text = element.name;

    selectCategories.appendChild(optionCategory);
  }

  const returnButton = document.querySelector(".return");
  returnButton.addEventListener("click", function () {
    content1.style.display = "flex";
    content2.style.display = "none";
    createContent1();
  });
}

function deleteProject(id) {
  fetch('http://localhost:5678/api/works/' + id,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        Authorization: 'Bearer ' + localStorage.getItem("token")
      }

    })
    .then(response => {
      if (response.status == 204) {
        alert("Le projet " + id + " a été supprimé avec succes !");
        // Supprimer l'emlement depuis le tableau globale 
        console.log(works);
        works = works.filter(element => element.id != id);
        console.log(works);
        // Supprimer l'element depuis la page index depuis la gallery globale
        document.getElementById("figure" + id).remove();

        // Supprimer l'element depuis la modale 
        document.getElementById("figureModal" + id).remove();

      }
      if (response.status == 401) {
        alert("Erreur d'authentification !");
      }

    })
    .catch(error => {
      console.error('Il y a eu une erreur', error);
      alert("Erreur de suppression du projet !");
    });
}

// PARTIE CREATE PROJECT
function previewImage(event){
  // traitement si on modifie l'image: 
  // afficher l'image si une est selectionnee 
  let imageAffichee = document.querySelector(".picture-top");
  imageAffichee.style.display ="block";
  const file =  event.target.files[0];
  if (file){
    var reader = new FileReader();
    reader.onload = function(e){
      document.getElementById("imageSelected").src =e.target.result;
      document.querySelector(".AjouterPhoto").style.display ="none";
      document.querySelector(".logo-ecrito").style.display ="none";
      document.querySelector("#file").style.display ="none";
      document.querySelector(".ecrito").style.display ="none";
      
    }
    reader.readAsDataURL(file);
  }else{
    alert("Veuillez selectionner un fichier ! ");
    }
 
}

 // supprimer la photo de la vue si je clique sur un croix pour l'eliminer et la remplacer 
function closePicture(){
  let imageAffichee = document.querySelector(".picture-top");
  imageAffichee.style.display ="none";
  document.getElementById("imageSelected").src = "";
  document.querySelector(".AjouterPhoto").style.display ="block";
  document.querySelector(".fa-image-landscape").style.display ="block";
  document.querySelector("#file").style.display ="none";
  document.querySelector(".ecrito").style.display ="block";  
}


// l'ivoquer sur le on click du bouton valider 
function valider(){
  // verfieier que tu as : un titre, une category et une image selectionnée 
  // si c'est pas ok : une alerte s'affiche indiquant de remplir le formulaire 
  // siono il faut appeler la fonction AjoutProjetAPi 

  let titre = document.getElementById("Titre").value;
  let categorie = document.getElementById("Categorie").value;
  
  let file = document.getElementById("file");
  // ouuuu let imageAffichee = document.getElementByClassName("AjouterPhoto")
  
  // Vérifier si le titre, la catégorie et une image sont sélectionnés
  if (titre.trim() === "" || categorie.trim() === "" || !file.files[0]) {
      alert("Veuillez remplir le formulaire correctement.");
  } else {
    ajoutProjetAPI(file, titre, categorie)
  }


}
// est ce qu'il faut aussi que je mette l'id ?
function ajoutProjetAPI(image, title, category) {

  const formData =new FormData(); 
  formData.append("image", image.files[0]);
  formData.append("title", title);
  formData.append("category", category);
  
  const token = localStorage.getItem("token");
let options = {
  method: 'POST',
  headers: {
    Accept : 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: formData
};

fetch("http://localhost:5678/api/works", options)
  .then((response) => {
    if (response.status == 400) alert("Veuillez verifier les champs saisis !");
    if (response.status == 401) alert("Veuillez vous authentifier pour ajouter un projet !");
    if (response.status == 201) {
      alert("Le projet a été ajouté avec succes !");
      return response.json();
    }})
  .then((work) => {
    if (work) {
      console.log("Nouveau projet ajouté avec succès", work);
      // Ajouter le projet dnas la liste globale 
      works.push(work);
      // Ajoute le projet dans la modale
      const figureModale = createProject(work);
      document.querySelector("#gallery").appendChild(figureModale);


      // Ajoute le projet dnas la page index: rubrique projets
      const figure = createProjectGallery(work);
      document.querySelector(".gallery").appendChild(figure);

      modal.window.history.back();
    }
  })
  // .catch((error) => {
  //   console.log(error);
  //   alert("Une erreur est survenue Veillez contacter l'admin !");
  // });
}