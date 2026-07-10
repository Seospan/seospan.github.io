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
    
    function generate_allergens_sheet(mapped){
        console.log("Generating allergens sheet");
     
        //document.getElementById('nom_evenement').innerHTML = mapped.nom_event;
        //document.getElementById('dates_evenement').innerHTML = "Du " + mapped.date_debut.toLocaleDateString("fr-FR",date_options) + " au " + mapped.date_fin.toLocaleDateString("fr-FR",date_options) ;
        //document.getElementById('estim_nb_public').innerHTML = mapped.taille_public;
    
                    var details_recettes = JSON.parse(mapped.details_allergenes_par_recette);
                    var nom_evenement = nom_event;

    
                    var html_fiche_allergenes = "";
                    for(recette of details_recettes){

                        var json_details_recettes = JSON.parse(recette);
                        console.log("POUET");
                        console.log(recette);
                        

                    }

                    document.getElementById('all_recettes').innerHTML = html_repas;
    }
    
    ready(function(){
        //console.log("GOGOGO");
        grist.ready({columns: [
                {
                    name:'nom_event',
                    title:'Nom de l\'événement',
                    optional: false,
                },
                {
                    name:'details_allergenes_par_recette',
                    title:'Détails des allergenes par recette',
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
                //console.log("GOT...", JSON.stringify(row));
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
                    console.log("MAPPEDPPP");
                    console.log(mapped);

                    let details_allergenes_par_recette = JSON.parse(mappings.details_allergenes_par_recette);
                    console.log(details_allergenes_par_recette);

                    /*for(repas of mapped){
                        console.log(repas.nom);
                    }*/
    
                    //document.getElementById("generate_allergens_sheet").addEventListener("click", () => generate_recipe_book(mapped));
               
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
    
});

