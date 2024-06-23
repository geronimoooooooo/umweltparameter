// import fetch from 'node-fetch';
import *  as xmlFile from "./xml.js";

export let urlGet = "https://mds.sommer.at/Web-Service-Admintool/fetchXHydro10.php?station=25062015&von=2024-03-26T16:00:49&name=npvbgd&passwort=4f56bbca4d4bdbe06cb8819286ea8690";

//https://mds.sommer.at/Web-Service-Admintool/fetchXHydro10.php?station=02190574&von=2023-01-01T12:19:41&bis=2023-01-01T12:39:41&name=npvbgd&passwort=4f56bbca4d4bdbe06cb8819286ea8690



export function createUrls(arrStationsNummern){  
  let arrStationsUrl = [];
  for (let index = 0; index < arrStationsNummern.length; index++) {
    const nummer = arrStationsNummern[index];
    
    let currentDate = new Date();
    console.log(currentDate);
    currentDate.setMinutes(currentDate.getMinutes() - 10)
    
    let currentDateIsoMinus10 = currentDate.toISOString().slice(0,-5);
    currentDate.setMinutes(currentDate.getMinutes() +20)
    let currentDateIsoPlus10 = currentDate.toISOString().slice(0,-5);    
    
    let server = "https://mds.sommer.at/Web-Service-Admintool/fetchXHydro10.php?";
    let station = "station=" + nummer;
    let von = currentDateIsoMinus10;
    let vonString = "&von=" + von;
    let bis = currentDateIsoPlus10;
    let bisString = "&bis=" + bis;
    let login ="&name=npvbgd&passwort=4f56bbca4d4bdbe06cb8819286ea8690";
    
    let urlComplete = server + station + vonString + bisString + login; 
    arrStationsUrl.push(urlComplete);    
  }
  return arrStationsUrl;
}

export async function getXmlFromMdsForAllUrls(arrStationsNummern){
  let arrStationsXmlResponse = [];
  let arrStationsUrl = createUrls(arrStationsNummern);

  for (const item of arrStationsUrl) {
    console.log(item);
    const responseXml = await fetchXmlFromMds(item);
    const resp2 = await xmlFile.parseXmlAsync(responseXml);
    arrStationsXmlResponse.push(resp2);
  }
  return arrStationsXmlResponse;
}

export async function compareConfigWithMds(config, arrStationsXmlResponse, arrStationsProbUmwParameter ){
  arrStationsProbUmwParameter.length = 0;
  for (let index = 0; index < arrStationsXmlResponse.length; index++) {
    if (config.length > index){
    const station = config[index];
    if(JSON.stringify(config[index].pmdl) == JSON.stringify(arrStationsXmlResponse[index].tsel.pmdl)){
        console.log("HURRA Umweltparameterreihenfolge identisch!")
    }else{
        console.log("fail: Umweltparameterreihenfolge zwischen config file und MDS responseXML "+config[index].name +" NICHT identisch!");
        arrStationsProbUmwParameter.push({name: config[index].name, nummer: config[index].nummer});
        console.dir(config[index].pmdl, {depth:null});
        console.dir(arrStationsXmlResponse[index].tsel.pmdl, {depth:null});
    }       
  }else{

  }
}//for
}

function getArray(){
  return arrStationsXmlResponse;
}

// createUrls();
// getXmlFromMdsForAllUrls();




//'https://quotes.toscrape.com/random'

let xmlFromMds = "";

export async function fetchXmlFromMds(url) {
    try {
      const response = await fetch(url);
  
      // Check if response is OK (status 200)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
  
      // Read the response as text
      const xmlString = await response.text();
      return xmlString;

    } catch (error) {
      console.error('Error fetching XML:', error);
      return null;
    }
  }

async function getXmlFromMds(){
    fetch(urlGet)
        .then((response) => response.text())
        .then((body) => {
            // console.log(body);
            xmlFromMds = body;
        }); 
    }
    
// getXmlFromMds()

// fetchXmlFromMds(urlGet)
//     .then(xmlString => {
//     if (xmlString) {
//       console.log('XML Response:', xmlString);
//       // Now you can further process the XML string as needed
//       xmlFromMds = xmlString;
//     } else {
//       console.log('Failed to fetch XML.');
//     }
//   })


function printUrlGet() {
  console.log(urlComplete);
}

// printUrlGet();



// fetch("https://jsonplaceholder.typicode.com/posts/1")
// .then((res)=> {
//   if (!res.ok){
  //     throw Error("response not ok")
  //   }
  //   return res.json()
  // })
  // .then((data)=>{
//   st = data
//   // console.log(data) 
// })
// .catch((err)=>{
  //     console.log("error occured", err)
  // });
  
let json;

async function fetchDataAndSaveInVariable() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1'); 
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function main() {
  var jsonData = await fetchDataAndSaveInVariable();
  if (jsonData) {
      console.log('JSON Data:', jsonData);
      console.log(jsonData.title);
      // Now you can use the JSON data stored in the variable jsonData
  } else {
      console.log('Failed to fetch JSON data');
  }
}
main();

json = await fetchDataAndSaveInVariable();
console.log("json: "+JSON.stringify(json));
console.log("json.title: "+ json.title);

async function getRecipes(){
  fetch("https://api.spoonacular.com/recipes/complexSearch?number=2&apiKey=b4408aa9ab144e47ae2bf8eff93e72f5")
  .then((response) => response.json())
  .then((user) => {
  const recipes = user.results.map(result => result.id)
  console.log("rec:§" +recipes)
  return recipes
  });
  }
  
const recipes = await getRecipes();


async function doSomethingAsync() {
  return Promise.resolve('Hello, World!');
}
(async function() {
  const response = await doSomethingAsync();
  console.log(response);
})();
const response = await doSomethingAsync();
// const response = doSomethingAsync();
console.log('await doSomethingAsync(): '+response);
