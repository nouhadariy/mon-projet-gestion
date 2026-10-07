// ============================================================
// server.js  —  Backend Node.js
// Lance avec : node server.js
// Ouvrir : http://localhost:3000
// ============================================================

var http = require("http");
var fs   = require("fs");

var PORT = 3000;

var DB_STAGIAIRES  = "./stagiaires.json";
var DB_FORMATEURS  = "./formateurs.json";


// ---------- HELPERS ----------

function lire(fichier) {
  var texte = fs.readFileSync(fichier, "utf8").trim();
  if (texte === "") return [];
  return JSON.parse(texte);
}

function sauvegarder(fichier, data) {
  fs.writeFileSync(fichier, JSON.stringify(data, null, 2));
}

function nouveauId(liste) {
  if (liste.length === 0) return 1;
  var max = 0;
  for (var i = 0; i < liste.length; i++) {
    if (liste[i].id > max) max = liste[i].id;
  }
  return max + 1;
}

function lireBody(req, callback) {
  var body = "";
  req.on("data", function(chunk) { body += chunk; });
  req.on("end", function() {
    try { callback(JSON.parse(body)); }
    catch(e) { callback({}); }
  });
}

function json(res, code, data) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function fichierStatique(res, chemin) {
  if (!fs.existsSync(chemin)) {
    res.writeHead(404);
    res.end("Fichier non trouve : " + chemin);
    return;
  }
  var ext = chemin.split(".").pop();
  var types = { html: "text/html", js: "text/javascript", json: "application/json", css: "text/css" };
  res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
  res.end(fs.readFileSync(chemin));
}


// ---------- SERVEUR ----------

http.createServer(function(req, res) {

  var chemin  = req.url.split("?")[0];
  var methode = req.method;

  // CORS
  if (methode === "OPTIONS") { json(res, 200, {}); return; }

  // ===== STAGIAIRES =====

  if (chemin === "/stagiaires" && methode === "GET") {
    json(res, 200, lire(DB_STAGIAIRES));

  } else if (chemin === "/stagiaires" && methode === "POST") {
    lireBody(req, function(data) {
      var liste = lire(DB_STAGIAIRES);
      data.id = nouveauId(liste);
      liste.push(data);
      sauvegarder(DB_STAGIAIRES, liste);
      json(res, 201, data);
    });

  } else if (chemin.startsWith("/stagiaires/") && methode === "PUT") {
    var id = parseInt(chemin.split("/")[2]);
    lireBody(req, function(data) {
      var liste = lire(DB_STAGIAIRES);
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === id) {
          liste[i].filiere = data.filiere;
          liste[i].groupe  = data.groupe;
          sauvegarder(DB_STAGIAIRES, liste);
          json(res, 200, liste[i]);
          return;
        }
      }
      json(res, 404, { erreur: "Non trouve" });
    });

  } else if (chemin.startsWith("/stagiaires/") && methode === "DELETE") {
    var id = parseInt(chemin.split("/")[2]);
    var liste = lire(DB_STAGIAIRES);
    var nouvelle = liste.filter(function(s) { return s.id !== id; });
    if (nouvelle.length === liste.length) { json(res, 404, { erreur: "Non trouve" }); return; }
    sauvegarder(DB_STAGIAIRES, nouvelle);
    json(res, 200, { message: "Supprime" });

  // ===== FORMATEURS =====

  } else if (chemin === "/formateurs" && methode === "GET") {
    json(res, 200, lire(DB_FORMATEURS));

  } else if (chemin === "/formateurs" && methode === "POST") {
    lireBody(req, function(data) {
      var liste = lire(DB_FORMATEURS);
      data.id = nouveauId(liste);
      liste.push(data);
      sauvegarder(DB_FORMATEURS, liste);
      json(res, 201, data);
    });

  } else if (chemin.startsWith("/formateurs/") && methode === "PUT") {
    var id = parseInt(chemin.split("/")[2]);
    lireBody(req, function(data) {
      var liste = lire(DB_FORMATEURS);
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === id) {
          liste[i].specialite = data.specialite;
          liste[i].age        = data.age;
          sauvegarder(DB_FORMATEURS, liste);
          json(res, 200, liste[i]);
          return;
        }
      }
      json(res, 404, { erreur: "Non trouve" });
    });

  } else if (chemin.startsWith("/formateurs/") && methode === "DELETE") {
    var id = parseInt(chemin.split("/")[2]);
    var liste = lire(DB_FORMATEURS);
    var nouvelle = liste.filter(function(f) { return f.id !== id; });
    if (nouvelle.length === liste.length) { json(res, 404, { erreur: "Non trouve" }); return; }
    sauvegarder(DB_FORMATEURS, nouvelle);
    json(res, 200, { message: "Supprime" });

  // ===== FICHIERS STATIQUES =====

  } else if (methode === "GET") {
    var fichier = chemin === "/" ? "./index.html" : "." + chemin;
    fichierStatique(res, fichier);

  } else {
    json(res, 404, { erreur: "Route non trouvee" });
  }

}).listen(PORT, function() {
  console.log("Serveur demarre sur http://localhost:" + PORT);
});
