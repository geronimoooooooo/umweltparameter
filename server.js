import express from 'express';
import 'dotenv/config';
import { stations } from './sharedObjects.js';
import he from "he";

const app = express();

const PORT = process.env.PORT_HTTP || 2500;
// Serve static files from the public folder
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

app.get('/', (req, res) => {
  let textIntro = "Diese Webseite erlaubt eine Überprüfung der gemessenen Umweltparameter "
  +"(beim MDS) einer Messstation und kann somit helfen zu verhindern, dass "
  + "bei einer Änderung (Reihenfolge, Umbenennung, Hinzufügen, Entfernen, etc) der Umweltparameter "
  + "die Messwerte nicht in eine falsche Spalte in der Datenbank abgespeichert werden."
  res.render('index', {textIntro}); 
});

app.get('/station-show',(req, res)=>{
  let textIntro="Um zu sehen welche Änderungen bei den Umweltparametern abgefragt und erfasst wurden, "
  +"eine Messstation im dropdown-menu wählen und auf den Button klicken.";

  res.render('station-show', {textIntro, stations});
});

app.get('/station-query',(req, res)=>{
  let textIntro="query stuff";
  res.render('station-query', {textIntro});
});

app.get('/station-compare',(req, res)=>{
  let textIntro="compare stuff";
  res.render('station-compare', {textIntro});
});

app.post('/station-selected',(req, res)=>{
  console.log("u called /station-selected");
  const stationNameId = req.body.station;
  let stationName = stationNameId.split('@@')[0];
  let stationId = stationNameId.split('@@')[1];
  console.log(stationName + stationId);
  let stationPmdl = stations.find((e)=>e.id == stationId).pmdl;
  let xml ="<pmdl>         "
  +"<pmd><p>Lufttemp MW</p><u>C</u><pd><dn>25062015</dn></pd></pmd>        <pmd><p>Feuchte MW</p><u>% rF</u><pd><dn>25062015</dn></pd></pmd>        </pmdl>";
  xml = xml.replace(/\s+/g, ""); //remove spaces
  stationPmdl= stationPmdl.replace(/\s+/g, ""); //remove spaces
  if(he.escape(xml)===he.escape(stationPmdl)){
    console.log("text is gleich");
  }else{
    console.log(he.escape(stationPmdl));
  }
  res.send(`Station ${stationName} mit ID: ${stationId} mit pmdl: ${he.escape(stationPmdl)}`)
})

app.listen(PORT, () => {  // Listen on port 3000
  console.log(`Server is running at http://localhost:${PORT}`);
});

