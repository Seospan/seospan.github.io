grist.ready({columns: ['Titre', 'Texte'], requiredAccess: 'read table'});
grist.onRecord(function(record) {
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
});