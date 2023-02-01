const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/graphQL/schema')
const resolvers = require('./db/graphQL/resolvers')
const models = require('./db/sequelize/models/index')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

//Data Dummy

//GraphQL

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers['authorization'])

    const token = req.headers['authorization'] || ''
    if (token) {
      try {
        const user = jwt.verify(token, `${process.env.SECRET_KEY}`)
        console.log(user)
        return {
          user,
        }
      } catch (error) {
        console.log('Hubo un error en la verificación de token')
        console.log(error)
      }
    }
  },
})

//Run server
server.listen().then(({ url }) => {
  console.log(`Server Listo en la url ${url} `)
})

//conecction DB
const { sequelize } = models

sequelize.authenticate().then(() => {
  console.log('Estas conectado a la BD')
})

sequelize.sync()
