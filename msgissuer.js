module.exports = function(RED) {
    const persist = require('node-persist');
    const axios = require('axios');
    const moment = require('moment');

    const storage = persist.create({dir: 'gsidata', ttl: 3500000});

    const getGSI = async function(zipCode) {
      let gsi = await storage.getItem('gsi_'+zipCode);
      if(gsi == null) {
        let responds = await axios.get('https://corrently.de/api/stromdao/gsi?zip='+zipCode);
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
     m.timestamp = {};
     m.relativeHours = {};
     m.bestHours = {};
     m.fourHoursIn24 = {};

     for(let i=0;i<gsi.forecast.length;i++) {

       m.timestamp['h'+gsi.forecast[i].timeStamp] = gsi.forecast[i].gsi;

       if(gsi.forecast[i].timeStamp > now) {
         m.relativeHours['h'+Math.floor((gsi.forecast[i].timeStamp-now)/3600000)]=gsi.forecast[i].gsi;
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
          m.bestHours['h'+i] = 0;
        } else {
          m.bestHours['h'+i] = 1;
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
       m.fourHoursIn24['h'+z] = {
         timeStamp:timeStamp,
         isoString: moment(timeStamp).format()
       }

     }

     return m;
    }

    function MsgIssuer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            let zip = config.zip;
            if((typeof node.context().global.get('zip') !== 'undefined') && (node.context().global.get('zip') !== null) && (node.context().global.get('zip').length == 5)) {
              zip = node.context().global.get('zip');
            } else {
              console.log('Corrently GSI requires persistent storage for global values. Consider enable contextStorage in your settings.js');
            }
            let gsi = await getGSI(zip);
            let msg_gsi = {payload : await builGSImsg(gsi)};

            let msg_influx = [];

            for(let i = 0;i<msg_gsi.payload.gsi.forecast.length;i++) {
                let point = {};
                if((typeof config.measurement !== 'undefined') && (config.measurement !== null)) {
                  point.measurement = config.measurement;
                } else {
                  point.measurement = "GSI"+node.id;
                }

                point.fields = msg_gsi.payload.gsi.forecast[i];

                let ts = new Date(msg_gsi.payload.gsi.forecast[i].timeStamp);
                ts.setMinutes(0);
                ts.setSeconds(0);
                ts.setMilliseconds(0);

                point.timestamp = ( ts.getTime() * 1000000) ;
                msg_influx.push(point);
            }


            let color = "green";
            if(msg_gsi.payload.now < 55) {
              color = "yellow";
            }
            if(msg_gsi.payload.now < 45) {
              color = "red";
            }
            node.status({fill: color,shape:"dot",text:moment(msg_gsi.payload.gsi.forecast[0].timeStamp).format()+' '+msg.payload.now});
            node.send([msg_gsi,{payload:msg_influx}]);
        });
    }

    const init = async function() {
      await storage.init();
    }

    init();

    RED.nodes.registerType("msgissuer",MsgIssuer);
}
