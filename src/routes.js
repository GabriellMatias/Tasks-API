import { buildRoutePath } from "./Utils/build-route-path.js"
import { DataBase } from "./database.js"
import { v4 } from "uuid"

const database = new DataBase()
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.Query
      const tasks = database.list('tasks', search ?{
        title: search,
        description: search
      }: null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: v4(),
        title,
        description,
        completed: false,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      database.delete("tasks", id)

      return res.writeHead(204).end()
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      database.update("tasks", id, {
        title, 
        description,
        updated_at: new Date()
      })
      return res.writeHead(204).end()
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params
      database.update("tasks", id, {
        completed:true,
        completed_at: new Date(),
        updated_at: new Date()
      })
      return res.writeHead(204).end()
    }
  }
]