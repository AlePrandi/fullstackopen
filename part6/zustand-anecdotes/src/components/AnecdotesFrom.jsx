import { useAnecdoteActions } from '../store'

const AnecdotesForm = () => {
    const { add } = useAnecdoteActions()
    const addAnecdote = (e) => {
        e.preventDefault()
        const text = e.target.NewAnecdote.value
        add(text)
        e.target.reset()
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="NewAnecdote" />
                </div>
                <button type="submit" >create</button>
            </form>
        </>
    )

}

export default AnecdotesForm