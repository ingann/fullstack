import { useState } from 'react'

const Header = (props) => {
  console.log(props)  
  return <h1>{props.text}</h1>
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  return (
    <div>
      {props.text} {props.value}
    </div>
  )
}

const Average = (props) => {
  let result = 0
  if (props.all != 0) {
    result = props.value/props.all
  }
  return (
    <div>
      {props.text} {result}
    </div>
  )
}

const Positive = (props) => {
  let result = 0
  if (props.all != 0) {
    result = (props.value/props.all) * 100
  }
  return (
    <div>
      {props.text} {result} %
    </div>
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
      <Statistics text='good' value={good} />
      <Statistics text='neutral' value={neutral} />
      <Statistics text='bad' value={bad} />
      <Statistics text='all' value={allClicks} />
      <Average text='average' value={average} all={allClicks} />
      <Positive text='positive' value={good} all={allClicks}/>
    </div>
  )
}

export default App