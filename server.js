import express from 'express';
import 'dotenv/config';
import { stations } from './sharedObjects.js';
import he from "he";
import xmlBeautify from "xml-beautify";
import beautify from "xml-beautifier";
import multer  from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Replicate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

const PORT = process.env.PORT_HTTP || 2500;
const upload = multer({ dest: 'file-uploads/' });
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
  let xml = '<root><person><name>John</name></person></root>';
  xml = stations[0].pmdl;
  let xml2 = beautify(xml);
  console.log(xml2);  
  let xml4 =  xml2.replace(/\n/g, "\\n");
  console.log(xml4);
  res.render('index', {textIntro, xml, xml2, xml4, configFileText}); 
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
  let textIntro="Hier kann die aktuell genutzt Konfigurationsdatei hochgeladen werden. Es wird anschließend "
  +"die Umweltparameterliste aus dieser Konfigurationsdatei mit der Umweltparameterliste aus den XML-responses"
  +" der einzelnen Stationen vom MDS verglichen.";
  res.render('station-compare', {textIntro, configFileText});
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
    console.log("text is gleich: " + beautify(stationPmdl));
  }else{
    console.log(he.escape(stationPmdl));
  }
  res.send(`Station ${stationName} mit ID: ${stationId} mit pmdl: ${beautify(stationPmdl)}`)
})


app.post('/check-answer', (req, res) => {
  const answer = req.body.answer;
  if (answer === 'Paris') {
    res.send('Correct!');
  } else {
    res.send('Incorrect. The correct answer is Paris.');
  }
});

app.post('/check-answers', (req, res) => {
  const question1 = req.body.question1;
  const question2 = req.body.question2;
  const question3 = req.body.question3;

  let score = 0;

  if (question1 === 'Paris') {
    score++;
  }
  if (question2 === 'Jupiter') {
    score++;
  }
  if (question3 === 'Vatican City') {
    score++;
  }

  res.send(`You scored ${score} out of 3. Here are the correct answers:<br>
  1. What is the capital of France? - Paris<br>
  2. What is the largest planet in our solar system? - Jupiter<br>
  3. What is the smallest country in the world? - Vatican City`);
});

app.post('/check-answers2', (req, res) => {
  const question1 = req.body.question1;
  const question2 = req.body.question2;
  const question3 = req.body.question3;
  const realm = req.body.realm;
  const username = req.body.username;

  let score = 0;

  if (question1 === 'Paris') {
    score++;
  }
  if (question2 === 'Jupiter') {
    score++;
  }
  if (question3 === 'Vatican City') {
    score++;
  }

  res.send(`You scored ${score} out of 3. Here are the correct answers:<br>
  1. What is the capital of France? - Paris<br>
  2. What is the largest planet in our solar system? - Jupiter<br>
  3. What is the smallest country in the world? - Vatican City<br>
  Your selected Realm is: ${realm}<br>
  Your World of Warcraft Username is: ${username}`);
});

let configFileText ="Noch keine Konfigurationsdatei hochgeladen bzw. ist die Variable leer.";

app.post('/config-file-upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'file-uploads', req.file.filename);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err || (data.length==0)) {
          return res.status(500).send('Error reading file');
      }      
      configFileText = data;
      console.log(configFileText);
      let textIntro = new Date().toUTCString()+ ": File uploaded and content saved/printed to console."
      // res.render('file-uploaded', {textIntro, configFileText})      
      res.render('station-compare', {textIntro, configFileText});
  });
});

app.post('/config-file-textArea', (req, res)=>{
  console.log("file up");
  //req.body; { textAreaConfigFile: '1111' }
  configFileText = req.body.textAreaConfigFile; //use here beautify()
  console.log(configFileText);
  let textIntro = new Date().toUTCString()+ ": Content from textarea sent and content saved/printed to console."
  res.render('station-compare', {textIntro, configFileText});
})

app.listen(PORT, () => {  // Listen on port 3000
  console.log(`Server is running at http://localhost:${PORT}`);
});

