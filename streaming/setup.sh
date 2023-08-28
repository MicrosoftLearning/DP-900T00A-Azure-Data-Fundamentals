echo Installing required Azure CLI extensions - this may take a few minutes...
az extension add --name azure-iot
az extension add --name stream-analytics
az provider register --namespace 'Microsoft.Devices' --wait 2>nul
az provider register --namespace 'Microsoft.StreamAnalytics' --wait 2>nul

# List of Azure regions
regions=("eastus" "westus" "centralus" "northeurope" "westeurope" "southeastasia" "australiaeast" "japaneast")

rg=$(az group list --query "[].name" -o tsv | head -n 1)
if [[ "$rg" != learn* ]]; then
    rgguid=$(cat /proc/sys/kernel/random/uuid)
    rgsuffix=${rgguid//[-]/}
    rgsuffix=${rgsuffix:0:18}
    rg=learn${rgsuffix}

    # Choose a random location from the list of regions
    random_location=${regions[$RANDOM % ${#regions[@]}]}

    az group create --name $rg --location $random_location --output none
fi

echo "Using the $rg resource group..."
guid=$(cat /proc/sys/kernel/random/uuid)
suffix=${guid//[-]/}
suffix=${suffix:0:18}

echo Creating IoT hub...
iothubname=iothub${suffix}
iotdevicename=iotdevice
az iot hub create --name $iothubname --resource-group $rg --sku S1 --partition-count 2 --output none
iothubconn=$(az iot hub connection-string show --hub-name $iothubname --output tsv)
iothubkey=${iothubconn#*"SharedAccessKey="}
az iot hub device-identity create --hub-name $iothubname --device-id $iotdevicename --output none
iotdeviceconn=$(az iot hub device-identity connection-string show --hub-name $iothubname --device-id $iotdevicename --output tsv)
echo $iothubname > iothub.txt
echo $iotdevicename > iotdevice.txt

echo Creating storage...
storename=store${suffix}
az storage account create --name $storename --resource-group $rg --location eastus --sku Standard_ZRS --encryption-services blob --output none
storekey=$(az storage account keys list -g $rg -n $storename --query "[0].value" -o tsv)
containername="data"
az storage container create --account-name $storename --name $containername --account-key $storekey --auth-mode key  --output none 

echo Creating Stream Analytics job...
streamanalyticsname=stream${suffix}
az stream-analytics job create --resource-group $rg --name $streamanalyticsname --output none
sourcetemplate=`cat sourcetemplate.json`
source=${sourcetemplate/IOTHUBNAME/$iothubname}
source=${source/IOTSAPKEY/$iothubkey}
echo $source > source.json
inputname=iotinput
az stream-analytics input create --resource-group $rg --job-name $streamanalyticsname --name $inputname --properties "{\"type\":\"Stream\",\"datasource\":$source, \"serialization\":{\"type\":\"Json\",\"properties\":{\"encoding\":\"UTF8\"}}}" --output none
outputtemaplate=`cat outputtemplate.json`
output=${outputtemaplate/STORAGEACCOUNTNAME/$storename}
output=${output/STORAGEACCOUNTKEY/$storekey}
echo $output > output.json
outputname=bloboutput
az stream-analytics output create --resource-group $rg --job-name $streamanalyticsname --name $outputname --datasource output.json --serialization "{\"type\":\"Json\",\"properties\":{\"encoding\":\"UTF8\"}}" --output none
queryname=streamquery
query=`cat query.txt`
az stream-analytics transformation create --resource-group $rg --job-name $streamanalyticsname --name $queryname --saql "$query" --output none

