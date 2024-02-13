import { useState } from 'react'

const Header = (props) => {
  return <h1>{props.text}</h1>
}

const StatisticLine = (props) => {
  if (props.text == 'positive') {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )

}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  if (props.all == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good}/>
        <StatisticLine text='neutral' value={props.neutral}/>
        <StatisticLine text='bad' value={props.bad}/>
        <StatisticLine text='all' value={props.all}/>
        <StatisticLine text='average' value={props.avg/props.all}/>
        <StatisticLine text='positive' value={(props.good/props.all)*100}/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGoodClick = () => {
    setAll(allClicks + 1)
    setAverage(average + 1)
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks + 1)
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks + 1)
    setAverage(average - 1)
    setBad(bad + 1)
  }

  return (
      <div>
        <Header text='give feedback' />
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <Header text='statistics' />
        <Statistics good={good} neutral={neutral} bad={bad} all={allClicks} avg={average} pos={good}/>
      </div>
  )
}

export default App