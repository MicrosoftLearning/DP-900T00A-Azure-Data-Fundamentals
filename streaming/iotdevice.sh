iothub=`cat iothub.txt`
iotdevice=`cat iotdevice.txt`


az iot device simulate --device-id $iotdevice --hub-name $iothub --data "IOT Device Message" --msg-count 120 --msg-interval 1
