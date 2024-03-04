const Country = ( {country, length}) => {
    if (length > 1) {
        return (
            <p>{country.name.common}</p>
        )
    }
    const officialLangs = Object.values(country.languages)
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {officialLangs.map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`${country.name.common}'s flag`}/>
        </div>
    )
}

export default Country