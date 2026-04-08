import axios from 'axios'

const personsUrl = "/api/persons"


const getData = () => {
    return axios.get(personsUrl)
}

const AddPerson = (noteObject, setFunct, arr, setMessage, setErrorMessage) => {
    axios
        .post(personsUrl, noteObject)
        .then(response => {
            setFunct(arr.concat(response.data))
            setMessage(`Added ${noteObject.name}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }).catch(error => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
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