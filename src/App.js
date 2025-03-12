import React, {  useEffect, useState } from "react";
import axios from "axios"
 
const App = () => {
  const [task, settask] = useState("");
  const [todos, settodos] = useState([]);
 
  useEffect = (() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);


  useEffect = (() => {
    const gettodos = async () =>{
      try{
        const todolist = await axios.get("http://localhost:8080/todos");
        if (todolist) {
          const todos = await todolist.json();
          settodos(todos);
          console.log(todos);
        }
        else{
          console.log('error in fetch data')
        }
      }
      catch (err){
        console.log('error in fetch api')

      }
    };
    gettodos();

  },[]);


  const handlechange = (e) => {
    settask(e.target.value);
  };
  const tasksave = (e) => {
    e.preventDefault();
    if (task) {
      if (task.trim() !== "") {
        settodos([
          ...todos,
          {
            id: parseInt(Math.random() * 100000000),
            content: task,
            checked: false,
          },
        ]);
        settask("");
      }
    }
  };
  const taskdelete = (index) => {
    const newlist = settodos(todos.filter((_, i) => i !== index));
 
    settask(newlist);
  };
 
  const updatetask = (index) => {
    const newlist = todos.filter((_, i) => i === index);
    settask([newlist[0].task]);
    const taskedit = todos.filter((item) => {
      return item.index !== index;
    });
    settask(taskedit);
  };
 
  const handleCheckBtn = (e) => {
    const id = e.target.name;
    const value = e.target.checked;
    const newList = todos.map((el) => {
        if (el.id === id) {
            el.checked = !value;
            return el;
        } else {
            return el;
        }
    });
    // console.log(id, value)
    settodos(newList)
  };
 
  return (
    <>
      <div>
        <h1>Todolist</h1>
        <form onSubmit={tasksave}>
          <input onChange={handlechange} type="text" value={task} />
          <button type="submit" disabled={task?.trim() === ""}>
            Save
          </button>
        </form>
        <h2>Todos list</h2>
        <ul>
          {todos.map((item, index) => {
            const { content, checked, id } = item;
            return (
              <li
                key={id}
                style={{
                  width: "fitcontent",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="checkbox"
                  name={id}
                  onChange={handleCheckBtn}
                  checked={checked}
                ></input>
                {/* <p> */}
                <p
                  style={{ textDecoration: checked ? "line-through" : "none" }}
                >
                  {content}
                </p>
                <button
                  style={{ width: "150px", height: "30px" }}
                  onClick={() => taskdelete(index)}
                >
                  Delete
                </button>
                <button
                  style={{ width: "150px", height: "30px" }}
                  onClick={() => updatetask(index)}
                >
                  Update
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
 
export default App;
 