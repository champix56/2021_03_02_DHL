function jsIsLoaded() {
    // chargement dans une variable de la balise <div id="jsLoaded">...</div>
    var jsloaded = document.querySelector("#jsLoaded");

    //moddif du style css de la balise
    jsloaded.style.backgroundColor = "skyblue";

    //moddif du contenu textuelle de la balise
    jsloaded.innerText = "Le js est chargé";

    console.log("Le fichier index.js a fini d'etre executer");

    console.log('essaie');

}

jsIsLoaded();

function logFormulaire() {
    var formulaire = document.forms['mon-form'];
    console.log('titre :', formulaire['form-titre'].value);
    console.log('auteurId :', formulaire['form-auteur'].value);
    console.log('date :', formulaire['form-date'].value);
    console.log('heure :', formulaire['form-hour'].value);
    console.log('adresse :', formulaire['form-adresse'].value);
    console.log('email', document.querySelector('form #form-email').value);
    console.log('description', formulaire['form-description'].value);
}