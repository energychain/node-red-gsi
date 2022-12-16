module.exports = function(RED) {
    const gsifetch = require("./gsi-fetch");
    function RetrieveCurrentValue(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            let zip = config.zip;
            if((typeof node.context().global.get('zip') !== 'undefined') && (node.context().global.get('zip') !== null) && (node.context().global.get('zip').length == 5)) {
              zip = node.context().global.get('zip');
            } else {
              console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
            }
            let key = config.apikey;
            if((typeof key == 'undefined') || (key == null)) key='node-red-contrib-gsi-V2-';
            if(key.length !== 42) key += '_' + node.id;
            msg.payload = await gsifetch(key,zip,node.context().flow);
            msg.payload = msg.payload[0].gsi;
            let fill = "yellow";
            if(msg.payload>55) fill = "green";
            if(msg.payload<45) fill = "red";
            node.status({fill:fill,shape:"dot",text:Math.round(msg.payload)+" Points"});
            node.send(msg);
        });
    }
    RED.nodes.registerType("current-value",RetrieveCurrentValue);
}
