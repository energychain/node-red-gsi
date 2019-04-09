module.exports = function(RED) {
    const http_request = require("request");
    const GSI = require("keba_gsi_obis");
    function RetrieveKebaP30Meter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
          let instance = new GSI({zip:config.zip});
          instance.meter(config.DEVICE_IP,null).then(function(meter) {
            msg.payload=meter;
            node.status({fill:"green",shape:"dot",text:(meter["1.8.0"]/10000).toFixed(3)+" kWh"});
            node.send(msg);
          });
        });
    }
    RED.nodes.registerType("keba-p30-meter",RetrieveKebaP30Meter);
}
