module.exports = function(RED) {
    const udp = require('dgram');
    const buffer = require('buffer');
    function RetrieveKebaP30Control(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
          const client = udp.createSocket('udp4');
          client.on('message',function(msgudp,info){            
            msg.payload=JSON.parse(msgudp.toString());
            node.send(msg);
            client.close();
          });
          client.on('error',function(error){
              client.close();
          });
            client.bind(7090);
            client.send(Buffer.from(msg.payload),7090,config.DEVICE_IP,function(error){
          });

        });
    }
    RED.nodes.registerType("keba-p30-control",RetrieveKebaP30Control);
}
