import { useState, useEffect } from 'react'
import './App.css'

import cities from'./db'
// var cities = require("./db")


import './components/sidebar'
function App() {
  const [data,setData] = useState({})
  const [fivedata,setFivedata] = useState({})
  const [currentlo, setCurrentlo] = useState('')
  const [location, setLocation] = useState('')
  const [tempunits, setTempunits] = useState('metric')
  const [filteredCities, setFilteredCities] = useState([]);
  const today = new Date();


  useEffect(() => {
    handleLocationClick();
  }, []);


  useEffect(() => {
    const filteredCities = cities.filter(city =>
      city.city.toLowerCase().includes(location.toLowerCase())
    )
    .slice(0, 5);
    setFilteredCities(filteredCities);
  }, [location]);


  const handleSearch = (location) => {
searchLocation(location)
  }


const searchLocation = (location) => {
  if (event.key === 'Enter'){
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1c85bb61638ecd48af2af4fac40ef59c&units=${tempunits}`)
  .then(response => {
    return response.json()
  })
  .then(data => {
    setData(data);
    console.log(data)
  })

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=1c85bb61638ecd48af2af4fac40ef59c&units=${tempunits}`)
  .then(response =>{
    return response.json()
  })
  .then(fivedata => {
    setFivedata(fivedata)
    console.log(fivedata)
  })
  setLocation('')
  
  }
}

const handleSuggestionClick = (selectedCity) => {
  setLocation(''); 


  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=1c85bb61638ecd48af2af4fac40ef59c&units=${tempunits}`)
  .then(response => {
    return response.json()
  })
  .then(data => {
    setData(data);
    console.log(data)
  })

}




  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setCurrentlo({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1c85bb61638ecd48af2af4fac40ef59c&units=${tempunits}`)
  .then(response => {
    return response.json()
  })
  .then(data => {
    setData(data);
    console.log(data)
  })

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=1c85bb61638ecd48af2af4fac40ef59c&units=${tempunits}`)
  .then(response => {
    return response.json()
  })
  .then(fivedata =>{
    setFivedata(fivedata);
    console.log(fivedata)
  })
}

function handleMetricClick (){
  setTempunits('metric')
  console.log(setTempunits)
}

function handleImperialClick (){
  setTempunits('imperial')
  console.log(setTempunits)
}

const barStyle = {
  width: data.main ? `${data.main.humidity}%` : `0%`,
  height:8,
  borderRadius:15,

 }

  return (
    <>
    <div className='grid  contain  '>
    <div className='sidebar '>
    <div className='mt-5'>

    <input value={location} onChange={(event) => setLocation(event.target.value)}  onKeyPress={(event) => {
    if (event.key === 'Enter') {
      handleSearch(location);
    }
  }} placeholder='Enter City Name' type="text" className='search' />
  
    <button className='cirlce-button cl' onClick={handleLocationClick}><i className="fa-solid fa-location-crosshairs"></i></button>

    {location ?
    <div className='suggestions'>
  {filteredCities.map(city => (
    <div key={city.id}>
    <button  className='suggestion'  onClick={() => handleSuggestionClick(city.city)}>
     
     {city.city}
       
    </button>
    </div>
  ))}
</div> : null }

    </div>
  <div className='weatherinfo'>
  <img src={data.main ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png` : null} alt="" />
  </div>
  <h2 className='main-temp'>{data.main ? <span>{data.main.temp.toFixed()}</span> : null}<span className='unit'>℃</span></h2>
  <p className='condition mt-5'>{data.weather ? <span>{data.weather[0].main}</span> : null}</p>
  <p className='mt-20 opacity-70'>Today • {today.toDateString()}</p>
  <p className='my-5'><i className="fa-solid fa-location-dot"></i>   <span className='city opacity-70'>{data.name} {data.sys ? <span>,{data.sys.country}</span> : null} </span></p>
  </div>
        
     <div className='maincontent grid'>
      
      <div className='mt-5 temp-controls mx-14'>
      <button className='cirlce-button main-circle temp-select' onClick={handleMetricClick}>℃</button>
      <button className='cirlce-button main-circle temp-select ml-2' onClick={handleImperialClick}>℉</button>
      </div>

        {/* --------------------------------------------------------------------------------------------------------------------- */}
    
      <div className='days-grid px-14'>
        <div className='cards grid grid-rows-3'>
          <p className='date'>Tomorrow</p>
          <img src={fivedata.list ? `https://openweathermap.org/img/wn/${fivedata.list[4].weather[0].icon}@4x.png` : 'none'}  alt="" />
          <p className='high-temp self-center'>{fivedata.list ?
          <span>{fivedata.list[4].main.temp_max.toFixed()}</span> : null}°C <span className='low-temp pl-3'>{fivedata.list ?
            <span>{fivedata.list[4].main.temp_min.toFixed()}</span> : null}°C</span>
          </p>
        </div>

        <div className='cards grid grid-rows-3'>
          <p className='date'>{fivedata.list ?
            <span>{fivedata.list[12].dt_txt.split(' ')[0]} </span> : null}</p>
          <img src={fivedata.list ? `https://openweathermap.org/img/wn/${fivedata.list[12].weather[0].icon}@4x.png` : 'none'} alt="" />
          <p className='high-temp self-center'>{fivedata.list ?
          <span>{fivedata.list[12].main.temp_max.toFixed()}</span> : null}°C <span className='low-temp pl-3'>{fivedata.list ?
            <span>{fivedata.list[12].main.temp_min.toFixed()}</span> : null}°C</span>
          </p>
        </div>


        <div className='cards grid grid-rows-3'>
          <p className='date'>{fivedata.list ?
            <span>{fivedata.list[20].dt_txt.split(' ')[0]} </span> : null}</p>
          <img src={fivedata.list ? `https://openweathermap.org/img/wn/${fivedata.list[20].weather[0].icon}@4x.png` : 'none'} alt="" />
          <p className='high-temp self-center'>
          {fivedata.list ?
          <span>{fivedata.list[20].main.temp_max.toFixed()}</span> : null}°C <span className='low-temp pl-3'>{fivedata.list ?
            <span>{fivedata.list[20].main.temp_min.toFixed()}</span> : null}°C</span>
          </p>
        </div>

        <div className='cards grid grid-rows-3'>
          <p className='date'>{fivedata.list ?
            <span>{fivedata.list[28].dt_txt.split(' ')[0]} </span> : null}</p>
          <img src={fivedata.list ? `https://openweathermap.org/img/wn/${fivedata.list[28].weather[0].icon}@4x.png` : 'none'} alt="" />
          <p className='high-temp self-center'>
          {fivedata.list ?
          <span>{fivedata.list[28].main.temp_max.toFixed()}</span> : null}°C <span className='low-temp pl-3'>{fivedata.list ?
            <span>{fivedata.list[28].main.temp_min.toFixed()}</span> : null}°C</span>
          </p>
        </div>

        <div className='cards grid grid-rows-3'>
          <p className='date'>{fivedata.list ?
            <span>{fivedata.list[36].dt_txt.split(' ')[0]} </span> : null}</p>
          <img src={fivedata.list ? `https://openweathermap.org/img/wn/${fivedata.list[36].weather[0].icon}@4x.png` : 'none'} alt="" />
          <p className='high-temp self-center'>
          {fivedata.list ?
          <span>{fivedata.list[36].main.temp_max.toFixed()}</span> : null}°C <span className='low-temp pl-3'>{fivedata.list ?
            <span>{fivedata.list[36].main.temp_min.toFixed()}</span> : null}°C</span>
          </p>
        </div>
      </div>
      {/* --------------------------------------------------------------------------------------------------------------------- */}

      <div className="highlights mx-14">
          <h2 className='text-left  mb-6'>Today's Highlights</h2>
          <div className='grid grid-rows-2 grid-cols-2 gap-9 highlights-grid'>
            <div className='big-card'>
              <p className='wind-status mt-5'>Wind Speed</p>
            <p className='wind-num'>{data.wind ? <span>{data.wind.speed.toFixed()}</span> : null}<span className='mph'>mph</span></p>
            </div>

            <div className='big-card'>
              <p className='humidity mt-5'>Humidity</p>
              <p className='wind-num'>{data.main ? <span>{data.main.humidity}</span> : null}<span className='mph'>%</span></p>
              <div >
             <p className='opacity-70 humid-num'>0 <span>50</span> <span>100</span></p>
             <div className="bar">
              <span className='innerBar' style={barStyle}></span> 
              <p className='text-end percentage'>%</p>
             </div>
              </div>
            </div>

            <div className='medium-card'>
              <p className='humidity mt-4'>Visibility</p>
              <p className='wind-num'>{data.main ? <span>{data.visibility}</span> : null} <span className='mph'> miles</span></p>
            </div>

            <div className='medium-card'>
              <p className='humidity mt-4'>Air pressure</p>
              <p className='wind-num'>{data.main ? <span>{data.main.pressure}</span> : null} <span className='mph'> mb</span></p>
            </div>

          </div>
        </div>
      </div>

      </div>


    </>
  )
}

export default App
