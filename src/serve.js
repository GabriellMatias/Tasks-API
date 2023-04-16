import http from "node:http"

/*Quando o type do package e module tem que especificar o tipo do arquiv */
import { json } from "./middlawares/json.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "./Utils/extract-query-params.js"

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  /*requesting middleware */
  await json(req, res)

  const route = routes.find((route) => {

    return route.method === method && route.path.test(url)
  })
  if (route) {
    const routeParams = req.url.match(route.path)
    
    const {Query, ...params} = routeParams.groups

    req.params = params
    req.Query = Query ? extractQueryParams(Query) : {}
       
    return route.handler(req, res)
  }
  return res.writeHead(404).end()


})

server.listen(3333)