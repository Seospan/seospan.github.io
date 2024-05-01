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

                var html_repas = "";
                for(repas of details_repas){
                    console.log("rrr");
                    console.log(repas);
                    html_repas += repas.nom;
                }

                document.getElementById('texte_recette').innerHTML = html_repas;

                //var data_string = JSON.stringify( mapped.recette);

                /*document.getElementById('evenement_repas').innerHTML = mapped.evenement_lie + " - Repas : " + mapped.repas_lie ;
                document.getElementById('session_cuisine').innerHTML = "[" + mapped.session_cuisine + "]";

                document.getElementById('title').innerHTML = mapped.recette.Nom;
                if(mapped.recette.Is_vegetarien){
                    document.getElementById('is_vege').innerHTML = 'Vegetarien : <span style="color:green"> ✓ Oui</span>';
                }else{
                    document.getElementById('is_vege').innerHTML = 'Vegetarien : <span style="color:red"> ✕ Non</span>';
                }
    
                if(mapped.recette.Is_vegan){
                    document.getElementById('is_vegan').innerHTML = 'Vegan : <span style="color:green"> ✓ Oui</span>';
                }else{
                    document.getElementById('is_vegan').innerHTML = 'Vegan : <span style="color:red"> ✕ Non</span>';
                }
    
                document.getElementById('nb_portions').innerHTML = ' Pour : '+mapped.nb_portions+' personnes';
                document.getElementById('multip_recette').innerHTML = ' Représente '+mapped.multip_recette+' x la recette originale';

                document.getElementById('texte_recette').innerHTML = mapped.recette.Texte;

                var html_ingredients_list = "";
                for(ingredient_in_recipe of mapped.ingredients){
                    html_ingredients_list += "<tr>";
                    html_ingredients_list += "<td>" + ingredient_in_recipe.Ingredient.Nom + "</td>";
                    var ingredient_scaled = ingredient_in_recipe.qte_par_personne * mapped.nb_portions;
                    html_ingredients_list += "<td>" + ingredient_scaled + ingredient_in_recipe.Ingredient.Unite.Abbreviation + "</td>";
                }

                document.getElementById('ingredients_table_body').innerHTML = html_ingredients_list;*/
    
    
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
