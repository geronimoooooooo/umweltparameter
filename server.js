import express from "express";
import https from "https";
import "dotenv/config";
import { arrStationsNummern, stations, arrStationsProbUmwParameter,  stationsMds,  stationsMds2,} from "./sharedObjects.js";
import he from "he";
import xmlBeautify from "xml-beautify";
import beautify from "xml-beautifier";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xml2js from "xml2js";
import e from "express";
import { parseConfigXml } from "./xml.js";
import { logger } from "./logger.js";
import * as getRequest from "./get-requests.mjs";

let anotherList = [];
// Replicate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT_HTTP || 2500;
const upload = multer({ dest: "file-uploads/" });
// Serve static files from the public folder
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

let configFileText;
let configFileProvidedOn;

// Middleware
app.use("/", (req, res, next) => {
  console.log(`Request received at ${new Date()}`);
  next();
});

app.get("/", (req, res) => {
  let textIntro =
    "Diese Webseite erlaubt eine Überprüfung der gemessenen Umweltparameter " +
    "(beim MDS) einer Messstation und kann somit helfen zu verhindern, dass " +
    "bei einer Änderung (Reihenfolge, Umbenennung, Hinzufügen, Entfernen, etc) der Umweltparameter " +
    "die Messwerte nicht in eine falsche Spalte in der Datenbank abgespeichert werden.";
  let xml = "<root><person><name>John</name></person></root>";
  
  res.render("index", { textIntro, xml, configFileText });
});

app.get("/compare-umweltparameter", async (req, res) => {
  // console.log("configfile: "+ configFileText);

  let textIntro =
    "Diese Seite zeigt an, welche Umweltparameter für eine Station in der Konfigurationsdatei" +
    " angegeben sind und welche Umweltparameter in dem aktuell vom MDS abgefragten response-XML auftreten." +
    " Falls es Unterschiede geben sollte, dann werden Daten im best-case gar nicht in die DB abgespeichert" +
    " und im worst-case werden Daten in der falschen Spalte in der Stationstabelle abgespeichert.\n" +
    " Sollte ein Stationsname hier auf der Seite rot aufleuchten, dann sollte das näher angeschaut werden!"+
    " Jeder Aufruf dieser Seite fragt den MDS nach 10-20 Minuten alten Messdaten (Umweltparametern) ab.";
  
  // let stationenListe = result.stationen.map((station) => stationen.station);
  // console.log(stationenListe[0]);

  // const stationId = result.tsel.tsmd[0].tsd[0].dn;
  // console.log(stationId); // Output: 25062015
  // const pElements = result.tsel.pmdl[0].pmd.map((pmd) => pmd.p[0]);
  // console.log(pElements);
  // let station = stationsMds.find((e)=>e.id == stationId);
  
  // arrStationsProbUmwParameter.push({name:"abc", id: stationId, umweltparameter: pElements});
  

  if (configFileText != undefined) {
    arrStationsNummern.length = 0;
    let arrStationsConfigSimple=[];
    let arrStationsConfig = parseConfigXml(configFileText);
    
    arrStationsConfig.forEach((e)=>{      
      let umweltparameter = [];
      e.pmdl.pmd.forEach((up)=> umweltparameter.push(up.p));     
      arrStationsConfigSimple.push({name:e.name, nummer:e.nummer, umweltparameter:umweltparameter})

      arrStationsNummern.push(e.nummer);
    })
    
    logger.info("starting mds process...");
    let arrStationsXmlResponseFormatted = [];
    let arrStationsXmlResponse = await getRequest.getXmlFromMdsForAllUrls(arrStationsNummern);
    logger.info("Amount of response-XML: " + arrStationsXmlResponse.length);
    // console.dir(arrStationsXmlResponse[0].tsel.pmdl, { depth: null });
    // console.dir(arrStationsConfig[0].pmdl, { depth: null });

    arrStationsXmlResponse.forEach((e) => {
      // console.dir(e, { depth: null });
      let umweltparameter = [];
      e.tsel.pmdl.pmd.forEach((up) => umweltparameter.push(up.p));

      arrStationsXmlResponseFormatted.push({
        name: "",
        nummer: e.tsel.tsmd.tsd.dn,
        umweltparameter: umweltparameter,
      });
    });
    for (let index = 0; index < stations.length; index++) {
      // console.dir(stations[index], {depth: null});
      // console.dir(arrStationsXmlResponseFormatted[index], {depth: null});
    }
    await getRequest.compareConfigWithMds(arrStationsConfig, arrStationsXmlResponse, arrStationsProbUmwParameter);

    res.render("compare-umweltparameter", {textIntro, arrStationsConfigSimple, arrStationsXmlResponseFormatted, arrStationsProbUmwParameter });
  } else {    
    res.render("no-config-file", {textIntro, configFileText, configFileProvidedOn });
  }
});

app.get("/station-query", (req, res) => {
  let textIntro = "query stuff";
  res.render("station-query", { textIntro });
});

app.get("/config-upload", (req, res) => {
  let textIntro =
    "Hier kann die aktuell genutzt Konfigurationsdatei angegeben werden. Es wird anschließend " +
    "die Umweltparameterliste aus dieser Konfigurationsdatei mit der Umweltparameterliste aus den XML-responses" +
    " der einzelnen Stationen vom MDS verglichen.";
  
  if (configFileText == undefined) {
    logger.info("message" + new Date().toUTCString());
  }
  res.render("config-upload", {
    textIntro,
    configFileText,
    configFileProvidedOn,
  });
});

app.post("/station-selected", (req, res) => {
  console.log("u called /station-selected");
  const stationNameId = req.body.station;
  let stationName = stationNameId.split("@@")[0];
  let stationId = stationNameId.split("@@")[1];
  console.log(stationName + stationId);
  let stationPmdl = stations.find((e) => e.id == stationId).pmdl;
  let xml =
    "<pmdl>         " +
    "<pmd><p>Lufttemp MW</p><u>C</u><pd><dn>25062015</dn></pd></pmd>        <pmd><p>Feuchte MW</p><u>% rF</u><pd><dn>25062015</dn></pd></pmd>        </pmdl>";
  xml = xml.replace(/\s+/g, ""); //remove spaces
  stationPmdl = stationPmdl.replace(/\s+/g, ""); //remove spaces
  if (he.escape(xml) === he.escape(stationPmdl)) {
    console.log("text is gleich: " + beautify(stationPmdl));
  } else {
    console.log(he.escape(stationPmdl));
  }
  res.send(
    `Station ${stationName} mit ID: ${stationId} mit pmdl: ${beautify(
      stationPmdl
    )}`
  );
});

app.post("/config-file-upload", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, "file-uploads", req.file.filename);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err || data.length == 0) {
      return res.status(500).send("Error reading file");
    }
    configFileText = data;
    console.log(configFileText);
    let textIntro =
      new Date().toUTCString() + ": File uploaded and content saved/printed.";
    // res.render('file-uploaded', {textIntro, configFileText})
    configFileProvidedOn = new Date();

    res.render("config-upload", {
      textIntro,
      configFileText,
      configFileProvidedOn,
    });
  });
});

app.post("/config-file-textArea", (req, res) => {
  //req.body; { textAreaConfigFile: '1111' }
  configFileText = req.body.textAreaConfigFile; //use here beautify()
  // console.log(configFileText);
  let textIntro = new Date().toUTCString() +  ": Content from textarea sent and saved/printed.";
  configFileProvidedOn = new Date();
  res.render("config-upload", { textIntro, configFileText, configFileProvidedOn });
});

//#region WEBSERVER
//#region https
// const httpsServer = https.createServer({
//     key: fs.readFileSync('privateKey.key'),
//     cert: fs.readFileSync('certificate.crt'),
//   }, app);

// var privateKey  = fs.readFileSync('sslcert/privateKey.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

/* const credentials = {
    key: fs.readFileSync('sslcert/privateKey.key'),
    cert: fs.readFileSync('sslcert/certificate.crt')
  };
*/
//#endregion

//set NODE_OPTIONS=--openssl-legacy-provider in cmd in VS;read magic wiki
const credentials = {
  pfx: fs.readFileSync(path.join(__dirname,'sslcert', 'STAR_researchstudio_at.pfx'))
};

const portHTTPS = process.env.PORTHTTPS || 443
const httpsServer = https.createServer(credentials, app);

// const port = process.env.PORT || 3000
// app.listen(port, ()=>{
//   console.log(`browse this url: localhost:${port}`);  
// });

//443 used: check tomcat http://localhost:8080/ 
httpsServer.listen(portHTTPS, (err) => {
  if(err){
    console.log("Error: ", err);
    console.log(new Date().toISOString()+` https server could not start on port: ${portHTTPS}`);
  }else{
    console.log(new Date().toISOString()+` https server running on port: ${portHTTPS}`);
    console.log(new Date().toISOString()+` call: https://ispacevm04.researchstudio.at/main`);
  }
});
//#endregion




