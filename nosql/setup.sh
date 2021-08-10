#!/bin/bash

# Find resource group name
resource_group=$(az group list --query '[0].name' --output tsv)

# Generate account name for Cosmos DB
cosmos_account="cosmos"$RANDOM

# Create Cosmos DB account
az cosmosdb create \
  --resource-group $resource_group \
  --name $cosmos_account

# Create Cosmos DB database and container
az cosmosdb sql database create \
  --account-name $cosmos_account \
  --name ProductData \
  --resource-group $resource_group \
  --throughput 1000

az cosmosdb sql container create \
  --account-name $cosmos_account \
  --resource-group $resource_group \
  --database-name ProductData \
  --name ProductCatalog \
  --partition-key-path '/productcategory/subcategory'

# Generate account name for Azure Storage
storage_account="storage"$RANDOM

# Create Azure Storage account
az storage account create \
  --name $storage_account \
  --resource-group $resource_group  \
  --sku Standard_GRS \
  --kind StorageV2 \
  --access-tier Hot

# Display resource names
echo "Cosmos DB account name: " $cosmos_account
echo "Cosmos DB database: " ProductData
echo "Cosmos DB container: " ProductCatalog
echo "Storage account name: " $storage_account
