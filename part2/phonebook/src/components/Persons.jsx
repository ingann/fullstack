import Person from './Person'

const Display = ({persons}) => {
    return (
        <table>
            {persons.map(person =>
            <Person key={person.id} name={person.name} number={person.number}/>
            )}
        </table>
    )
}

export default Display