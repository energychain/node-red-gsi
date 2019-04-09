module.exports = function(RED) {
    const http_request = require("request");
    const GSI_TPLINK = require("tplink_kasa_gsi");
    function RetrieveHS110Meter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let instance = new GSI_TPLINK({TPLINK_PASSWORD:config.TPLINK_PASSWORD,TPLINK_ACCOUNT:config.TPLINK_ACCOUNT,ZIP:config.ZIP});
            instance.meter(config.meterId).then(function(meter) {
              msg.payload=meter;
              msg.parts = {
                id:meter.meterId
              }
              node.status({fill:"green",shape:"dot",text:(meter["1.8.0"]/1000).toFixed(3)+" kWh"});
              node.send(msg);
            }).catch(function(e) {
              console.log("Error in underlaying API",e);
            });
        });
    }
    RED.nodes.registerType("tplink-hs110-cloudmeter",RetrieveHS110Meter);
}
