const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part, exercises}) => {
    return (
        <p>{part} {exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part.name} exercises={part.exercises}/>
            )}
        </div>
    )
}

const Total = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)
    return (
        <div><strong>total of {total} exercises</strong></div>
    )
}

const Course = ({ course }) => {
  return (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total course={course} />
    </div>
  )
}

export default Course