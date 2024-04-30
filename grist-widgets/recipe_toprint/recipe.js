function ready(fn) {
    if (document.readyState !== 'loading'){
      console.log("DOC READY")
      fn();
    } else {
      console.log("DOC NOTT READY : "+document.readyState)
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
    console.log("TEST");

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
            console.log(mappings)
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
    grist.onRecord(updateRecipe);

    // Monitor status so we can give user advice.
    grist.on('message', msg => {
        // If we are told about a table but not which row to access, check the
        // number of rows.  Currently if the table is empty, and "select by" is
        // not set, onRecord() will never be called.
        if (msg.tableId && !app.rowConnected) {
        grist.docApi.fetchSelectedTable().then(table => {
            if (table.id && table.id.length >= 1) {
            app.haveRows = true;
            }
        }).catch(e => console.log(e));
        }
        if (msg.tableId) { app.tableConnected = true; }
        if (msg.tableId && !msg.dataChange) { app.RowConnected = true; }
    });

    Vue.config.errorHandler = function (err, vm, info)  {
        handleError(err);
      };
    
    app = new Vue({
        el: '#app',
        data: data
      });
})