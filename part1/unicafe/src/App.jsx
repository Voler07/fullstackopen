import { useState } from 'react'

const StatisticLine = ({text, value}) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good - bad
  const people = good + neutral + bad
  if(people == 0){
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={people} />
      <StatisticLine text="average" value={total / people} />
      <StatisticLine text="positive" value={good / people * 100 + "%"} />
    </table>
  )
}


const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [clicks, setClick] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  })
  
  const handleGoodClick = () => {
    setClick({
      ...clicks,
      good: clicks.good + 1
    })
  }
  
  const handleNeutralClick = () => {
    setClick({
      ...clicks,
      neutral: clicks.neutral + 1
    })
  }

  const handleBadClick = () => {
    setClick({
      ...clicks,
      bad: clicks.bad + 1
    })
  }


  return (
    <>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistics good={clicks.good} neutral={clicks.neutral} bad={clicks.bad} />
    </>
  )
}

export default App