/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TemplateNode', {
    Row_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    NodeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NodeIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    NodeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RoutineID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    GroupIdx: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    RequireRecord: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
