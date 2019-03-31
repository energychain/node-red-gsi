module.exports = function(RED) {
    const http_request = require("request");
    const GSI = require("varta_engion_gsi_obis");
    function RetrieveVartaStorageMeter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
          let instance = new GSI({zip:config.zip});
          instance.meter(config.DEVICE_IP,null).then(function(meter) {            
            msg.payload=meter;
            node.send(msg);
          });
        });
    }
    RED.nodes.registerType("varta-storage-meter",RetrieveVartaStorageMeter);
}