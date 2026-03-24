const Header = ({text}) => {
  return(
    <>
      <h1>{text}</h1>
    </>
  )
}

const Part = ({part, exercise}) => {
  return (
    <>
      <p>{part} {exercise}</p>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <>
        {parts.map(part =>
          <Part key ={part.id} part ={part.name} exercise={part.exercises}/>
        )}
    </>
  )
}

const Total = ({parts}) => {
  const exerc = parts.map(part => part.exercises)
  console.log(exerc)
  const total = exerc.reduce((s,p) => s + p)
  return(
    <>
      <p><b>Total of {total} exercises</b></p>
    </>
  )
}

const CourseDesc = ({course}) => {
  return(
    <>
      <Header text={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

const Course = ({courses}) => {
  return(
    <div>
      {courses.map(course =>
        <CourseDesc key={course.id} course={course} />)
      }
    </div>
  )

}

export default Course