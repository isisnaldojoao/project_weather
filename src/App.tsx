import {useState, FormEvent} from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaLocationDot } from "react-icons/fa6";


interface CityProps {
  name: string;
  main:{
    temp: number;
    humidity: number;
  }
  weather: Weather[];
}

interface Weather {
  icon: string;
  description: string;
}


export default function App (){

  const [city,setCity]= useState("")
  const [climate,setClimate] = useState<CityProps | null >(null)
  const key = 'c585dea8b051f162d7e91f40dc2697ab'
  const apiUnsplash = "https://source.unsplash.com/1600x900/?";
  const [wallpaper,setWallpaper] = useState("");
  const [bg,setBg]= useState(false)

  async function registerCity(e: FormEvent) {
    e.preventDefault()
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}&lang=pt_br`);
      if(!response.ok){
        throw new Error('Cidade não encontrada')
      }
      const data = await response.json()

      setClimate(data);  
      console.log(data);
      cityWallpaper();
      setBg(true);
      setCity("")
    }catch(error){
      setCity("")
      setClimate(null)
      setBg(false)
      alert("Nenhuma cidade foi encontrada! Tente novamente")
    }
  }

  async function cityWallpaper(){
    const response = await fetch(`${apiUnsplash}+${city}`)
    const data = await response.url
    
    setWallpaper(data)
  }

  const bgStyle = {
    backgroundColor: bg ? 'transparent' : '#A9A9A9',
    backgroundImage: bg ? `url(${wallpaper})` : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }
  
  return (
    
    <main className="w-full flex items-center justify-center h-screen"
    style={bgStyle}
    >
      <section  className="flex bg-slate-600 w-[400px] justify-center rounded-lg" style={{ boxShadow:'0px 2px 30px 10px'}}>
        <div className="flex flex-col m-5 ">
        <label className='text-white text-center font-semibold m-4'>Confira o clima de uma cidade:</label>
          <div className="flex ">
            <input 
            className="outline-none h-[40px] w-[300px] rounded-lg p-2"
            title="answer"
            value={city}
            onChange={(e)=> setCity(e.target.value)}
            />
            <button
            className='flex bg-slate-900 w-8 items-center justify-center rounded-lg ml-2'
            title="search"
            onClick={registerCity}
            >
              <FiSearch color='#fff'/>
            </button>
          </div>
        {climate && (
          <form className='flex flex-col items-center m-5 animate-pulse'>
          <label className='flex mt-5 items-center justify-center text-white font-bold'><FaLocationDot/>{climate?.name}</label>
          <img alt='climate'
          src={`http://openweathermap.org/img/wn/${climate?.weather[0].icon}.png`}
          width={150}
          height={150}
          />
          <label className='flex font-bold text-white'>{climate?.main.temp} °C</label>
          <label className='flex text-white font-bold'>
            Clima: <span className='font-normal'>{climate?.weather[0].description}</span>
          </label>
          <label className='flex text-white font-bold'>
            Humidade: <span  className='font-normal'> {climate?.main.humidity}%</span>
          </label>
        </form>
        )}
        </div>
      </section>
    </main>

  )
}