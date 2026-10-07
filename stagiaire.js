// ============================================================
// stagiaire.js — CRUD Stagiaires avec JS natif
// API : http://localhost:3000/stagiaires
// ============================================================

var API = "http://localhost:3000/stagiaires";

// ---------- AFFICHER ----------

function afficherTableau() {
  fetch(API)
    .then(function(res) { return res.json(); })
    .then(function(liste) {
      var tbody = document.getElementById("tbody");
      tbody.innerHTML = "";

      if (liste.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;color:gray;'>Aucun stagiaire.</td></tr>";
        return;
      }

      for (var i = 0; i < liste.length; i++) {
        var s  = liste[i];
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + s.id + "</td>" +
          "<td>" + s.nom + " " + s.prenom + "</td>" +
          "<td>" + s.age + "</td>" +
          "<td>" + s.nInscription + "</td>" +
          "<td>" + s.filiere + "</td>" +
          "<td>" + s.groupe + "</td>" +
          "<td>" +
            "<button onclick='ouvrirModification(" + s.id + ")'>Modifier</button> " +
            "<button onclick='supprimer(" + s.id + ")' style='color:red;'>Supprimer</button>" +
          "</td>";
        tbody.appendChild(tr);
      }
    });
}

// ---------- AJOUTER ----------

function ajouter() {
  var nom          = document.getElementById("nom").value.trim();
  var prenom       = document.getElementById("prenom").value.trim();
  var age          = document.getElementById("age").value.trim();
  var nInscription = document.getElementById("nInscription").value.trim();
  var filiere      = document.getElementById("filiere").value;
  var groupe       = document.getElementById("groupe").value;

  // Validation simple
  if (nom === "" || prenom === "" || age === "" || nInscription === "" || filiere === "" || groupe === "") {
    document.getElementById("erreur").textContent = "Tous les champs sont obligatoires.";
    document.getElementById("erreur").style.display = "block";
    return;
  }
  if (isNaN(age) || age < 16 || age > 60) {
    document.getElementById("erreur").textContent = "L'age doit etre entre 16 et 60.";
    document.getElementById("erreur").style.display = "block";
    return;
  }

  document.getElementById("erreur").style.display = "none";

  var stagiaire = new Stagiaire(nom, prenom, parseInt(age), nInscription, filiere, groupe);

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stagiaire)
  })
  .then(function() {
    // Vider le formulaire
    document.getElementById("nom").value          = "";
    document.getElementById("prenom").value       = "";
    document.getElementById("age").value          = "";
    document.getElementById("nInscription").value = "";
    document.getElementById("filiere").value      = "";
    document.getElementById("groupe").value       = "";
    afficherTableau();
  });
}

// ---------- SUPPRIMER ----------

function supprimer(id) {
  if (!confirm("Supprimer ce stagiaire ?")) return;
  fetch(API + "/" + id, { method: "DELETE" })
    .then(function() { afficherTableau(); });
}

// ---------- MODIFIER ----------

function ouvrirModification(id) {
  fetch(API)
    .then(function(res) { return res.json(); })
    .then(function(liste) {
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === id) {
          var s = liste[i];
          document.getElementById("editId").value      = s.id;
          document.getElementById("editFiliere").value = s.filiere;
          document.getElementById("editGroupe").value  = s.groupe;
          document.getElementById("editNom").textContent = s.prenom + " " + s.nom;
          document.getElementById("modal").style.display = "block";
          return;
        }
      }
    });
}

function sauvegarder() {
  var id      = parseInt(document.getElementById("editId").value);
  var filiere = document.getElementById("editFiliere").value;
  var groupe  = document.getElementById("editGroupe").value;

  fetch(API + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filiere: filiere, groupe: groupe })
  })
  .then(function() {
    document.getElementById("modal").style.display = "none";
    afficherTableau();
  });
}

function fermerModal() {
  document.getElementById("modal").style.display = "none";
}


// ---------- DEMARRAGE ----------

window.onload = function() {
  afficherTableau();
};
