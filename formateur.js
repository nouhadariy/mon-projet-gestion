// ============================================================
// formateur.js — CRUD Formateurs avec jQuery
// API : http://localhost:3000/formateurs
// ============================================================

var API = "http://localhost:3000/formateurs";

// ---------- AFFICHER ----------

function afficherTableau() {
  $.get(API, function(liste) {
    var tbody = $("#tbody");
    tbody.empty();

    if (liste.length === 0) {
      tbody.html("<tr><td colspan='7' style='text-align:center;color:gray;'>Aucun formateur.</td></tr>");
      return;
    }

    for (var i = 0; i < liste.length; i++) {
      var f = liste[i];
      tbody.append(
        "<tr>" +
          "<td>" + f.id + "</td>" +
          "<td>" + f.nom + " " + f.prenom + "</td>" +
          "<td>" + f.age + "</td>" +
          "<td>" + f.matricule + "</td>" +
          "<td>" + f.specialite + "</td>" +
          "<td>" + f.email + "</td>" +
          "<td>" +
            "<button onclick='ouvrirModification(" + f.id + ")'>Modifier</button> " +
            "<button onclick='supprimer(" + f.id + ")' style='color:red;'>Supprimer</button>" +
          "</td>" +
        "</tr>"
      );
    }
  });
}

// ---------- AJOUTER ----------

function ajouter() {
  var nom        = $("#nom").val().trim();
  var prenom     = $("#prenom").val().trim();
  var age        = $("#age").val().trim();
  var matricule  = $("#matricule").val().trim();
  var specialite = $("#specialite").val();
  var email      = $("#email").val().trim();

  // Validation simple
  if (nom === "" || prenom === "" || age === "" || matricule === "" || specialite === "" || email === "") {
    $("#erreur").text("Tous les champs sont obligatoires.").show();
    return;
  }
  if (isNaN(age) || age < 20 || age > 70) {
    $("#erreur").text("L'age doit etre entre 20 et 70.").show();
    return;
  }
  if (!email.includes("@")) {
    $("#erreur").text("L'email est invalide.").show();
    return;
  }

  $("#erreur").hide();

  var formateur = new Formateur(nom, prenom, parseInt(age), matricule, specialite, email);

  $.ajax({
    url: API,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formateur),
    success: function() {
      $("#nom, #prenom, #age, #matricule, #email").val("");
      $("#specialite").val("");
      afficherTableau();
    }
  });
}

// ---------- SUPPRIMER ----------

function supprimer(id) {
  if (!confirm("Supprimer ce formateur ?")) return;
  $.ajax({
    url: API + "/" + id,
    method: "DELETE",
    success: function() { afficherTableau(); }
  });
}

// ---------- MODIFIER ----------

function ouvrirModification(id) {
  $.get(API, function(liste) {
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].id === id) {
        var f = liste[i];
        $("#editId").val(f.id);
        $("#editSpecialite").val(f.specialite);
        $("#editAge").val(f.age);
        $("#editNom").text(f.prenom + " " + f.nom);
        $("#modal").show();
        return;
      }
    }
  });
}

function sauvegarder() {
  var id         = parseInt($("#editId").val());
  var specialite = $("#editSpecialite").val();
  var age        = parseInt($("#editAge").val());

  $.ajax({
    url: API + "/" + id,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ specialite: specialite, age: age }),
    success: function() {
      $("#modal").hide();
      afficherTableau();
    }
  });
}

function fermerModal() {
  $("#modal").hide();
}


// ---------- DEMARRAGE ----------

$(document).ready(function() {
  afficherTableau();
});
