//connection with database
import Sequelize from 'sequelize'

const sequelize = new Sequelize('dbAtenas', 'root', 'Cyan2101', {
  host: 'localhost',
  dialect: 'mysql',
})

const models = {
  Clients: sequelize.import('./clients'),
  Enrollments: sequelize.import('./enrollements'),
  StudentsProxy: sequelize.import('./studentProxy'),
  Students: sequelize.import('./students'),
  MonthlyFee: sequelize.import('./monthlyFee'),
}

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
