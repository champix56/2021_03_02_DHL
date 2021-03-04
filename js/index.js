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

/**
 * verifie le remplissage du formulaire
 * @returns Boolean faux des qu'un champs est vide
 */
function isFormFullFill() {
    for (var input of document.forms['mon-form']) {
        if (input.localName !== 'button' && input.value === '') {
            input.style.backgroundColor = "tomato";
            return false;
        } 
        else {
            if (!input.classList.contains('btn')) input.style.backgroundColor = "white";
        }
    }
    return true;
}

function getFormulaire() {
    //access a la balise form par document.forms
    var formulaire = document.forms['mon-form'];
    //constitution d'un objet avec les champs issue du forms
    var unPostIt = {
        titre: formulaire['form-titre'].value,
        auteurId: formulaire['form-auteur'].value,
        date: formulaire['form-date'].value,
        heure: formulaire['form-hour'].value,
        adresse: formulaire['form-adresse'].value,
        mail: formulaire['form-email'].value,
        description: formulaire['form-description'].value
    }
    console.log(unPostIt);
    return unPostIt;
}
/**
 * Clone d'un postit modele et remplissage des valeurs puis ajout à la liste
 * @param {Postit} postitValues objet comprennant les valeurs d'un postit a afficher
 */
function makePostIt(postitValues) {
    //recuperation du postit model pour la creation des autres postit a remplir
    //clone permet d'obtenir un double non lié a l'element d'origine
    var postitNode = document.querySelector('.post-it').cloneNode(true);
    //composition d'un post it rempli avec les valeurs recus en argument d'entree de fonction
    postitNode.querySelector('.post-it-titre').innerText = postitValues.titre;
    postitNode.querySelector('.post-it-adresse').innerText = postitValues.adresse;
    postitNode.querySelector('.post-it-mail').innerText = postitValues.mail;
    postitNode.querySelector('.post-it-date').innerText = 'Le ' + postitValues.date + ' a ' + postitValues.heure;
    postitNode.querySelector('.post-it-description').innerText = postitValues.description;
    postitNode.querySelector('.post-it-auteur').innerText = postitValues.auteurId;

    //ajout à la fin de la liste du postit cloné et rempli 
    document.querySelector('#post-it-liste').append(postitNode);
}
/**
 * fonction de soumission du formulaire de saisie
 * @param {FormEvent} evt evenement du formulaire
 */
function onformsubmit(evt) {
    //arret de l'execution par defaut de la soumission (rechargement de page)
    evt.preventDefault();
    //si le formulaire est pas rempli je sors de cette fonction
    if (!isFormFullFill()) return;
    //recuperation des valeur dans le formulaire
    var postitValues = getFormulaire();
    //creation du postit rempli
    makePostIt(postitValues);
    //reset du contenu du form
    evt.target.reset();
}
//connexion de la fonction de gestion de l'event submit au formulaire
document.forms['mon-form'].addEventListener('submit', onformsubmit);