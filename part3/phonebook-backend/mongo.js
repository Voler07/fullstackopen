const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('give password as argument')
  process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://luhuitoux_db_user:${password}@cluster0.xlnuk9q.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person
    .find({})
    .then(result => {
      result.forEach(p => {
        console.log(`${p.name} ${p.number}`)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

