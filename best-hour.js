module.exports = function(RED) {
    const http_request = require("request");
    function RetrieveBestHour(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;            
            console.log("URL","https://api.corrently.io/gsi/bestHour?zip="+zip);
            http_request("https://api.corrently.io/gsi/bestHour?plz="+zip,function(e,r,b) {
                let json = JSON.parse(b);
                msg.payload = json;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("best-hour",RetrieveBestHour);
}
