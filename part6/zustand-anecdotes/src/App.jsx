import AnecdotesList from './components/AnecdotesList'
import AnecdotesForm from './components/AnecdotesFrom'
import Filter from './components/Filter'

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdotesList />
      <AnecdotesForm />
    </div>
  )
}

export default App