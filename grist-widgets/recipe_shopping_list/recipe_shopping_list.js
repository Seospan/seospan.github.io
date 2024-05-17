$( document ).ready(function() {

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
    function calculate_shopping_list(details_ingredients_evenement, sessions_to_include, include_on_site_recipes){

        details_ingredients_evenement = filter_by_checkboxes(details_ingredients_evenement, sessions_to_include, include_on_site_recipes)

        var ingredients_a_acheter = {}

        console.log("details");
        console.log(details_ingredients_evenement)

        for(repas of details_ingredients_evenement){
            for(recette of repas){
                for(ingredient_from_recette of recette.ingredients){
                    console.log("Entering ingredient");
                    nom_ing = ingredient_from_recette.nom;
                    id_ing = ingredient_from_recette.id;
                    qte_totale = ingredient_from_recette.qte_ing_totale;
                    unite = ingredient_from_recette.unite;

                    //Define rayon or generic label if no rayon
                    if(ingredient_from_recette.rayon){
                        rayon = ingredient_from_recette.rayon;
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

    function filter_by_checkboxes(details_ingredients_evenement, sessions_to_include, include_on_site_recipes){

        var details_ingredients_evenement = details_ingredients_evenement;
        console.log("before");
        console.log(details_ingredients_evenement)

        //console.log("ids of sessions to include :");
        //console.log(sessions_to_include);
        //console.log('take on site recipes :'+include_on_site_recipes);



        for(const [indexRepas, repas] of details_ingredients_evenement.entries()){
            for(const [indexRecette,recette] of repas.entries()){
                if((recette.prepare_avant && sessions_to_include.includes(recette.id_session_cuisine.toString()))
                    || (!recette.prepare_avant && include_on_site_recipes)
                )
                {
                    console.log("including "+recette.nom);
                }else {
                    console.log("NOT including "+recette.nom);
                    console.log("removing at indexRecette :"+indexRecette);
                    console.log("indexRepas :"+indexRepas)
                    console.log("")
                    console.log(details_ingredients_evenement[indexRepas].length);
                    details_ingredients_evenement[indexRepas].splice(indexRecette,1);
                    console.log(details_ingredients_evenement[indexRepas].length);
                }
            }
        }
        console.log("RESULT");
        console.log(details_ingredients_evenement)
        return details_ingredients_evenement;
    
    }

    function generate_shopping_list_HTML(mapped_ingredients_arg){

        //Get filtering specificities
        sessions_to_include = [];
        $('#checkboxes_sessions :checkbox:checked').each(function(i){
        sessions_to_include[i] = $(this).val();
        });
        include_on_site_recipes = $('#no_prepa_recipes').is(":checked");


        var mapped_ingredients = JSON.parse(mapped_ingredients_arg);
        console.log("ARGUMENT : ");
        console.log(mapped_ingredients[0].length);

        shopping_list = calculate_shopping_list(mapped_ingredients, sessions_to_include, include_on_site_recipes);

        var html_shopping_list = "";
        //shopping_list = JSON.parse(shopping_list);

        for(rayon in shopping_list){
            
            //console.log(shopping_list_items)

            html_shopping_list += '<table style="display:inline-block; width:49%; vertical-align:top; margin-bottom:100px;">';
            html_shopping_list += '<thead>';
            html_shopping_list += '<tr>'
            html_shopping_list += '<th colspan="2" style="font-size:20px;">'+shopping_list[rayon]["nom_du_rayon"]+'</th>';
            html_shopping_list += '</tr></thead>';
            html_shopping_list += '<tbody>';

            var shopping_list_items = shopping_list[rayon]['items'];

            for(item in shopping_list_items){
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

                    document.getElementById('nom_evenement').innerHTML = mapped.nom_event;
                    document.getElementById('dates_evenement').innerHTML = "Du " + mapped.date_debut.toLocaleDateString("fr-FR",date_options) + " au " + mapped.date_fin.toLocaleDateString("fr-FR",date_options) ;
                    document.getElementById('estim_nb_public').innerHTML = mapped.taille_public;

                    document.getElementById("generate_shopping_list").addEventListener("click", () => generate_shopping_list_HTML(mapped.details_ingredients));

                    //Add checkboxes to choose which cooking session(s) to include, and if "no-cooking-session" (== cookes on event) are included
                    sessions_prepa = mapped.sessions_prepa_liees;
                    checkboxes_sessions_html = "";
                    for(session of sessions_prepa){
                        checkboxes_sessions_html += '<div><input type="checkbox" class="sessions_choice" id="'+session.id+'" name="sessions_choice" value="'+session.id+'" /> <label for="'+session.id+'">'+session.nom+'</label>';
                    }
                    document.getElementById('checkboxes_sessions').innerHTML = checkboxes_sessions_html;
                    
                    //Add a checkbox for taking recipes with no prepa session (==recipes done on site)
                    document.getElementById('checkbox_on_site').innerHTML = '<div><input type="checkbox" class="no_prepa_recipes" id="no_prepa_recipes" name="no_prepa_recipes" value="no_prepa_recipes" /> <label for="no_prepa_recipes"> Recettes préparées sur site </label>';
        
                    
        
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
    });
})
