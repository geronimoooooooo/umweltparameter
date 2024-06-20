let stations = [
    {name: "Blaueis", id: 12345, umweltparameter: ["a","b", "c"], pmdl: "<pmdl>        <pmd><p>Lufttemp MW</p><u>C</u><pd><dn>25062015</dn></pd></pmd>        <pmd><p>Feuchte MW</p><u>% rF</u><pd><dn>25062015</dn></pd></pmd>        </pmdl>"},
    {name: "Hinterberghorn", id: "00111", umweltparameter: ["aa","bb", "cc"]},
    {name: "Ampel", id: 25062015, umweltparameter: ["aaa","bbb", "ccc"]}
    ];

    let stations2 = [];

let stationsMds2 = [
    {name: "Blaueis", id: 12345, umweltparameter: ["am","bmds", "cmds"], pmdl: "<pmdl>        <pmd><p>Lufttemp MW</p><u>C</u><pd><dn>25062015</dn></pd></pmd>        <pmd><p>Feuchte MW</p><u>% rF</u><pd><dn>25062015</dn></pd></pmd>        </pmdl>"},
    {name: "Ampel", id: 789, umweltparameter: ["aaamds","bbb", "ccc"]},
    {name: "Hinterberghorn", id: "09080126", umweltparameter: ["aamds","bb", "cc", "dmds"]}
    
    ];
    let stationsMds = [{name: "Hinterberghorn", id: "00111", umweltparameter: ["aamds","bb", "cc", "dmds"]}];

let stationsConfig = [];

export {stations, stations2, stationsMds, stationsMds2}