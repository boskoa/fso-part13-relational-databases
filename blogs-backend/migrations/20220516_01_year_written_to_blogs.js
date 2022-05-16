const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface}) => {
    await queryInterface.addColumn('blogs', 'year_written', {
      type: DataTypes.INTEGER,
      validate: {
        customValidator (value) {
          if (value < 1991 || value > new Date().getFullYear()) {
            throw new Error('Year must be between 1991 and current year.')
          }
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year_written')
  }
}