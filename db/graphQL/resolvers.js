import { validate, format, clean } from 'rut.js'
const models = require('../sequelize/models/index')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const { Clients, Enrollments, StudentsProxy, MonthlyFee } = models

const createToken = (user, key, expiresIn) => {
  // console.log(user, key, expiresIn)
  const { uid, documentNumber, firstName, lastName, email } = user
  return jwt.sign({ uid, documentNumber, firstName, lastName, email }, key, {
    expiresIn,
  })
}

//Resolvers

const resolvers = {
  Query: {
    //Users
    getClientByToken: async (root, { token }) => {
      const userId = await jwt.verify(token, `${process.env.SECRET_KEY}`)

      return userId
    },
    //Matriculas
    getEnrollments: async () => {
      try {
        const enrollments = await Enrollments.findAll()
        return enrollments
      } catch (error) {
        console.log(error)
      }
    },
    getEnrollmentById: async (root, { uid }) => {
      // si la matricula existe
      const enrollExists = await Enrollments.findByPk(uid)

      if (!enrollExists) {
        throw new Error('Producto no encontrado')
      }
      return enrollExists
    },
    //Apoderados
    getStudentsProxy: async () => {
      try {
        const studentProxy = await StudentsProxy.findAll()
        return studentProxy
      } catch (error) {
        console.log(error)
      }
    },
    getStudentProxyByUserId: async (root, {}, ctx) => {
      try {
        const users = await StudentsProxy.findAll({
          where: { vendor: ctx.user.uid.toString() },
        })
        return users
      } catch (error) {
        console.log(error)
      }
    },
    getStudentProxyById: async (root, { id }, ctx) => {
      //revisar si el apoderado existe

      const studentProxy = await StudentsProxy.findByPk(id)
      if (!studentProxy) {
        throw new Error('Apoderado no encontrado')
      }
      //Quien lo puede ver
      if (studentProxy.vendor.toString() !== ctx.user.uid) {
        throw new Error('Está matricula no pertenece al usuario')
      }
      return studentProxy
    },
  },
  Mutation: {
    createClient: async (root, { input }) => {
      const { documentNumber, email, password } = input

      //Revisar si el usuario existe,
      const existClient = await Clients.findOne({ where: { email: email } })
      const existDocumentNumber = await Clients.findOne({
        where: { documentNumber: documentNumber },
      })
      if (existClient) {
        throw new Error('Usuario ya se encuentra registrado')
      } else if (existDocumentNumber) {
        throw new Error('El rut ingresado ya existe')
      }
      //Hashear su password,
      const salt = await bcryptjs.genSaltSync(10)
      input.password = await bcryptjs.hashSync(password, salt)

      //Guardar db
      try {
        const saveClient = new Clients(input)
        saveClient.save()
        return saveClient
      } catch (error) {
        console.log(error)
      }
    },

    authenticateUser: async (root, { input }) => {
      const { email, password } = input
      // si el usuario existe

      const userExists = await Clients.findOne({ where: { email: email } })
      if (!userExists) {
        throw new Error('El usuario no existe')
      }
      // Revisar si el password es correcto

      const passwordAllowed = await bcryptjs.compare(
        password,
        userExists.password,
      )
      if (!passwordAllowed) {
        throw new Error('El password es incorrecto')
      }

      // Crear token

      return {
        token: createToken(userExists, `${process.env.SECRET_KEY}`, '24h'),
      }
    },
    // MATRICULAS
    createNewEnroll: async (root, { input }) => {
      const { name } = input

      const enrollExists = await Enrollments.findOne({
        where: { name: name },
      })
      if (enrollExists) {
        throw new Error('La matricula ya existe')
      }
      try {
        const enroll = new Enrollments(input)
        const saveEnroll = await enroll.save()
        return saveEnroll
      } catch (error) {
        console.log(error)
      }
    },
    updateEnrollment: async (root, { uid, input }) => {
      let enrollExists = await Enrollments.findByPk(uid)

      if (!enrollExists) {
        throw new Error('Producto no encontrado')
      }
      try {
        enrollExists.set(
          'name',
          input.name,
          'capacity',
          input.capacity,
          'price',
          input.price,
        )
        // Guardar hace un update
        return enrollExists.save()
      } catch (error) {
        console.log(error)
      }
    },
    deleteEnrollment: async (root, { id }) => {
      let enrollment = await Enrollments.findByPk(id)

      if (!enrollment) {
        throw new Error('Producto no encontrado')
      }
      //delete enrollment

      await Enrollments.destroy({ where: { uid: id } })

      return 'Matricula eliminada'
    },
    //APODERADOS
    createStudentProxy: async (root, { input }, ctx) => {
      //verificar si existe el apoderado

      console.log('QUE TRAE CONTEXT:', ctx)

      const { email, documentNumber } = input
      console.log(input)

      const studentProxy = await StudentsProxy.findOne({
        where: { email: email },
      })
      if (studentProxy) {
        throw new Error('Apoderado ya registrado')
      }
      const studentProxyDni = await StudentsProxy.findOne({
        where: { documentNumber: documentNumber },
      })
      if (studentProxyDni) {
        throw new Error('Rut ya existente como apoderado')
      }
      const newStudentProxy = new StudentsProxy(input)
      //asignar matricula
      newStudentProxy.enrollment = '246c0cf0-10aa-4134-b96a-40cfab7a70b2'
      //asignar estudiante

      //asignar Vendedor
      newStudentProxy.vendor = ctx.user.uid

      // guardar en db

      try {
        const resultado = await newStudentProxy.save()
        return resultado
      } catch (error) {
        console.log(error)
      }
    },
    updateStudentProxy: async (root, { id, input }, ctx) => {
      const {
        firstName,
        lastName,
        birthDate,
        nationality,
        address,
        numberAddress,
        otherAddressInfo,
        region,
        province,
        city,
        gender,
        phone,
        email,
        password,
      } = input

      let studentProxy = await StudentsProxy.findByPk(id)

      if (!studentProxy) {
        throw new Error('Apoderado no encontrado')
      }
      if (studentProxy.vendor !== ctx.user.uid) {
        throw new Error('La credencial no corresponde')
      }
      try {
        studentProxy.set(
          'firstName',
          firstName,
          'lastName',
          lastName,
          'birthDate',
          birthDate,
          'nationality',
          nationality,
          'address',
          address,
          'numberAddress',
          numberAddress,
          'otherAddressInfo',
          otherAddressInfo,
          'region',
          region,
          'province',
          province,
          'city',
          city,
          'gender',
          gender,
          'phone',
          phone,
          'email',
          email,
          'password',
          password,
        )
        // Guardar hace un update
        return studentProxy.save()
      } catch (error) {
        console.log(error)
      }
    },
    deleteStudentProxy: async (_, { id }, ctx) => {
      let studentProxy = await StudentsProxy.findByPk(id)

      if (!studentProxy) {
        throw new Error('Apoderado no encontrado')
      }

      if (studentProxy.vendor !== ctx.user.uid) {
        throw new Error('No dispones de credenciales')
      }
      //delete enrollment

      await StudentsProxy.destroy({ where: { uid: id } })

      return 'Apoderado eliminado'
    },
    //Mensualidades
    paymentMonthlyFee: async (root, { input }, ctx) => {
      const { studentProxy, enrollment, student } = input
      //Verificar si apoderado existe
      let studentProxyExist = await StudentsProxy.findByPk(studentProxy)

      if (!studentProxyExist) {
        throw new Error('El Apoderado no existe')
      }
      //Verificar si existe la matricula
      let enrollmentExist = await Enrollments.findByPk(enrollment)

      if (!enrollmentExist) {
        throw new Error('La Matricula no existe')
      }
      //Verificar si el studiante pertenece al apoderado

      let studentExists = await Enrollments.findOne({ where: { uid: student } })

      if (!studentExists) {
        throw new Error('El estudiante no existe')
      }

      //Revisar si quedan cuotas por pagar

      //guardar en la bd
    },
  },
}

module.exports = resolvers
