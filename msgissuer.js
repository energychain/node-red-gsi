module.exports = function(RED) {
    const persist = require('node-persist');
    const axios = require('axios');
    const moment = require('moment');

    const storage = persist.create({dir: 'gsidata', ttl: 3500000});

    const getGSI = async function(zipCode) {
      let gsi = await storage.getItem('gsi_'+zipCode);
      if(gsi == null) {
        let responds = await axios.get('https://api.corrently.io/core/gsi?zip='+zipCode);
        gsi = responds.data;
        storage.setItem('gsi_'+zipCode,gsi);
        return gsi;
      } else {
        return gsi;
      }
    }

    const builGSImsg = async function(gsi) {

     let m = {};
     m.gsi = gsi;

     let now = new Date().getTime();
     let matrix = {}

     m.now = gsi.forecast[0].gsi;

     let min = 100;
     let max = 0;

     let min_ts =0;
     let max_ts =0;
     let switches = [];

     for(let i=0;i<gsi.forecast.length;i++) {
       m.timetamp = {};
       m.timestamp[''++gsi.forecast[i].timeStamp] = gsi.forecast[i].gsi;


       if(gsi.forecast[i].timeStamp > now) {
         m.relativeHours[''+Math.floor((gsi.forecast[i].timeStamp-now)/3600000)]=gsi.forecast[i].gsi;
       }
       if(i<24) {
         switches.push(gsi.forecast[i]);
         if(min > gsi.forecast[i].gsi) {
           min = gsi.forecast[i].gsi;
           min_ts  = gsi.forecast[i].timeStamp;
         }
         if(max < gsi.forecast[i].gsi) {
           max = gsi.forecast[i].gsi;
           max_ts  = gsi.forecast[i].timeStamp;
         }
       }
       // calcultate matrix
       matrix['h_'+i] = {
           timeStamp: gsi.forecast[i].timeStamp
       };
       let sum = 0;
       let t = 0;
       for(let j = i;j>0;j--) {
         sum += gsi.forecast[j].gsi;
         t++;
         matrix['h_'+i]['avg_'+j] = Math.round(sum/(t));
       }
       for(let j = i+1; j<gsi.forecast.length; j++) {
         matrix['h_'+i]['avg_'+j] = false;
       }
     }

     switches.sort(function(a,b) {
       if (a.gsi > b.gsi) return 1;
       if (b.gsi > a.gsi) return -1;
       return 0;
     });
     switches = switches.reverse();
     let latest_gsi = gsi.forecast[0].gsi;
     for(let i=0;i<switches.length;i++) {
        if(switches[i].gsi >= latest_gsi) {
          m.bestHours[''+i] = 0;
        } else {
          m.bestHours[''+i] = 1;
        }
      }

    m.min = {
        timeStamp: min_ts,
        gsi:min,
        isoString: moment(min_ts).format()
    };
    m.min = {
        timeStamp: max_ts,
        gsi:max,
        isoString: moment(max_ts).format()
    };


     for(let z=1;z<24;z++) {
       let maxGsi = 0;
       let timeStamp = 0;
       for(let i=z-1;(i<24);i++) {
         if(matrix['h_'+i]['avg_'+z] > maxGsi) {
           maxGsi = matrix['h_'+i]['avg_'+z];
           timeStamp =  matrix['h_'+i].timeStamp;
         }
       }
       m.fourHoursIn24[''+z] = {
         timeStamp:timeStamp,
         isoString: moment(timeStamp).format()
       }

     }
     resolve(m);
    }

    function MsgIssuer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            let gsi = await getGSI(config.zip);
            msg.payload = await builGSImsg(gsi);
            node.status({fill:"green",shape:"dot",text:new Date(gsi.data[0].epochtime*1000).toLocaleString()});
            node.send(msg);

        });
    }

    const init = async function() {
      await storage.init();
    }
    RED.nodes.registerType("msgissuer",MsgIssuer);
}
