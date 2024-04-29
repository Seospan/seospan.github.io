function ready(fn) {
    if (document.readyState !== 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
}

const data = {
    count: 0,
    invoice: '',
    status: 'waiting',
    tableConnected: false,
    rowConnected: false,
    haveRows: false,
  };
  let app = undefined;

function handleError(err) {
    console.error(err);
    const target = app || data;
    target.invoice = '';
    target.status = String(err).replace(/^Error: /, '');
    console.log(data);
}

function updateRecipe(row, mappings){

    try {
        data.status = '';
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
            document.getElementById('title').src = mapped.Titre;
            document.getElementById('text').innerText = mapped.Texte;
            console.log(`Using ${mappings.Titre} and ${mappings.Texte} columns`);
        } else {
            // Helper returned a null value. It means that not all
            // required columns were mapped.
            console.error("Please map all columns");
        }

    } catch (err) {
        handleError(err);
    }

}

ready(function(){
    grist.ready({columns: ['Titre', 'Texte'], requiredAccess: 'read table'});
    grist.onRecord(updateRecipe(row, mappings));

    Vue.config.errorHandler = function (err, vm, info)  {
        handleError(err);
      };
    
    app = new Vue({
        el: '#app',
        data: data
      });
})