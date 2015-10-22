/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ActivationCode', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    ActivateCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CurrStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
    freezeTableName: true,
  });
};
