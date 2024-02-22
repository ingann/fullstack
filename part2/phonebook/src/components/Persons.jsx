import Person from './Person'

const Display = ({persons, removePerson}) => {
    return (
        <table>
            <tbody>
            {persons.map(person =>
                <Person key={person.id} name={person.name} number={person.number} id={person.id} removePerson={removePerson}/>
            )}
            </tbody>
        </table>
    )
}

export default Display