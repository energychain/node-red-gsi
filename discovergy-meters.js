module.exports = function(RED) {
    const http_request = require("request");
    const GSI_DGY = require("gsi-discovergy");
    function RetrieveDiscovergyMeter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let instance = new GSI_DGY({DISCOVERGY_PASSWORD:config.DISCOVERGY_PASSWORD,DISCOVERGY_ACCOUNT:config.DISCOVERGY_ACCOUNT});
            instance.meters().then(function(meter) {
              let meters = {};
              for(let i=0;i<meter.length;i++) {
                if(typeof meter[i].meterId != "undefined") meters[meter[i].meterId]=meter[i];
                if(typeof meter[i].administrationNumber != "undefined") meters[meter[i].administrationNumber]=meter[i];
                if(typeof meter[i].serialNumber != "undefined") meters[meter[i].serialNumber]=meter[i];
              }
              msg.payload=meters;
              node.send(msg);
            });
        });
    }
    RED.nodes.registerType("discovergy-meters",RetrieveDiscovergyMeter);
}
