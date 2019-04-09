module.exports = function(RED) {
    const http_request = require("request");
    function DecorateObis(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let zip = config.zip;
            let req_obj = {};
            req_obj.secret = node.z;
            req_obj.externalAccount = node.id;
            req_obj.zip = zip;
            req_obj.timeStamp = new Date().getTime();
            req_obj["1.8.0"] = msg.payload;
            if(typeof msg.payload["1.8.0"] != "undefined") req_obj["1.8.0"]=msg.payload["1.8.0"]; else
            if(typeof msg.payload["energy"] != "undefined") req_obj["1.8.0"]=msg.payload["energy"]; else
            if(typeof msg.payload["reading"] != "undefined") req_obj["1.8.0"]=msg.payload["reading"];

            http_request.post("https://api.corrently.io/core/reading",{form:req_obj},function(e,r,b) {
              let _gsi = JSON.parse(b);
              msg.payload = _gsi;
              msg.parts = {
                id:_gsi.meterId
              }

              node.send(msg);
            })
        });
    }
    RED.nodes.registerType("decorate-obis",DecorateObis);
}
