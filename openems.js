module.exports = function(RED) {
    const http_request = require("request");
    function OpenEMS(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;
            http_request(config.baseurl+"/"+config.component+"/"+config.channel,function(e,r,b) {
                try  {
                  let json = JSON.parse(b);
                  msg.payload = json.value;
                  node.send(msg);
                } catch(e) {
                  msg.payload = b;
                  node.send(msg);
                }
             });
        });
    }
    RED.nodes.registerType("openems",OpenEMS);{}
}
