const Course = (props) => (
  <div>
    <Header course={props.course.name} />
    <Content parts={props.course.parts}/>
  </div>
)

const Header = (props) => <h2>{props.course}</h2>

const Content = ({parts}) => (
  <div>
    {parts.map((part) => <Part key={part.id} part={part} />)}
    <Total total={parts.reduce((total, value) => total + value.exercises, 0)}/>
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <h3>Number of exercises {props.total}</h3>

export default Course