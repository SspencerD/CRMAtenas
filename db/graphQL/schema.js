const { gql } = require('apollo-server')

//Schema
const typeDefs = gql`
  type Client {
    uid: String
    documentNumber: Int
    documentDv: String
    firstName: String
    lastName: String
    birthDate: String
    nationality: String
    address: String
    numberAddress: Int
    otherAddressInfo: String
    region: Int
    province: Int
    city: String
    gender: String
    phone: String
    email: String
    active: Boolean
  }
  type Token {
    token: String!
  }

  type Enrollment {
    uid: String
    name: String
    capacity: Int
    price: Float
    created: String
  }

  type StudentProxy {
    uid: String
    documentNumber: Int
    documentDv: String
    firstName: String
    lastName: String
    birthDate: String
    nationality: String
    address: String
    numberAddress: Int
    otherAddressInfo: String
    region: Int
    province: Int
    city: String
    gender: String
    phone: String
    email: String
    password: String
    active: Boolean
    students: String
    enrollment: String
    vendor: String
  }

  type Student {
    uid: String
    documentNumber: Int
    documentDv: String
    firstName: String
    lastName: String
    birthDate: String
    nationality: String
    address: String
    numberAddress: Int
    otherAddressInfo: String
    region: Int
    province: Int
    city: String
    gender: String
    phone: String
    email: String
    password: String
    active: Boolean
    studentProxy: String
    enrollment: String
  }
  type MonthlyFee {
    uid: String
    price: Float
    fees: Int
    paymentDate: String
    enrollment: String
    student: String
    studentProxy: String
    state: String
    dateOfPaymentMade: String
  }
  input ClientInput {
    documentNumber: Int!
    documentDv: String!
    firstName: String!
    lastName: String!
    birthDate: String!
    nationality: String!
    address: String!
    numberAddress: Int!
    otherAddressInfo: String!
    region: Int!
    province: Int!
    city: String!
    gender: String!
    phone: String!
    email: String!
    password: String!
    active: Boolean!
  }

  input authenticateUserInput {
    email: String!
    password: String!
  }
  input enrollInput {
    name: String!
    capacity: Int!
    price: Float!
  }
  input inputUpdateEnrollment {
    name: String
    capacity: Int
    price: Float
  }
  input updateStudentProxyInput {
    firstName: String!
    lastName: String!
    birthDate: String!
    nationality: String!
    address: String!
    numberAddress: Int!
    otherAddressInfo: String!
    region: Int!
    province: Int!
    city: String!
    gender: String!
    phone: String!
    email: String!
    password: String!
  }
  input studentProxyInput {
    documentNumber: Int!
    documentDv: String!
    firstName: String!
    lastName: String!
    birthDate: String!
    nationality: String!
    address: String!
    numberAddress: Int!
    otherAddressInfo: String!
    region: Int!
    province: Int!
    city: String!
    gender: String!
    phone: String!
    email: String!
    password: String!
    active: Boolean!
  }
  input studentInput {
    documentNumber: Int!
    documentDv: String!
    firstName: String!
    lastName: String!
    birthDate: String!
    nationality: String!
    address: String!
    numberAddress: Int!
    otherAddressInfo: String!
    region: Int!
    province: Int!
    city: String!
    gender: String!
    phone: String!
    email: String!
    password: String!
    active: Boolean!
  }
  input paymentMonthlyFeeInput {
    price: Float!
    fees: Int!
    paymentDate: String!
    enrollment: String!
    student: String!
    studentProxy: String!
    state: StatePayment
    dateOfPaymentMade: String!
  }
  enum StatePayment {
    PENDIENTE
    PAGADO
    CANCELADO
  }

  type Query {
    #Users
    getClients: [Client!]
    getClientByToken(token: String!): Client
    #Enrollments
    getEnrollments: [Enrollment]
    getEnrollmentById(uid: String!): Enrollment
    #Apoderados
    getStudentsProxy: [StudentProxy!]
    getStudentProxyByUserId: [StudentProxy!]
    getStudentProxyById(id: String!): StudentProxy
  }

  type Mutation {
    #USERS
    createClient(input: ClientInput): Client
    authenticateUser(input: authenticateUserInput): Token
    #Enrollements (Matriculas)
    createNewEnroll(input: enrollInput): Enrollment
    updateEnrollment(uid: String!, input: inputUpdateEnrollment): Enrollment
    deleteEnrollment(id: String!): String
    #StudentProxies (Apoderados)
    createStudentProxy(input: studentProxyInput): StudentProxy
    updateStudentProxy(
      id: String!
      input: updateStudentProxyInput
    ): StudentProxy
    deleteStudentProxy(id: String!): String
    #Student (Estudiantes)
    createStudent(input: studentInput): Student
    #MonthlyFee (Mensualidades)
    paymentMonthlyFee(input: paymentMonthlyFeeInput): MonthlyFee
  }
`

module.exports = typeDefs
