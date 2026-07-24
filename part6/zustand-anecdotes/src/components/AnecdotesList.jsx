import { useAnecdotes, useAnecdoteActions, useFilter } from '../store'

const AnecdotesList = () => {

    const anecdotes = useAnecdotes()
    const filter = useFilter()
    const { like } = useAnecdoteActions()

    const sorted = anecdotes.toSorted((a,b) => b.votes - a.votes)
    const toShow = sorted.filter(n => n.content.includes(filter))

    const vote = id => {
    console.log('vote', id)
    like(id);
    }

    return(
        <>
        {toShow.map(anecdote => (
            <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
            </div>
        ))}
        </>
    )
}

export default AnecdotesList