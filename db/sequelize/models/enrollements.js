const sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Enrollement = sequelize.define(
    'Enrollement',
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      created: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
    },
  )

  Enrollement.associate = (models) => {
    Enrollement.hasOne(models.StudentProxy)
  }

  return Enrollement
}
