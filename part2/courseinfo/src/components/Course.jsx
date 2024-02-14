const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part, exercises}) => {
  return (
      <p>{part} {exercises}</p>
  )
}

const Course = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)
  return (
    <div>
        <Header course={course.name} />
        {course.parts.map(part =>
          <Part key={part.id} part={part.name} exercises={part.exercises}/>
        )}
        <div><strong>total of {total} exercises</strong></div>
    </div>
  )
}

export default Course