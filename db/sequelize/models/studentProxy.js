const sequelize = require('sequelize')
const bcryptjs = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const StudentProxy = sequelize.define(
    'StudentProxy',
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      documentNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      documentDv: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherAddressInfo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      province: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      students: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      enrollment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
    },
  )

  StudentProxy.associate = (models) => {
    StudentProxy.belongsTo(models.Enrollement)
  }
  StudentProxy.associate = (models) => {
    StudentProxy.belongsTo(models.Client)
  }

  return StudentProxy
}
