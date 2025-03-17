import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

const App = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [taskUpdate, setTaskUpdate] = useState({
    isUpdate: false,
    id: "",
    task: ""
  });

  const getTodos = async () => {
    try {
      const {data} = await axios.get('http://localhost:8080/todos');
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const taskSave = async (e) => {
    e.preventDefault();
    // if (task.trim() !== "") {
      try {
        
          await axios.post('http://localhost:8080/todos', { task, status: false,  });
          setTask(""); 
          getTodos(); 
        
      
      } catch (error) {
        console.error("Error saving todo:", error);
      }
    // }
  };

  
  const taskDelete = async (id) => {
    try {
    
      await axios.delete(`http://localhost:8080/todos/${id}`);
      getTodos(); 
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completetask = async (id, Status) => {

    try {

      await axios.patch(`http://localhost:8080/todos/${id}`, {
        status: !Status,
      });
      getTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  
  const updatetask = async (id, task) => {
    if (task.trim() !== "") {
      setTaskUpdate({isUpdate:true,id:id,task:task})
      const selectTask = await axios.get(`http://localhost:8080/todos/${id}`)
      if(selectTask.status == 200){
        setTask(selectTask.data.task);
      }else{
        console.log('error')
      }
    }
  };
  
  const updateSingleTask = async (id,task) => {
    try {
     
      const taskUpdate = await axios.patch(`http://localhost:8080/todos/${id}`, {
        task: task
      });

      if(taskUpdate.status == 200) {
        console.log("Task Updated")
        setTaskUpdate({
          isUpdate: false,
          id: "",
          task: ""
        })
        getTodos();
      }else{
        console.log("error")
      }
 
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  const handleUpdateTask = (event) => {
    const {value} = event.target;
    setTaskUpdate({
      ...taskUpdate,
      task: value
    })
  }
  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={taskSave}>
        <input onChange={handleChange} type="text" value={task} />
        <button type="submit" disabled={task.trim() === ""}>
          Save
        </button>
      </form>
      <h2>Todos List</h2>
      <ul>
        {todos.map((item) => {
          const { _id, task, status } = item;
          return (
            <li
              key={_id}
              style={{
                width: "600px",
                margin:"auto",
                display: "flex",
                justifyContent:"space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                checked= {status}
                onChange={() => completetask(_id, status)} 
              />
              {
                taskUpdate.isUpdate && _id == taskUpdate.id ?
                <>
                <input type="text" onChange={handleUpdateTask} value={taskUpdate.task} />
                <button onClick={()=>updateSingleTask(taskUpdate.id,taskUpdate.task)}>update</button>
                </>
                :

              <p className="task"  style={{ textDecoration: status ? "line-through" : "none" } }>
                {task}
                </p>
              }
            
              <button onClick={() => taskDelete(_id)} style={{ width: "150px", height: "30px" }}>
                Delete
              </button>
              <button disabled={status?"false":""} style={{width: "150px", height: "30px" }} onClick={()=>updatetask(_id,task)} >
                Edit
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
