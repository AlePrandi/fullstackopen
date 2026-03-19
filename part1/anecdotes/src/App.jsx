import { useState } from 'react'

const HeadText = ({text}) => {
  return(
    <>
      <h1>{text}</h1>
    </>
  )
}

const ShowVote = ({text1, value, text2}) => {
  return(
    <>
      <p>{text1} {value} {text2}</p>
    </>
  )

}

const GetRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const Button = ({onClick, text}) => {
  return (
    <>
    <button onClick={onClick}>{text}</button>
    
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  
  const n = anecdotes.length
  const arr = Array(n).fill(0)
  const [copy, setCopy] = useState([...arr])

  const Vote = (sel) => {
    const newCopy = [...copy]
    newCopy[sel]+=1
    setCopy(newCopy)
  }

  const HandleClick = () =>{
    setSelected(GetRandomInt(8))
  }

  const MaxIndex = (array) => {
    let max = 0
    for(let i = 0;i < array.length; i++){
      if(array[i] > array[max]){
        max = i
      }
    }

    return max
  }

  return (
    <div>
      <HeadText text="Anecdote of the day"/>
      {anecdotes[selected]}
      <ShowVote text1="Has" value={copy[selected]} text2="votes"/>
      <Button onClick={() => Vote(selected)} text="vote"/>
      <Button onClick={HandleClick} text="next anecdote"/>
      <HeadText text="Anecdote with most votes"/>
      {anecdotes[MaxIndex(copy)]}
      <ShowVote text1="Has" value={copy[MaxIndex(copy)]} text2="votes"/>
    </div>
  )
}

export default App