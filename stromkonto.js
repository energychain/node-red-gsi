module.exports = function(RED) {
    const persist = require('node-persist');
    const axios = require('axios');
    const storage = persist.create({dir: 'skodata', ttl: 900000});

    function Stromkonto(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
          let sko = config.sko;
          console.log(config);
          if((typeof node.context().global.get('sko') !== 'undefined') && (node.context().global.get('sko') !== null) && (node.context().global.get('sko').length == 5)) {
            sko = node.context().global.get('sko');
          } else {
            console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
          }
          console.log('SKO',sko);
          let data = await storage.getItem(sko);
          if((typeof data == 'undefined') || (data == null)) {
            let respondsSKO = await axios.get('https://api.corrently.io/core/stromkonto?account='+sko);
            let respondsEXD = await axios.get('https://api.corrently.io/core/exd?account='+sko);

            data = respondsSKO.data;
            if(typeof respondsEXD.data['2.8.0'] != "undefined") data["2.8.0"] =  respondsEXD.data['2.8.0'];
            if(typeof respondsEXD.data['cap'] != "undefined") data["cap"] =  respondsEXD.data['cap'];

            await storage.setItem(sko,data);
          }
          msg.payload=data;
          node.send(msg);
          return;
        });
    }

    const init = async function() {
      await storage.init();
    }

    init();

    RED.nodes.registerType("stromkonto",Stromkonto);
}
