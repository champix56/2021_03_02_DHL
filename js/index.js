var srvAdresse = 'http://localhost:5629';
var postItCrud = new Crud(srvAdresse);

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
 * @param {Document} postitDOM  Document du template xhtml de la vue postit
 * @param {Postit} postitValues objet comprennant les valeurs d'un postit a afficher
 */
function makePostIt(postitDOM, postitValues) {
    /*/recuperation du postit model pour la creation des autres postit a remplir
    //clone permet d'obtenir un double non lié a l'element d'origine
    var postitNode = document.querySelector('.post-it').cloneNode(true);*/
    var postitNode = document.createElement('div');
    //remplissage du contenu de la balise div vide par tout le contenu de la premiere balise de postitDOM
    postitNode.innerHTML = postitDOM.firstChild.outerHTML;
    //composition d'un post it rempli avec les valeurs recus en argument d'entree de fonction
    postitNode.querySelector('.post-it-titre').innerHTML = postitValues.titre;
    postitNode.querySelector('.post-it-adresse').innerHTML = postitValues.adresse;
    postitNode.querySelector('.post-it-mail').innerHTML = postitValues.mail;
    postitNode.querySelector('.post-it-date').innerHTML = 'Le <b>' + postitValues.date + '</b> a ' + postitValues.heure;
    postitNode.querySelector('.post-it-description').innerHTML = postitValues.description;
    postitNode.querySelector('.post-it-auteur').innerHTML = postitValues.auteurId;
    postitNode.querySelector('.container-close-img img').addEventListener('dblclick', function (evt) {
        if (confirm('want you delete postit ?')) {
            alert('It will (smith) :)');
            console.log('le click est sur le postit :', postitValues);
            console.log('le click est sur le DOM node :', evt.currentTarget);
            postItCrud.del('/postits/' + postitValues.id, function (response) {
                evt.path[2].remove();
                console.log('deleted postit on REST server and in DOM :', postitValues);
            });
        }
        // else alert('it will not be delete');
    });
    //supression puis mise en affichage dans le form apres suppression pour editer une note
    postitNode.querySelector('.post-it').addEventListener('dblclick',function (evt) {
        //suppression du postit
        postItCrud.del('/postits/' + postitValues.id, function (response) {
           evt.target.remove();
           //supression du champ id 
           //delete postitValues.id;
           putPostItInForm(postitValues);     
        });
    });
    //ajout à la fin de la liste du document de template postit rempli 
    document.querySelector('#post-it-liste').append(postitNode.firstChild);
}
/**
 * affiche dans le formulaire les valeurs fournis dans values
 * @param {Postit} values objet js postit pour remplissage du formulaire 
 */
function putPostItInForm(values) {
    //selection du formulaire
    var form=document.forms['mon-form'];
    //attribution de la value pour chacun des champ a partir de la valeur dans l'arg d'entree
    form['form-titre'].value=values.titre;
    form['form-date'].value=values.date;
    form['form-adresse'].value=values.adresse;
    form['form-email'].value=values.mail;
    form['form-hour'].value=values.heure;
    form['form-description'].value=values.description;
    form['form-auteur'].value=values.auteurId;
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
   //envoie au serveur du postit (ATTENTION le body est une chaine JSON pas un object JS)
   //JSON.strigify(jsObject) pour convertir un object en chaine json
    postItCrud.post('/postits', function (responseValues) {
        //recuperation async (xhr)du template de postit avec fonction de traitement du retour positif
        getTemplateView('postit.xhtml',
            function (responseDocument) {
                 //construction du postit de facon asynchrone par appel de callback basé sur les valeurs de postit recu par le POST sous forme de chaine JSON
                 //donc a convertir en js Object grace a JSON.parse(jsonString)
                makePostIt(responseDocument, JSON.parse(responseValues));
                //vidange du formulaire
                evt.target.reset();
            }
        );
    }, JSON.stringify(postitValues));
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
        //constitution d'un Document avec la chaine par un DOMparser
        var postitDocParser = new DOMParser();
        var postitDoc = postitDocParser.parseFromString(xhr.responseText, 'application/xml');

        callback(postitDoc);
    };
    //etape 4
    xhr.send();
}
// getTemplateView('postit.html');

/**
 * fonction de chargement de la liste postit et creation des postit dans le dom avec les valeurs recus
 */
function loadPostIt() {
    //appel de la fonction get de l'objet, necessitant une fonction de traitement de la reponse en argument d'entree de l'appel de fonction 
    postItCrud.get('/postits', function (responseJSON) {
        //je transforme la chaine json recu en veritable objet javascript
        var postits = JSON.parse(responseJSON);
        //je charge le model html d'un postit, appel necessitant une fonction de traitement de la reponse en argument d'entree
        getTemplateView('postit.xhtml', function (responseDoc) {
            //dans la liste des postits, pour chaque element 
            postits.forEach(function (elem) {
                //je creer le postit pour l'element parcouru du foreach
                makePostIt(responseDoc, elem);
            });
        });
    });
}
loadPostIt();