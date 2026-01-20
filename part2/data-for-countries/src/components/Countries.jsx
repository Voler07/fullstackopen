import Detail from "./Detail"

const countries = ({
   countryToshow,
   setSearchWord
}) => {
    const len = countryToshow.length

    if (len === 0) {
        return null
    }
    
    if (len === 1) {
        return <Detail country={countryToshow[0]} />
    }

    if (len > 10) {
        return <p>Too many matches, specify another search</p>
    }

    return (
        <ul>
            {countryToshow.map(c => 
            <li key={c.name.common}>
                {c.name.common}
                <button onClick={()=>{
                    setSearchWord(c.name.common)
                }}>
                    show
                </button>
            </li>
            )}
        </ul>
    )

}

export default countries