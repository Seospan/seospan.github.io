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
                name:'recette',
                title:'Recette',
                optional: false,
            },
            {
                name:'nb_portions',
                title:'Nb de portions',
                optional: false,
            },
            {
                name:'multip_recette',
                title:'Multiplicateur de la recette',
                optional: false,
            },
            {
                name:'ingredients',
                title:'Liste des records d\'ingredients',
                optional: false,
            },
            {
                name:'repas_lie',
                title:'Repas lié',
                optional: false,
            },
            {
                name:'session_cuisine',
                title:'Session de cuisine',
                optional: false,
            },
            {
                name:'evenement_lie',
                title:'Evénement lié',
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
                console.log(repas_lie);
                console.log(evenement_lie);
                console.log(mappings);
                console.log(mapped.recette);
                console.log(mapped.ingredients);

                var data_string = JSON.stringify( mapped.recette);
                
                //document.getElementById('alpine').setAttribute('x-data',JSON.stringify( mapped.recette) );

                document.getElementById('evenement_repas').innerHTML = mapped.repas_lie + " - Repas : " + mapped.evenement_lie ;
                document.getElementById('session_cuisine').innerHTML = mapped.session_cuisine;

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

                document.getElementById('ingredients_table_body').innerHTML = html_ingredients_list;
    
    
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
