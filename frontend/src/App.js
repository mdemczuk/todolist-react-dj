import React, { useEffect } from "react";
import EmployeeList from "./components/EmployeeList";

function App() {
  useEffect(() => {
    document.title = "Employee list";
  }, []);
  return (
    <>
      <head>
        <title>Employee list</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        ></link>
      </head>
      <div className="App">
        <EmployeeList></EmployeeList>
      </div>
      <p m={2} align="center"><a target="_blank" href="https://icons8.com/icon/61195/todo-list">Todo List</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
    </>
  );
}

export default App;
