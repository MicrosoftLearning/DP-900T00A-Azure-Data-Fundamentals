#!/bin/bash
resource=`az group list --query '[0].name' --output tsv`
location=`az group list --query '[0].location' --output tsv`

server=contoso-server-$(openssl rand -hex 5)
database="Inventory"

login="sampleLogin"
password="samplePassword123!"

startIP=0.0.0.0
endIP=0.0.0.0

echo "Creating $server in $location..."
az sql server create --name $server --resource-group $resource --location "$location" --admin-user $login --admin-password $password

echo "Configuring firewall..."
az sql server firewall-rule create --resource-group $resource --server $server -n AllowYourIp --start-ip-address $startIP --end-ip-address $endIP

echo "Creating $database on $server..."
az sql db create --resource-group $resource --server $server --name $database --edition Basic --zone-redundant false

sqlcmd -S tcp:$server.database.windows.net -d $database -U $login -P $password -i populatedb-test-data.sql

printf "***********************    IMPORTANT INFO  *********************\n\n"

printf "Database Connection: $server.database.windows.net\n"
printf "User: $login\n"
printf "Password: $password\n\n"
