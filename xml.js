import e from "express";
import xml2js from "xml2js";

async function parseXmlAsync(data) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, { explicitArray: false }, (err, xml) => {
      if (err) {
        reject(err);
      }
      resolve(xml);
    });
  });
}

function parseXml2(xml) {
  xml2js.parseString(xml, function (err, result) {
    // console.log(result.urlset.abc[0].url[0]);
    result.urlset.abc.forEach(i => {
      console.log(i);
      console.dir(i, { depth: null });
    });
    
    result.urlset.abc.map(abc => {            
      console.dir(abc, { depth: null });
    });

    /*
    // const arrStationsConfigSimple = result.klima.stationen[0].station[0].name;//["klima"]["stationen"]["station"][0];
    const arrStationsConfigSimple = result.klima.stationen[0].station[0];
    console.log("arrStationsConfigSimple: " + arrStationsConfigSimple); // arrStationsConfigSimple: [object Object]
    console.dir(arrStationsConfigSimple, { depth: null });
    */
  });
}

let arrStationsConfig = []; 
let arrStationsConfigSimple = [];
function parseConfigXml(xml) {
  arrStationsConfig = [];
  let arrList = [];
  let arrLoc = [];
  xml2js.parseString(xml, { explicitArray: false }, function (err, result) {
    //use this when { explicitArray: false} in function parseString
    // result["klima"]["stationen"]["station"].forEach((e) => {
    //   arrList.push(e);
    // });

    // arrList.forEach((e) => console.log(e));
    // arrList.forEach((e) => arrLoc.push(e["name"]));
    // arrLoc.forEach((item) => {
    //   console.log("Station: " + item);
    // });

    // arrList.forEach((e) => {
    //   console.log(e.name);
    // });

    // result.klima.stationen.station.forEach((station) => {console.dir(station, { depth: null });});
    arrStationsConfig = result.klima.stationen.station;
    // console.dir(arrStationsConfig, { depth: null });
    // console.log(arrStationsConfigSimple);
  });  
  return arrStationsConfig;
}

export {arrStationsConfigSimple, arrStationsConfig, parseXmlAsync, parseConfigXml, parseXml2 };
