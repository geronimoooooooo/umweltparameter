import e from "express";
import xml2js from "xml2js";

/*test
*/
let stationListe = []; //aaa

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
    // const stations = result.klima.stationen[0].station[0].name;//["klima"]["stationen"]["station"][0];
    const stations = result.klima.stationen[0].station[0];
    console.log("stations: " + stations); // stations: [object Object]
    console.dir(stations, { depth: null });
    */
  });
}

let stations = [];
function parseXml(xml) {
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
    stationListe = result.klima.stationen.station;
    // console.dir(stationListe, { depth: null });
    
    stationListe.forEach((e)=>{
      let umweltparameter = [];
      e.pmdl.pmd.forEach((up)=> umweltparameter.push(up.p));
      
      stations.push({name:e.name, nummer:e.nummer, umweltparameter:umweltparameter})
    })
    // console.log(stations);


  });  
}
let myList = [1, 2, 3, 4, 5];

export {myList, stations, parseXmlAsync, parseXml, parseXml2 };
