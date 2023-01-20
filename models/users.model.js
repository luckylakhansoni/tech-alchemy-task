
//creating entity or schema 

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }
          },
        password: DataTypes.STRING,
               
        isActive:{ // this column is using for soft delete 
            type: DataTypes.BOOLEAN,
            defaultValue: true
         },
    }, {
        timestamps: true,
        deletedAt: 'deletedAt',
        paranoid: true,
        tableName: "users"
    });
    sequelize.sync({
        force: false,
        logging: false,
        alter: true
    });
   
    return User;
  };