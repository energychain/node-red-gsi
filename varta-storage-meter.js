module.exports = function(RED) {
    const http_request = require("request");
    const GSI = require("varta_engion_gsi_obis");
    function RetrieveVartaStorageMeter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
          let zip = config.zip;
          if((typeof node.context().global.get('zip') !== 'undefined') && (node.context().global.get('zip') !== null) && (node.context().global.get('zip').length == 5)) {
            zip = node.context().global.get('zip');
          } else {
            console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
          }
          let instance = new GSI({zip:zip});
          instance.meter(config.DEVICE_IP,null).then(function(meter) {
            msg.payload=meter;
            node.status({fill:"green",shape:"dot",text:(meter["1.8.0"]/1000).toFixed(3)+" kWh"});
            msg.parts = {
              id:meter.meterId
            }
            node.send(msg);
          });
        });
    }
    RED.nodes.registerType("varta-storage-meter",RetrieveVartaStorageMeter);
}
