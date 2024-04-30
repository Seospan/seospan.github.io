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
    grist.ready({columns: ['Titre', 'Texte', 'Recette'], requiredAccess: 'read table'});
    grist.onRecord(function (row, mappings){
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
    
    });
})