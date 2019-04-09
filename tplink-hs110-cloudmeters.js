module.exports = function(RED) {
    const http_request = require("request");
    const GSI_TPLINK = require("tplink_kasa_gsi");
    function RetrieveHS110Meters(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let instance = new GSI_TPLINK({TPLINK_PASSWORD:config.TPLINK_PASSWORD,TPLINK_ACCOUNT:config.TPLINK_ACCOUNT,ZIP:config.ZIP});
            instance.meters().then(function(meter) {
              let meters = {};
              if(typeof msg.parts == "undefined") msg.parts = [];
              for(let i=0;i<meter.length;i++) {
                if(typeof meter[i].meterId != "undefined") meters[meter[i].meterId]=meter[i];
                if(typeof meter[i].administrationNumber != "undefined") meters[meter[i].administrationNumber]=meter[i];
                if(typeof meter[i].serialNumber != "undefined") meters[meter[i].serialNumber]=meter[i];                
              }
              msg.payload=meters;
              node.send(msg);
            }).catch(function(e) {
              console.log("Error in underlaying API",e);
            });
        });
    }
    RED.nodes.registerType("tplink-hs110-cloudmeters",RetrieveHS110Meters);
}
