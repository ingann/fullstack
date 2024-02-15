const AddPerson = ( {addPerson, newName, handleBookChange} ) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input 
                value={newName}
                onChange={handleBookChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default AddPerson