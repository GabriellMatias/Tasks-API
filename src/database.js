import fs from 'node:fs/promises'

const dataBasePath = new URL("tasksDataBase.json", import.meta.url)

export class DataBase {
  #database = {}
  #persist() {
    /*onde quero escrever e o que quero escrever  */
    fs.writeFile(dataBasePath, JSON.stringify(this.#database))
  }
  /*Inicializando */
  constructor() {
    fs.readFile(dataBasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  list(table) {
    const tasks = this.#database[table] ?? []
    return tasks
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = { id, ...row, ...data }
      this.#persist()
    }
  }


  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    /*persistindo dados em arquivo */
    this.#persist()
    return data
  }
}
