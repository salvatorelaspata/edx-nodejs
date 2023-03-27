'use strict'

module.exports = async function (fastify, opts) {
  // function accept socket instance as an argument and attaches a message listener to it.
  function monitorMessages(socket) {
    socket.on('message', data => {
      try {
        const { cmd, payload } = JSON.parse(data)
        if (cmd === 'update-category') {
          sendCurrentOrders(payload.category, socket)
        }
      } catch (err) {
        fastify.log.warn(
          'WebSocket Message (data: %o) Error: %s',
          data,
          err.message
        )
      }
    })
  }
  // function accepts a category and a socket instance and sends all the current orders for that category to the socket.
  function sendCurrentOrders(category, socket) {
    for (const order of fastify.currentOrders(category)) {
      socket.send(order)
    }
  }

  fastify.get(
    '/:category',
    { websocket: true },
    async ({ socket }, request) => {
      monitorMessages(socket)
      sendCurrentOrders(request.params.category, socket)
      for await (const order of fastify.realtimeOrders()) {
        if (socket.readyState >= socket.CLOSING) break
        socket.send(order)
      }
    }
  )

  fastify.post('/:id', async request => {
    const { id } = request.params
    fastify.addOrder(id, request.body.amount)
    return { ok: true }
  })
}
