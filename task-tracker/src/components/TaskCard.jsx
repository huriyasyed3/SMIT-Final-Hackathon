// import React, { useState } from 'react';

// const TaskCard = ({ task, onDelete, onEdit }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState(task.title);

//   const handleSave = () => {
//     onEdit(task._id, editTitle);
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white p-4 mb-4 rounded shadow">
//       {isEditing ? (
//         <div>
//           <input
//             type="text"
//             value={editTitle}
//             onChange={(e) => setEditTitle(e.target.value)}
//             className="p-2 border rounded w-full mb-2"
//           />
//           <button
//             onClick={handleSave}
//             className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
//           >
//             Save
//           </button>
//         </div>
//       ) : (
//         <>
//           <h3 className="font-bold">{task.title}</h3>
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(task._id)}
//             className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default TaskCard;
"use client"

import { useState } from "react"
import { PencilIcon, TrashIcon, CheckIcon, XIcon, ClockIcon } from "@heroicons/react/outline"

const TaskCard = ({ task, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleSaveEdit = () => {
    if (editedTitle.trim() !== "") {
      onEdit(task._id, editedTitle)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedTitle(task.title)
    setIsEditing(false)
  }

  // Get random date for demo purposes (in a real app, this would come from the task)
  const getRandomDate = () => {
    const today = new Date()
    const randomDays = Math.floor(Math.random() * 14) - 7 // -7 to +7 days
    today.setDate(today.getDate() + randomDays)
    return today.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Get priority badge styling
  const getPriorityBadge = () => {
    // In a real app, priority would come from the task
    const priorities = ["Low", "Medium", "High"]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]

    let badgeStyle = ""
    switch (priority) {
      case "Low":
        badgeStyle = "bg-green-100 text-green-800"
        break
      case "Medium":
        badgeStyle = "bg-blue-100 text-blue-800"
        break
      case "High":
        badgeStyle = "bg-red-100 text-red-800"
        break
      default:
        badgeStyle = "bg-gray-100 text-gray-800"
    }

    return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeStyle}`}>{priority}</span>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            rows="2"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveEdit}
              className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-800 font-medium">{task.title}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                title="Edit task"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                title="Delete task"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-3.5 h-3.5 mr-1" />
              <span>{getRandomDate()}</span>
            </div>

            <div className="flex items-center space-x-2">
              {getPriorityBadge()}
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {task.assignedTo ? task.assignedTo.substring(0, 1).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard
