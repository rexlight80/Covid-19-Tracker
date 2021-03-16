import React, { useState,useEffect} from "react"
import './App.css';
import {FormControl, MenuItem, Select,Card,CardContent} from "@material-ui/core"
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table"
import LineGraph from "./LineGraph"
import {sortData,prettyPrintStat} from "./util"
import "leaflet/dist/leaflet.css"

function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState([]);
  const[tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState([34.80746,-40.4796])
  const[mapZoom,setMapZoom]=useState(3);
 const[mapCountries,setMapCountries]=useState([]);
 const[casesType,setCasesType]=useState("cases");
  
 
 const getCountries=async ()=>{
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then(response=>response.json())
    .then(data=>{
      const countries=data.map(country=>(
        {
          name:country.country,
          value:country.countryInfo.iso2
        }
      ))

      const sortedData=sortData(data)
      setCountries(countries);
      setMapCountries(data);
      setTableData(sortedData)

    })
  }

  useEffect(()=>{
          fetch("https://disease.sh/v3/covid-19/all")
          .then(response=>response.json())
          .then(data=>{
            setCountryInfo(data);
          })
  },[]);

  
  useEffect(()=>{
        getCountries()
  },[countries]);

  const onCountryChange= async (event)=>{
    const countryCode=event.target.value
    setCountry(countryCode);

    const url = countryCode === "worldwide"? "https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
         setCountryInfo(data);
         setCountry(countryCode);
         
         setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
         setMapZoom(4);
    })
  }
  return (
    <div className="app">
    <div className="app__left">
    <div className="app__header">
    <h1>COVID-19 Tracker</h1>
    <FormControl className="app__dropdown">
    <Select 
    variant="outlined"
    
    value={country}
    onChange={onCountryChange}
    >
    <MenuItem value="worldwide">Worldwide</MenuItem>
{countries.map(country=>(
  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
))}
    
    
    
    </Select>
    </FormControl>
    </div>
    
    <div className="app__status">
    <InfoBox  
    isRed
    active={casesType==="cases"}
    title="Coronavirus cases"
    onClick={e=>setCasesType("cases")} 
    cases={prettyPrintStat(countryInfo.todayCases)} 
    total={prettyPrintStat(countryInfo.cases)}/>
    <InfoBox  
    active={casesType==="recovered"}
    title="Recovered" 
    onClick={e=>setCasesType("recovered")}
    cases={prettyPrintStat(countryInfo.todayRecovered)} 
    total={prettyPrintStat(countryInfo.recovered)}/>
    <InfoBox  
    isRed
    active={casesType==="deaths"}
    title="Deaths" 
    onClick={e=>setCasesType("deaths")}
    cases={prettyPrintStat(countryInfo.todayDeaths)} 
    total={prettyPrintStat(countryInfo.deaths)}/>
    </div>
     <Map
     casesType={casesType}
     center={mapCenter}
     zoom={mapZoom}
     countries={mapCountries}
     
     />
    
    </div>
    <Card className="app__right">
    <CardContent>
    <h3>Live cases by country</h3>
    <Table countries={tableData}/>
    <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
    <LineGraph casesType={casesType} className="app__graph"/>
    </CardContent>
    </Card>
      
    </div>
  );
}

export default App;
