const sequelize = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const MonthlyFee = sequelize.define(
    'MonthlyFee',
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 54000,
      },
      fees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      enrollment: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      student: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      studentProxy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pendiente de pago',
      },
      dateOfPaymentMade: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      freezeTable: true,
    },
  )

  // Un pago de mensualidad tiene solo una matricula
  MonthlyFee.associate = (models) => {
    MonthlyFee.hasOne(models.Enrollment)
  }

  // un pago de mensualidad tiene asignado solo un Estudiante
  MonthlyFee.associate = (models) => {
    MonthlyFee.hasOne(models.Students)
  }

  return MonthlyFee
}
