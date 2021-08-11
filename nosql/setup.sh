#!/bin/bash

# Find subscription ID
export AZURE_SUBSCRIPTION_ID=$(az account list --query '[0].id' --output tsv)

# Find resource group name
export RESOURCE_GROUP=$(az group list --query '[0].name' --output tsv)

# Generate account name for Cosmos DB
export COSMOSDB_ACCOUNT="cosmos"$RANDOM

# Create Cosmos DB account
echo "Creating Cosmos DB account"
az cosmosdb create \
  --resource-group $RESOURCE_GROUP \
  --name $COSMOSDB_ACCOUNT

# Retrieve the endpoint and master key
export COSMOSDB_ENDPOINT=$(az cosmosdb show --resource-group $RESOURCE_GROUP --name $COSMOSDB_ACCOUNT --query documentEndpoint --output tsv)
export COSMOSDB_KEY=$(az cosmosdb keys list --resource-group $RESOURCE_GROUP --name $COSMOSDB_ACCOUNT --query primaryMasterKey --output tsv)

# Create Cosmos DB database and container, and populate with data
echo "Creating Cosmos DB database"
node createcosmosdb.js

# Generate account name for Azure Storage
echo "Creating storage account"
STORAGE_ACCOUNT="storage"$RANDOM

# Create Azure Storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP  \
  --sku Standard_GRS \
  --kind StorageV2 \
  --access-tier Hot

# Find the storage key for the new account
export STORAGE_KEY=$(az storage account keys list \
                       --resource-group $RESOURCE_GROUP \
                       --account-name $STORAGE_ACCOUNT \
                       --query '[0].value' \
                       --output tsv)

# Populate the storage account with sample data
echo "Uploading data to storage account"

az storage container create \
  --account-name $STORAGE_ACCOUNT \
 --name images \
 --account-key $STORAGE_KEY

az storage blob upload-batch \
    --account-name $STORAGE_ACCOUNT \
    --account-key $STORAGE_KEY \
    --source images \
    --pattern *.gif \
    --destination images

# Display resource names
echo "Cosmos DB account name: " $COSMOSDB_ACCOUNT
echo "Cosmos DB database: " ProductData
echo "Cosmos DB container: " ProductCatalog
echo "Storage account name: " $STORAGE_ACCOUNT
