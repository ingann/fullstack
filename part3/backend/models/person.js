const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: [
      {
        validator: vNumber => {
          return (vNumber.length >= 8 && (vNumber[2] === '-' || vNumber[3] === '-'))
        },
        message: 'Must have eight or more digits'
      },
      {
        validator: vNumber => {
          return /^\d{2,3}-\d+$/.test(vNumber)
        },
        message: 'Invalid number. Number must consist only digits after the hyphen.'
      }
    ],
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)