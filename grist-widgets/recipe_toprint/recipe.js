grist.ready({columns: ['Titre', 'Texte'], requiredAccess: 'read table'});
grist.onRecord(function(record, mappings) {
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
    const mapped = grist.mapColumnNames(record);
    // First check if all columns were mapped.
    if (mapped) {
        document.getElementById('image').src = mapped.Link;
        document.getElementById('title').innerText = mapped.Title;
        console.log(`Using ${mappings.Link} and ${mappings.Title} columns`);
    } else {
        // Helper returned a null value. It means that not all
        // required columns were mapped.
        console.error("Please map all columns");
    }

});