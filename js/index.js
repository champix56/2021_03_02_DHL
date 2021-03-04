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
 * @param {String} postitDOM  Document du template xhtml de la vue postit
 * @param {Postit} postitValues objet comprennant les valeurs d'un postit a afficher
 */
function makePostIt(postitString, postitValues) {
    /*/recuperation du postit model pour la creation des autres postit a remplir
    //clone permet d'obtenir un double non lié a l'element d'origine
    var postitNode = document.querySelector('.post-it').cloneNode(true);*/
    var postitNode = document.createElement('div');
    postitNode.innerHTML=postitString; 
    //composition d'un post it rempli avec les valeurs recus en argument d'entree de fonction
    postitNode.querySelector('.post-it-titre').innerHTML = postitValues.titre;
    postitNode.querySelector('.post-it-adresse').innerHTML = postitValues.adresse;
    postitNode.querySelector('.post-it-mail').innerHTML = postitValues.mail;
    postitNode.querySelector('.post-it-date').innerHTML = 'Le ' + postitValues.date + ' a ' + postitValues.heure;
    postitNode.querySelector('.post-it-description').innerHTML = postitValues.description;
    postitNode.querySelector('.post-it-auteur').innerHTML = postitValues.auteurId;

    //ajout à la fin de la liste du document de template postit rempli 
    document.querySelector('#post-it-liste').append(postitNode.firstChild);
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
    //construction du postit de facon asynchrone par appel de callback
    getTemplateView('postit.xhtml',
        function (responseDocument) {
            makePostIt(responseDocument,postitValues);
        }
    );
    //reset du contenu du form
    //evt.target.reset();
}
//connexion de la fonction de gestion de l'event submit au formulaire
document.forms['mon-form'].addEventListener('submit', onformsubmit);

/**
 * fonction de recuperation http
 * @param {*} templateFileName 
 */
function getTemplateView(templateFileName, callback) {
    //etape 1 obtention d'un objet xhr
    var xhr = new XMLHttpRequest();
    //etape 2 preparation de la requete
    xhr.open('GET', 'vues/' + templateFileName);
    //etape 3 definition du contenu a executer 
    //à chaques changements d'etat dexecution
    xhr.onreadystatechange = function (evt) {
        //requete pas achevé donc sortie de la fonction
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        //status different de OK message puis sortie de fonction
        if (xhr.status !== 200) {
            console.log('ERROR XHR ' + xhr.responseURL + ' --> ' + xhr.status + ':' + xhr.statusText);
            return;
        }
        //console.log(evt.target);
        callback(xhr.response);
    };
    //etape 4
    xhr.send();
}
// getTemplateView('postit.html');

