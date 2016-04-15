/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RoutineGroup', {
    Row_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    GroupIdx: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TchRoutineID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    GroupText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RoutineDesc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RoutineIntro: {
      type: DataTypes.STRING,
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
