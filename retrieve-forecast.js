module.exports = function(RED) {
    const http_request = require("request");
    function RetrieveGSIForecast(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;
            if((typeof node.context().global.get('zip') !== 'undefined') && (node.context().global.get('zip') !== null) && (node.context().global.get('zip').length == 5)) {
              zip = node.context().global.get('zip');
            } else {
              console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
            }
            http_request("https://api.corrently.io/core/gsi?plz="+zip,function(e,r,b) {
                let json = JSON.parse(b);
                msg.payload = json;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("retrieve-forecast",RetrieveGSIForecast);
}
