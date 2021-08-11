#!/bin/bash

# Find subscription ID
#export AZURE_SUBSCRIPTION_ID=$(az account list --query '[0].id' --output tsv)
export AZURE_SUBSCRIPTION_ID=$(az account list --query '[1].id' --output tsv)

# Find resource group name
#export RESOURCE_GROUP=$(az group list --query '[0].name' --output tsv)
export RESOURCE_GROUP=$(az group list --query '[7].name' --output tsv)

# Generate account name for Cosmos DB
#export COSMOSDB_ACCOUNT="cosmos"$RANDOM
export COSMOSDB_ACCOUNT="cosmos24203"

# Create Cosmos DB account
az cosmosdb create \
  --resource-group $RESOURCE_GROUP \
  --name $COSMOSDB_ACCOUNT

# Retrieve the endpoint and master key
export COSMOSDB_ENDPOINT=$(az cosmosdb show --resource-group $RESOURCE_GROUP --name $COSMOSDB_ACCOUNT --query documentEndpoint --output tsv)
export COSMOSDB_KEY=$(az cosmosdb keys list --resource-group $RESOURCE_GROUP --name $COSMOSDB_ACCOUNT --query primaryMasterKey --output tsv)

# Create Cosmos DB database and container, and populate with data
node createcosmosdb.js

# Generate account name for Azure Storage
STORAGE_ACCOUNT="storage"$RANDOM

# Create Azure Storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $resource_group  \
  --sku Standard_GRS \
  --kind StorageV2 \
  --access-tier Hot

# Populate the storage account with sample data
az storage blob upload-batch \
    --account-name $STORAGE_ACCOUNT \
    --source images \
    --pattern *.gif \
    --destination images

# Display resource names
echo "Cosmos DB account name: " $COSMOSDB_ACCOUNT
echo "Cosmos DB database: " ProductData
echo "Cosmos DB container: " ProductCatalog
echo "Storage account name: " $STORAGE_ACCOUNT
