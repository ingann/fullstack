import { useState } from 'react'

const Header = (props) => {
  return <h1>{props.text}</h1>
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const GetRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

const MostVotes = ({arr}) => {
  let index = 0
  for (let i=0; i < arr.length; i++) {
    if (arr[i] > arr[index]) {
      index = i
    }
  }
  return (index)
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
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [max, setMax] = useState(0)

  const handleClick = () => {
    setSelected(GetRandomIntInclusive(0, 7))
  }

  const addVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    setMax(MostVotes({arr: copy}))
  }

  return (
    <div>
      <Header text='Anecdote of the day'/>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button handleClick={addVote} text='vote' />
      <Button handleClick={handleClick} text='next anecdote' />
      <Header text='Anecdote with most votes'/>
      <div>{anecdotes[max]}</div>
      <div>has {votes[max]} votes</div>
    </div>
  )
}

export default App