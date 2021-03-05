/**
 * Object de manipulation de data avec Rest
 * @param {URL} adresseSrv adresse de base du serveur REST 
 */
function Crud(adresseSrv) {
    /**
     * 
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
    */
    this.get = function (ressource, callback) {
        console.log('get called');
        callXhr('GET', ressource, callback);
    }
    /**
     * appel XHR method post
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
     * @param {String} body facultatif String json de l'objet (JSON.stringify(object) ou '{"key":"value"}')
    */
    this.post = function (ressource, callback, body) {
        callXhr('GET', ressource, callback, body);
    }
    /**
     * appel XHR method put
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
     * @param {String?} body facultatif String json de l'objet (JSON.stringify(object) ou '{"key":"value"}')
     */
    this.put = function (ressource, callback, body) {
        callXhr('PUT', ressource, callback, body);
    }
    /**
     * appel XHR method patch
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
     * @param {String} body facultatif String json de l'objet (JSON.stringify(object) ou '{"key":"value"}')
     */
    this.patch = function (ressource, callback, body) {
        callXhr('PATCH', ressource, callback, body);
    }
    /**
     * appel XHR method delete
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
     */
    this.del = function (ressource, callback) {
        callXhr('DELETE', ressource, callback);
    }
    /**
     * manipulation generique d'un appel XHR (methode privé a l'objet CRUD)
     * @param {String} method method HTTP GET POST PUT PATCH DELETE
     * @param {String} ressource Adresse de la ressource ex: /postits ou /postit/1
     * @param {Function} callback function
     * @param {String?} body facultatif String json de l'objet (JSON.stringify(object) ou '{"key":"value"}')
     */
    function callXhr(method, ressource, callback, body) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, adresseSrv + ressource);
        //le contenu envoyée
        xhr.setRequestHeader('Content-Type', 'application/json');
        //type de contenu attendu dans la reponse (facultatif sur json-server)
        xhr.setRequestHeader('Accept', 'application/json');
        //gestion de l'evenement de changement d'etat d'execution
        xhr.onreadystatechange = function (evt) {
            //requete en cours
            if (xhr.readyState < XMLHttpRequest.DONE) return;
            //requete en erreur
            if (xhr.status !== 200 && xhr.status !== 201) return;
            //requete achevée et sans erreur
            callback(xhr.response);
        }
        //envoie avec le contenu (si pas de contenu body vau undefined)
        xhr.send(body);
    }

}
var crud = new Crud('http://localhost:5629');