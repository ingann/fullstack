import Country from './Countryinfo'

const Display = ({countries, setShowFiltered}) => {
    if (countries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    }
    else if (countries.length > 1) {
        return (
            <div>
            {countries.map(country =>
                <Country key={country.name.official} country={country} length={countries.length} setShowFiltered={setShowFiltered}/>
            )}
        </div>
        )}
    else if (countries.length === 1) {
        return (
            <div><Country country={countries[0]} length={countries.length}/></div>
    )}
    else{
        return (
            <div>No matches found</div>
        )}
}

export default Display