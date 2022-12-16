module.exports = async function(key,zip,storage) {
    let forecast = [];
    const now = new Date().getTime();
    if((typeof  storage !== 'undefined') && (storage !== null)) {
        const latest = storage.get("latest");
        if((typeof latest !== 'undefined') && (latest !== null) && (typeof latest.location !== 'undefined')) {
            if(typeof latest.forecast !== 'undefined') forecast = latest.forecast;
            if(latest.location.zip !== zip) {
                latest.forecast = [];
                forecast = [];
            }
        }
        let tmp_forecast = [];
        for(let i=0;i<forecast.length;i++) {
            if(forecast[i].timeStamp > now - 3600000) {
                tmp_forecast.push(forecast);
            }
        }
        forecast = tmp_forecast;
    } 

    // do we need new Data?
    if(forecast.length > 74) {
        return forecast;
    } else {
        const axios = require("axios");
        const response = await axios.get("https://api.corrently.io/v2.0/gsi/prediction?&key="+key+"&zip="+zip);
        if(typeof response.data.forecast !== 'undefined') {

            if((typeof storage !== 'undefined') && (storage !== null)) {
                storage.set("latest",response.data);
            }
            return response.data.forecast;
        } else {
            return {};
        }
    }
}