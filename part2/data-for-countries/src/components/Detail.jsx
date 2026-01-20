import Weather from './Weather'

const Detail = ({ country }) => {
    const capital = country.capital[0]
    const area = country.area

    console.log(`flag img: ${country.flags.png}`)

    return (
    <div>
        <h1>{country.name.common}</h1>
        
        <div>
            <p>Capital {capital}</p>
            <p>Area {area}</p>
        </div>

        <h2>Languages</h2>
        <ul>
            {Object.values(country.languages).map(item => <li key={item}>{item}</li>)}
        </ul>

        <img src={country.flags.png} alt={country.flags.alt} />

        <Weather 
          city={capital}
          lat={country.capitalInfo.latlng[0]}
          lon={country.capitalInfo.latlng[1]}
        />
    </div>
    )
}

export default Detail