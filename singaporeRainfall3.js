(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id_stats",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "name",
            alias: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "latitude",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            alias: "longitude",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "rainfall",
            alias: "Singapore rainfall numbers",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.data.gov.sg/v1/environment/rainfall", function(resp) {
            var stat = resp.metadata.stations, item = resp.items,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = stat.length; i < len; i++) {
                tableData.push({
                    "id_stats": stat[i].id,
                    "name": stat[i].name,
                    "lon": stat[i].location.longitude,
                    "lat": stat[i].location.latitude
					"lat": item[0][i].value
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Singapore Rainfall"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
