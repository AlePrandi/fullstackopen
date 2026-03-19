import { useState } from 'react'

const ShowText = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}


const Button = ({onClick, text}) => {
  return(
    <button onClick={onClick}>{text}</button>
  )
}

const StaticLine = ({text, value}) => {
  return(
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Perc = ({text, value}) => {
  return(
    <>
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [avg, setAvg] = useState(0)

  const HandleGood = () => {
    setGood(good + 1)
    setAvg(avg + 1)
    setTotal(total + 1)
  }

  const HandleNeutral = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const HandleBad = () => {
    setBad(bad + 1)
    setAvg(avg - 1)
    setTotal(total + 1)
  }

  if(total > 0){
    return (
      <div>
        <ShowText text="give feedback" />
        <Button onClick={HandleGood} text="good"/>
        <Button onClick={HandleNeutral} text="neutral"/>
        <Button onClick={HandleBad} text="bad"/>
        <ShowText text="statistic" />
        <table>
          <tbody>
            <StaticLine text="good" value={good}/>
            <StaticLine text="neutral" value={neutral}/>
            <StaticLine text="bad" value={bad}/>
            <StaticLine text="all" value={total}/>
            <StaticLine text="average" value={avg / total}/>
            <Perc text="positive" value={(good / total) * 100}/>
          </tbody>
        </table>
      </div>
    )
  }else{
    return (
      <div>
        <ShowText text="give feedback" />
        <Button onClick={HandleGood} text="good"/>
        <Button onClick={HandleNeutral} text="neutral"/>
        <Button onClick={HandleBad} text="bad"/>
        <ShowText text="statistic" />
        <table>
          <tbody>
            <StaticLine text="No feedback given" value=""/>
          </tbody>
        </table>
      </div>
    )
  }
}

export default App