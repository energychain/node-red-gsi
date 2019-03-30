module.exports = function(RED) {
    const http_request = require("request");
    function RetrieveGSIForecast(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;               
            http_request("https://api.corrently.io/core/gsi?plz="+zip,function(e,r,b) {
                let json = JSON.parse(b);
                msg.payload = json;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("retrieve-forecast",RetrieveGSIForecast);
}
