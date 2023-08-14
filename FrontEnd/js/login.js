// recuperer un evenement de submit pour
document.getElementById("loginForm").addEventListener('submit', function(){
    event.preventDefault(); 
    console.log("je vien de cliké");
    // Récupération de l'e-mail et du mot de passe
    let email = document.getElementById('email').value;
    let password = document.getElementById('Mot-de-passe').value;
    
    if(email.trim() == "" || password.trim() == "")
    {
        alert("Veuillez saisir un bon login et pwd");
    }
    else{
        //3/ invoquer la fonction postUser avec les donner de la vue 
        postUser(email, password);
    }
  
} );
  
  function postUser(email, password) {
    
    console.log('Email :', email);
    console.log('Mot de passe :', password);
  
    let options ={
        method:'POST',
        headers:{
        'Content-Type': 'application/json',
        } ,
        body: JSON.stringify({
            "email": email , //"sophie.bluel@test.tld",
            "password":  password //"S0phie"
          })
    };
    fetch("http://localhost:5678/api/users/login", options )
    .then((response) => {
        if(response.status ==404) alert("Utilisateur non enregistré !");
        if(response.status ==401) alert("Veuillez verifier le login et le mot de passe !");
       if(response.status ==200) return response.json();
    })
    .then((dataUser) => {
        if(dataUser){
        console.log("Connexion réussite", dataUser);
        // sauvegarder les data User dans le localStorage 
        localStorage.setItem('userId', dataUser.userId);
        localStorage.setItem('token', dataUser.token);
        window.location.href = "./index.html";
        }
     })
    .catch((error) => {
            console.log(error);
            alert("Une erreur est survenue Veillez contacter l'admin !");
    });
}





