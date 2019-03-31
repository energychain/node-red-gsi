module.exports = function(RED) {
    const http_request = require("request");
    const GSI_DGY = require("gsi-discovergy");
    function RetrieveDiscovergyMeter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let instance = new GSI_DGY({DISCOVERGY_PASSWORD:config.DISCOVERGY_PASSWORD,DISCOVERGY_ACCOUNT:config.DISCOVERGY_ACCOUNT});
            instance.meter(config.meterId).then(function(meter) {
              msg.payload=meter;
              node.send(msg);
            });
        });
    }
    RED.nodes.registerType("discovergy-meter",RetrieveDiscovergyMeter);
}
