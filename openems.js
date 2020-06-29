module.exports = function(RED) {
    const http_request = require("request");
    function OpenEMS(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;
            if((typeof node.context().global.get('zip') !== 'undefined') && (node.context().global.get('zip') !== null) && (node.context().global.get('zip').length == 5)) {
              zip = node.context().global.get('zip');
            } else {
              console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
            }
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
