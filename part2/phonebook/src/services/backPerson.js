import axios from 'axios'

const personsUrl = "/api/persons"


const getData = () => {
    return axios.get(personsUrl)
}

const AddPerson = (noteObject, setFunct, arr) => {
    axios
        .post(personsUrl, noteObject)
        .then(response => {
            setFunct(arr.concat(response.data))
        })
}

const update = (id, noteObject, setFunct, arr, setErrorMessage) => {
    axios
        .put(`${personsUrl}/${id}`, noteObject)
        .then(response => {
            setFunct(arr.map(p => p.id !== id ? p : response.data))
        }).catch(error => {
            setErrorMessage(`Information of ${noteObject.name} has already been removed from the server`)
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000)
        })
}

const deletePerson = (id) => {
    return axios.delete(`${personsUrl}/${id}`)
}


export default { AddPerson, getData, update, deletePerson }