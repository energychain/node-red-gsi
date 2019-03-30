module.exports = function(RED) {
    const http_request = require("request");
    function RetrieveCurrentValue(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;
            http_request("https://api.corrently.io/gsi/gsi?zip="+zip,function(e,r,b) {
                let json = JSON.parse(b);
                msg.payload = json.periods[0].gsi;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("current-value",RetrieveCurrentValue);
}
