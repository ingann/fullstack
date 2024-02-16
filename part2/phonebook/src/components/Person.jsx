const Person = ({ name, number }) => {
    return (
        <tbody>
            <tr>
                <td>{name}</td>
                <td>{number}</td>
            </tr>
        </tbody>
    )
}

export default Person