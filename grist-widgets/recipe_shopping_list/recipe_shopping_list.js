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

/*
Takes as parameter an array :
[ //evenement : array of repas
    [ //repas : array of recettes
        { //recette
            "nom": "Gnocchis courgettes",
			"prepare_avant": false,
			"id_session_cuisine": 0,
            "ingredients": [ //array of ingredients
				{
					"id": integer
					"nom": string,
					"qte_ing": float,
					"unite": string (abbreviation),
					"rayon": string
				},
        }
    ]
]
 */
function calculate_shopping_list(details_ingredients_evenement){
    var ingredients_a_acheter = {}

    for(repas in details_ingredients_evenement){
        for(recette in repas){
            for(ingredient_from_recette in repas.ingredients){
                nom_ing = ingredient_from_recette.nom;
                id_ing = ingredient_from_recette.id;
                qte_totale = ingredient_from_recette.qte_ing_totale;
                unite = ingredient_from_recette.unite;

                //Define rayon or generic label if no rayon
                if(ingredient_from_recette.rayon){
                    rayon = ingredient_from_recette['Ingredient']['Rayon']['nom_du_rayon'];
                }
                else{
                    rayon = "Sans rayon";
                }

                //If rayon does not exist, create it
                if( !(rayon in ingredients_a_acheter)){
                    ingredients_a_acheter[rayon] = {
                        "nom_du_rayon" : rayon,
                        "items" : {}
                    }
                }

                if( !(id_ing in ingredients_a_acheter[rayon]["items"])){
                    ingredients_contexte = {
                        "id" : id_ing,
                        "nom" : nom_ing,
                        "qte_totale" : qte_totale,
                        "unite" : unite,
                        "rayon" : rayon
                        }
                    ingredients_a_acheter[rayon]["items"][id_ing] = ingredients_contexte;
                }
                else{
                    ingredients_a_acheter[rayon]["items"][id_ing]['qte_totale'] += qte_totale;
                }
                
            }
        }
    }

    return ingredients_a_acheter;
}

function generate_shopping_list_HTML(shopping_list){
    console.log("SHOPPING LIST");

    var html_shopping_list = "";
    //shopping_list = JSON.parse(shopping_list);
    console.log(typeof(shopping_list));
    console.log(shopping_list);

    for(rayon in shopping_list){
        console.log("LOG RAYON");
        console.log(rayon);
        console.log(typeof(shopping_list[rayon]));
        console.log(shopping_list[rayon]);
        
        //console.log(shopping_list_items)

        html_shopping_list += '<table style="display:inline-block; width:49%; vertical-align:top; margin-bottom:100px;">';
        html_shopping_list += '<thead>';
        html_shopping_list += '<tr>'
        html_shopping_list += '<th colspan="2" style="font-size:20px;">'+shopping_list[rayon]["nom_du_rayon"]+'</th>';
        html_shopping_list += '</tr></thead>';
        html_shopping_list += '<tbody>';

        var shopping_list_items = shopping_list[rayon]['items'];

        for(item in shopping_list_items){
            console.log("ITEM");
            console.log(shopping_list_items[item]);
            html_shopping_list += "<tr>";
            html_shopping_list += "<td>"+shopping_list_items[item]['nom']+"</td>";
            html_shopping_list += "<td>"+shopping_list_items[item]['qte_totale']+" "+shopping_list_items[item]['unite']+"</td>";
            html_shopping_list += "</tr>"
        }
        html_shopping_list += '</tbody>';
    }

    document.getElementById('shopping_list').innerHTML = html_shopping_list;
    
}

const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

ready(function(){
    console.log("GOGOGO");
    grist.ready({columns: [
            {
                name:'details_ingredients',
                title:'Détails des ingrédients nécessaires sur l\'événement',
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
            {
                name:'sessions_prepa_liees',
                title:'Sessions de cuisine liées',
                optional: false,
            },
        ], requiredAccess: 'read table'});
    grist.onRecord(function (row, mappings){
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


                var shopping_list = calculate_shopping_list(mapped.details_ingredients)

                // -------------------------------------
                //var shopping_list = mapped.shopping_list;
                // -------------------------------------
                
                document.getElementById("generate_shopping_list").addEventListener("click", () => generate_shopping_list_HTML(shopping_list));
                
    
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
