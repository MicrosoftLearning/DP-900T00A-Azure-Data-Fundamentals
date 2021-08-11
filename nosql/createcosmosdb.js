const { DefaultAzureCredential } = require("@azure/identity");
const { CosmosClient } = require("@azure/cosmos");
const credential = new DefaultAzureCredential();
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const resourceGroup = process.env["RESOURCE_GROUP"];
const cosmosdbAccount = process.env["COSMOSDB_ACCOUNT"];
const cosmosdbEndpoint = process.env["COSMOSDB_ENDPOINT"];
const cosmosdbKey = process.env["COSMOSDB_KEY"];
const connectionString = "AccountEndpoint=" + cosmosdbEndpoint + ";AccountKey=" + cosmosdbKey + ";";
const cosmosdbClient = new CosmosClient(connectionString);
const productsFile = "./products/productinfo.json";


async function createCosmosDBDatabase(resourceGroup, accountName) {
    try {
        var databaseResponse = await cosmosdbClient.databases.createIfNotExists({ id: "ProductData", throughput: "1000"});
        return databaseResponse.database;
    } catch(err) {
        console.log(err);
    }
}

async function createCosmosDBContainer(database) {
    try {
        var containerResponse = await database.containers.createIfNotExists({ id: "ProductCatalog", partitionKey: "/productcategory/subcategory"});
        return containerResponse.container;
    } catch(err) {
        console.log(err);
    }
}

async function loadData(fileName, container) {
    try {
        var data = require(fileName);
        for (const product of data) {
            var inserted = false;
            while (!inserted) {
                try {
                    await container.items.create(product);
                    inserted = true;
                }  catch(err) {
                    if (err.code === 429) {
                        console.log("Throttled - retrying\n");
                        await sleep(1000);
                    } else {
                        throw err;
                    }
                }
            }
        }
    } catch(err) {
        console.log(err);
    }
}

(async function() {
    console.log("Creating database\n");
    var database = await createCosmosDBDatabase(resourceGroup, cosmosdbAccount);
    console.log("Creating container\n");
    var container = await createCosmosDBContainer(database);
    console.log("Inserting data");
    await loadData(productsFile, container);
    console.log("Database created and populated");
})();
