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
                console.log(mappings);
                console.log(mapped.recette);
                console.log(mapped.ingredients);

                var data_string = JSON.stringify( mapped.recette);
                
                //document.getElementById('alpine').setAttribute('x-data',JSON.stringify( mapped.recette) );
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
                for(ingredient of mapped.ingredients){

                }
    
    
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
