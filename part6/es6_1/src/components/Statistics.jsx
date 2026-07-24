import { useCounter } from '../store'
const Statistics = () => {
  const { goodCounter, badCounter, neutralCounter, avgCounter, totCounter } = useCounter()
  const good = goodCounter
  const neutral = neutralCounter
  const bad = badCounter
  const all = totCounter
  const average =  (totCounter != 0) ? avgCounter / totCounter : 0
  const positive = (totCounter != 0) ? (goodCounter / totCounter) * 100 : 0
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive} %</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
