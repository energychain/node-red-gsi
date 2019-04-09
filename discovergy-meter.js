module.exports = function(RED) {
    const http_request = require("request");
    const GSI_DGY = require("gsi-discovergy");
    function RetrieveDiscovergyMeter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let instance = new GSI_DGY({DISCOVERGY_PASSWORD:config.DISCOVERGY_PASSWORD,DISCOVERGY_ACCOUNT:config.DISCOVERGY_ACCOUNT});
            instance.meter(config.meterId).then(function(meter) {
              meter["1.8.0"] = meter["1.8.0"]/10000000;
              meter["1.8.1"] = meter["1.8.1"]/10000000;
              meter["1.8.2"] = meter["1.8.2"]/10000000;

              msg.payload=meter;
              msg.parts = {
                id:meter.meterId
              }

              node.status({fill:"green",shape:"dot",text:(meter["1.8.0"]/1000).toFixed(3)+" kWh"});
              node.send(msg);
            });
        });
    }
    RED.nodes.registerType("discovergy-meter",RetrieveDiscovergyMeter);
}
