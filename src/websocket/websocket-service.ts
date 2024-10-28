import { WebSocketServer } from 'ws'
import { WebSocket } from 'ws'
import * as qs from 'qs'

export class WebSocketService {
  static limit = 100
  private clients = new Map<string, WebSocket>()
  private wss: WebSocketServer | null = null

  constructor(port: number, path: string = '/ws') {
    this.init(port, path)
  }

  static setLimit(limit: number) {
    this.limit = limit
  }

  private init(port: number, path = '/ws') {
    this.wss = new WebSocketServer({
      port,
      path,
    })
    this.wss.on('connection', async (client, req) => {
      let params: qs.ParsedQs = {}
      if (req.url) {
        const [path, query] = req.url.split('?')
        params = qs.parse(query, { ignoreQueryPrefix: true })
      }
      const token = params.token as string
      if (token) {
        if (
          this.clients.has(token) &&
          this.clients.get(token)?.readyState === WebSocket.OPEN
        ) {
          this.clients.get(token)?.close()
          this.clients.delete(token)
        }
        this.clients.set(token, client)

        client.on('message', function message(data) {
          console.log('received: %s', data)
          client.send(JSON.stringify({ message: 'hello', params, path }))
        })
      } else {
        client.send('token is required')
        client.close()
      }
      client.on('error', console.error)
    })
    return this.wss
  }
  static sendMessage(data: Parameters<WebSocket['send']>[0], token: string) {}
  static broadcastMessage(data: Parameters<WebSocket['send']>[0]) {}
}
