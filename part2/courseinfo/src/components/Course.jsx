const Header = ({ course }) => <h1>{course}</h1>

const Part = (props) => {
  return (
      <p>{props.part} {props.exercises}</p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
        {course.parts.map(part =>
          <Part key={part.id} part={part.name} exercises={part.exercises}/>
          )}
    </div>
  )
}

export default Course