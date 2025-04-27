// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';
// import TaskCard from './TaskCard';
// import api from '../services/api';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import Swal from 'sweetalert2';

// const TaskBoard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');

//   const fetchTasks = async () => {
//     try {
//       const { data } = await api.get('/tasks');
//       setTasks(data);
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error!', 'Failed to fetch tasks!', 'error');
//     }
//   };

//   const handleCreateTask = async () => {
//     if (!newTask.trim()) {
//       Swal.fire('Warning!', 'Task name cannot be empty!', 'warning');
//       return;
//     }
//     try {
//       const { data } = await api.post('/tasks', { title: newTask, assignedTo: user._id, status: 'To Do' });
//       setTasks([...tasks, data]);
//       setNewTask('');
//       Swal.fire('Success!', 'Task created successfully!', 'success');
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error!', 'Failed to create task!', 'error');
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await api.delete(`/tasks/${taskId}`);
//       setTasks(tasks.filter(task => task._id !== taskId));
//       Swal.fire('Deleted!', 'Task has been deleted.', 'success');
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error!', 'Failed to delete task!', 'error');
//     }
//   };

//   const handleEditTask = async (taskId, updatedTitle) => {
//     try {
//       const { data } = await api.put(`/tasks/${taskId}`, { title: updatedTitle });
//       setTasks(tasks.map(task => task._id === taskId ? data : task));
//       Swal.fire('Updated!', 'Task updated successfully!', 'success');
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error!', 'Failed to update task!', 'error');
//     }
//   };

//   const handleOnDragEnd = (result) => {
//     const { destination, source } = result;
//     if (!destination) return;

//     const reorderedTasks = Array.from(tasks);
//     const [movedTask] = reorderedTasks.splice(source.index, 1);
//     movedTask.status = destination.droppableId;

//     reorderedTasks.splice(destination.index, 0, movedTask);
//     setTasks(reorderedTasks);

//     // Update task status in the backend
//     api.put(`/tasks/${movedTask._id}`, { status: movedTask.status });
//   };

//   useEffect(() => {
//     if (!user) navigate('/');
//     fetchTasks();
//   }, [user, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-8">
//       <div className="mb-6 flex gap-4 justify-between">
//         <input
//           type="text"
//           placeholder="Enter new task..."
//           className="w-full max-w-xs p-3 rounded-lg border border-gray-300 shadow-md"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//         />
//         <button
//           onClick={handleCreateTask}
//           className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Create Task
//         </button>
//       </div>

//       <DragDropContext onDragEnd={handleOnDragEnd}>
//         <div className="flex gap-8">
//           {['To Do', 'In Progress', 'Done'].map((status) => (
//             <Droppable key={status} droppableId={status}>
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className="bg-white p-4 rounded-lg shadow-lg w-1/3 h-[70vh] overflow-y-auto"
//                 >
//                   <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">{status}</h2>
//                   {tasks.filter(task => task.status === status).map((task, index) => (
//                     <Draggable key={task._id} draggableId={task._id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="mb-4"
//                         >
//                           <TaskCard
//                             task={task}
//                             onDelete={handleDeleteTask}
//                             onEdit={handleEditTask}
//                           />
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default TaskBoard;



"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import TaskCard from "./TaskCard"
import api from "../services/api"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Swal from "sweetalert2"
import { PlusIcon, ClipboardListIcon } from "@heroicons/react/outline"

const TaskBoard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get("/tasks")
      setTasks(data)
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch tasks!",
        confirmButtonColor: "#3b82f6",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Task",
        text: "Task name cannot be empty!",
        confirmButtonColor: "#3b82f6",
      })
      return
    }
    try {
      const { data } = await api.post("/tasks", { title: newTask, assignedTo: user._id, status: "To Do" })
      setTasks([...tasks, data])
      setNewTask("")
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Task created successfully!",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create task!",
        confirmButtonColor: "#3b82f6",
      })
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter((task) => task._id !== taskId))
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Task has been deleted.",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete task!",
        confirmButtonColor: "#3b82f6",
      })
    }
  }

  const handleEditTask = async (taskId, updatedTitle) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { title: updatedTitle })
      setTasks(tasks.map((task) => (task._id === taskId ? data : task)))
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Task updated successfully!",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update task!",
        confirmButtonColor: "#3b82f6",
      })
    }
  }

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const reorderedTasks = Array.from(tasks)
    const [movedTask] = reorderedTasks.splice(source.index, 1)
    movedTask.status = destination.droppableId

    reorderedTasks.splice(destination.index, 0, movedTask)
    setTasks(reorderedTasks)

    // Update task status in the backend
    api
      .put(`/tasks/${movedTask._id}`, { status: movedTask.status })
      .then(() => {
        // Optional: Show a subtle notification
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        })
        Toast.fire({
          icon: "success",
          title: `Task moved to ${destination.droppableId}`,
        })
      })
      .catch((err) => {
        console.error(err)
        // Revert the UI change if the API call fails
        fetchTasks()
      })
  }

  useEffect(() => {
    if (!user) navigate("/")
    fetchTasks()
  }, [user, navigate])

  // Status column styling based on status
  const getColumnStyle = (status) => {
    switch (status) {
      case "To Do":
        return "border-blue-400 bg-blue-50"
      case "In Progress":
        return "border-amber-400 bg-amber-50"
      case "Done":
        return "border-green-400 bg-green-50"
      default:
        return "border-gray-300"
    }
  }

  // Status header styling based on status
  const getHeaderStyle = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-500 text-white"
      case "In Progress":
        return "bg-amber-500 text-white"
      case "Done":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Get task count for each status
  const getTaskCount = (status) => {
    return tasks.filter((task) => task.status === status).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Board</h1>
          <p className="text-gray-600">Organize and manage your tasks efficiently</p>
        </div>

        {/* Task Creation */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <ClipboardListIcon className="w-5 h-5 mr-2 text-blue-500" />
            Create New Task
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
            />
            <button
              onClick={handleCreateTask}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-md"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Task
            </button>
          </div>
        </div>

        {/* Task Board */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["To Do", "In Progress", "Done"].map((status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-xl shadow-lg border-t-4 ${getColumnStyle(status)} transition-all ${
                        snapshot.isDraggingOver ? "bg-gray-100 shadow-xl" : "bg-white"
                      }`}
                    >
                      {/* Column Header */}
                      <div className={`p-4 rounded-t-lg ${getHeaderStyle(status)}`}>
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">{status}</h2>
                          <span className="bg-white bg-opacity-30 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {getTaskCount(status)}
                          </span>
                        </div>
                      </div>

                      {/* Task List */}
                      <div className="p-4 h-[calc(70vh-2rem)] overflow-y-auto">
                        {tasks.filter((task) => task.status === status).length === 0 ? (
                          <div className="text-center py-8 text-gray-500 italic border-2 border-dashed border-gray-200 rounded-lg">
                            No tasks yet
                          </div>
                        ) : (
                          tasks
                            .filter((task) => task.status === status)
                            .map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 transform transition-all ${
                                      snapshot.isDragging ? "rotate-1 scale-105 shadow-xl z-10" : ""
                                    }`}
                                  >
                                    <TaskCard task={task} onDelete={handleDeleteTask} onEdit={handleEditTask} />
                                  </div>
                                )}
                              </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}

export default TaskBoard
