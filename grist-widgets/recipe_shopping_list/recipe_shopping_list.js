function ready(fn) {
    if (document.readyState !== 'loading'){
      console.log("DOC READY")
      fn();
    } else {
      console.log("DOC NOTT READY : "+document.readyState)
      document.addEventListener('DOMContentLoaded', fn);
    }
}

function handleError(err) {
    console.error(err);
    console.log("ERROR");
}

function recipeToHTML(nom_evenement, recette_contexte, repas_lie){

    note_contexte_recette = recette_contexte.note_contexte_recette;
    nom_session_cuisine = recette_contexte.nom_session_cuisine;
    recette = recette_contexte.details_recette;
    nb_portions = recette_contexte.nb_portions;
    multip_recette = recette_contexte.nb_portions / recette_contexte.details_recette.Nombre_de_personnes;
    recipe_ingredients = recette_contexte.ingredients;
    //console.log("MAPPED");
    //console.log(mapped.repas_lie);
    //console.log(mapped.evenement_lie);
    //console.log(mapped.recette);
    //console.log(mapped.ingredients);

    var html_recette="";

    html_recette += '<div id="evenement_repas" style="float: left; text-align:left">'+nom_evenement +" - " + repas.date + " - Repas : " + repas_lie.nom+'</div>';
    html_recette += '<div id="session_cuisine" style="float: right; text-align:left">'+"Prépa : [" + nom_session_cuisine + "]"+'</div>';
    html_recette += '<div style="clear:both;"></div>';
    html_recette += '<h2 id="title" style="text-align:center; margin-bottom : 40px; margin-top:50px">'+recette.Nom+'</h2>';
    html_recette += '<div style="width:100%">';
    html_recette += '<div style="display:inline-block; width:49%; vertical-align:top;">';

    if(recette.Is_vegetarien){
        html_recette += '<h4 id="is_vege">Vegetarien : <span style="color:green"> ✓ Oui</span></h4>';
    }else{
        html_recette += '<h4 id="is_vege">Vegetarien : <span style="color:red"> ✕ Non</span></h4>';
    }

    if(recette.Is_vegan){
        html_recette += '<h4 id="is_vegan">'+'Vegan : <span style="color:green"> ✓ Oui</span>'+'</h4>';
    }else{
        html_recette += '<h4 id="is_vegan">'+'Vegan : <span style="color:red"> ✕ Non</span>'+'</h4>';
    }

    html_recette += '<h4 id="nb_portions"> Pour : '+nb_portions+' personnes</h4>';

    html_recette += '<h4 id="estim_duree"> Estimation : '+recette.Duree_de_preparation_estimee+' de prepa</h4>';

    html_recette += '<h4 id="multip_recette"> Représente '+multip_recette+' x la recette originale</h4>';

    html_recette += 'Notes : '+note_contexte_recette;

    html_recette += '</div>';


    html_recette += '<table style="display:inline-block; width:49%; vertical-align:top;">';
    html_recette += '<thead>';
    html_recette += '<tr>';
    html_recette += '<th colspan="2">Ingredients</th>';
    html_recette += '</tr>';
    html_recette += '</thead>';
    html_recette += '<tbody id="ingredients_table_body">';

    var html_ingredients_list = "";
    for(ingredient_in_recipe of recipe_ingredients){
        html_ingredients_list += "<tr>";
        html_ingredients_list += "<td>" + ingredient_in_recipe.Ingredient.Nom + "</td>";
        var ingredient_scaled = (ingredient_in_recipe.qte_par_personne * nb_portions).toFixed(2);
        html_ingredients_list += "<td>" + ingredient_scaled + ingredient_in_recipe.Ingredient.Unite.Abbreviation + "</td>";
    }

    html_recette += html_ingredients_list;
    html_recette += '</tbody>';
    html_recette += '</table>';

    html_recette += '<p id="texte_recette" style="white-space: pre-line; font-size : 1.5em; line-height: 150%;">'+recette.Texte+'</p>';

    html_recette += '<div style="break-after:page"></div>';
    return(html_recette);
}

const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

ready(function(){
    console.log("GOGOGO");
    grist.ready({columns: [
            {
                name:'shopping_list',
                title:'Liste de courses',
                optional: false,
            },
            {
                name:'date_debut',
                title:'Date de début',
                optional: false,
            },
            {
                name:'date_fin',
                title:'Date de fin',
                optional: false,
            },
            {
                name:'nom_event',
                title:'Nom de l\'événement',
                optional: false,
            },
            {
                name:'taille_public',
                title:'Taille du public',
                optional: false,
            },
        ], requiredAccess: 'read table'});
    grist.onRecord(function (row, mappings){
        console.log("TESTlyyg");
        //console.log("row " + row);
        //console.log("mappings" + mappings);
    
        try {
            if (row === null) {
                throw new Error("(No data - not on row - please add or select a row)");
            }
            console.log("GOT...", JSON.stringify(row));
            if (row.References) {
                try {
                Object.assign(row, row.References);
                } catch (err) {
                throw new Error('Could not understand References column. ' + err);
                }
            }
        
            const mapped = grist.mapColumnNames(row);
            // First check if all columns were mapped.
            if (mapped) {
                //console.log("MAPPED");
                //console.log(mapped.details_repas);
                //console.log(mappings);
                console.log("DATE");
                console.log(mapped.date_debut);

                document.getElementById('nom_evenement').innerHTML = mapped.nom_event;
                document.getElementById('dates_evenement').innerHTML = "Du " + mapped.date_debut.toLocaleDateString("fr-FR",date_options) + " au " + mapped.date_fin.toLocaleDateString("fr-FR",date_options) ;
                document.getElementById('estim_nb_public').innerHTML = mapped.taille_public;

                var shopping_list = mapped.shopping_list;
                console.log("SHOPPING LIST");
                console.log(typeof(shopping_list));
                console.log(shopping_list);

                var html_shopping_list = "";
                //for(rayon of shopping_list){
                  //  console.log("LOG RAYON");
                   // console.log(rayon);

                 //   html_shopping_list += rayon.Nom



                    /*var json_details_recettes = JSON.parse(repas.details_recettes);
                    console.log("DETAILS RECETTES");
                    console.log(json_details_recettes);
                    for(recette_contexte of json_details_recettes){
                        console.log("UNE RECETTE");
                        console.log(recette_contexte);
                        html_repas += recipeToHTML(mapped.nom_event, recette_contexte, repas);
                    }*/


                //}


                document.getElementById('shopping_list').innerHTML = html_shopping_list;
    
    
                console.log(`Using ${mappings.Titre} and ${mappings.Texte} columns`);
            } else {
                // Helper returned a null value. It means that not all
                // required columns were mapped.
                console.error("Please map all columns");
            }
    
        } catch (err) {
            handleError(err);
        }
    
    });
})
