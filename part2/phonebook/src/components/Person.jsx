const Person = ({ name, number, id, removePerson }) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{number}</td>
            <td><button onClick={() => removePerson(id, name)}>delete</button></td>
        </tr>
    )
}

export default Person