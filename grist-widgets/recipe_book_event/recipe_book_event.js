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

/*function updateRecipe(row, mappings){
    console.log("TESTlyy");
    console.log("row " + row);
    console.log("mappings" + mappings);
    console.log("arg : " + arguments);


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
            console.log(mappings);
            document.getElementById('title').src = mapped.Titre;
            document.getElementById('text').innerText = mapped.Texte;
            if(mapped.is_vege){
                document.getElementById('is_vege').innerText = 'Vegetarien : <span style="color:green"> ✓ Oui</span>';
            }else{
                document.getElementById('is_vege').innerText = 'Vegetarien : <span style="color:red"> ✕ Non</span>';
            }

            if(mapped.is_vegan){
                document.getElementById('is_vegan').innerText = 'Vegan : <span style="color:green"> ✓ Oui</span>';
            }else{
                document.getElementById('is_vegan').innerText = 'Vegan : <span style="color:red"> ✕ Non</span>';
            }

            if(mapped.is_lactose_free){
                document.getElementById('is_lactose_free').innerText = ' Sans lactose <span style="color:green"> ✓ Oui</span>';
            }else{
                document.getElementById('is_lactose_free').innerText = 'Sans lactose <span style="color:red"> ✕ Non</span>';
            }

            document.getElementById('nb_convives').innerText = ' Pour : <?= data[i].scale ?> personnes'


            console.log(`Using ${mappings.Titre} and ${mappings.Texte} columns`);
        } else {
            // Helper returned a null value. It means that not all
            // required columns were mapped.
            console.error("Please map all columns");
        }

    } catch (err) {
        handleError(err);
    }

}*/

function recipeToHTML(nom_evenement, nom_session_cuisine, recette, nb_portions, multip_recette, recipe_ingredients, repas_lie){

    //console.log("MAPPED");
    //console.log(mapped.repas_lie);
    //console.log(mapped.evenement_lie);
    //console.log(mapped.recette);
    //console.log(mapped.ingredients);

    var html_recette="";

    html_recette += '<div id="evenement_repas" style="float: left; text-align:left">'+nom_evenement + " - Repas : " + repas_lie+'</div>';
    html_recette += '<div id="session_cuisine" style="float: right; text-align:left">'+"[" + nom_session_cuisine + "]"+'</div>';
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

    html_recette += '<h4 id="multip_recette"> Représente '+multip_recette+' x la recette originale</h4>';

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
        var ingredient_scaled = ingredient_in_recipe.qte_par_personne * nb_portions;
        html_ingredients_list += "<td>" + ingredient_scaled + ingredient_in_recipe.Ingredient.Unite.Abbreviation + "</td>";
    }

    html_recette += html_ingredients_list;
    html_recette += '</tbody>';
    html_recette += '</table>';

    html_recette += '<p id="texte_recette" style="white-space: pre-line; font-size : 1.5em; line-height: 150%;">'+recette.Texte+'</p>';

    return(html_recette);
}


ready(function(){
    console.log("GOGOGO");
    grist.ready({columns: [
            {
                name:'details_repas',
                title:'Détails des repas liés',
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
                console.log("MAPPED");
                console.log(mapped.details_repas);
                console.log(mappings);

                var details_repas = JSON.parse(mapped.details_repas);
                console.log("ooo");
                console.log(details_repas);

                var html_repas = "";
                for(repas of details_repas){
                    console.log("REPAS");
                    console.log(JSON.parse(repas.details_recette));
                    //recipeToHTML(nom_evenement, nom_session_cuisine, recette, nb_portions, multip_recette, recipe_ingredients, repas_lie){

                    html_repas += repas.nom;
                }

                document.getElementById('texte_recette').innerHTML = html_repas;
    
    
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
