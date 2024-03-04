import Country from './Countryinfo'

const Display = ({countries}) => {
    return (
        <div>
            {countries.map(country =>
                <Country key={country.name.official} country={country}/>
            )}
        </div>
    )
}

export default Display