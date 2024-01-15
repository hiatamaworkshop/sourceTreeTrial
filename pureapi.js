// node pureapi.js

const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

const persons = [
    { id: 1, nationality: 'japan', firstName: "takaki", lastName: "matsumoto", city: "fukui", occupation: "farmer"},
    { id: 2, nationality: 'japan', firstName: "kaki", lastName: "matsumoto", city: "fukui", occupation: "carpenter"},
    { id: 3, nationality: 'india', firstName: "goro", lastName: "yamada", city: "munbai", occupation: "teacher"},
    { id: 4, nationality: 'india', firstName: "goro", lastName: "kishi", city: "munbai", occupation: "creator"},
];

app.get('/', (req, res) => {
    res.send('REST API TRIAL');
});

app.get('/api/persons', (req, res) => {
    res.send(persons);
});

// ID search
// app.get('/api/persons/:id', (req, res) => {
//     const person = persons.find(c => c.id === parseInt(req.params.id));
//     if (!person) return res.status(404).send('The course with the given ID was not found.');
//     res.send(person);
// });

app.get('/api/persons/:nationality/:firstName/:lastName/:city?/:occupation?', (req, res) => {
  console.log(req.params);
  let person1 = persons.filter(e => e.nationality === String(req.params.nationality));
  let person2 = person1.filter(e => e.firstName === String(req.params.firstName));
  let person3 = person2.filter(e => e.occupation === String(req.params.occupation)); //optionals
  if(person3.length == 0) person3 = person2;

      person = person3;
  if (!person || person.length == 0) return res.status(404).send('Person with the given information was not found.');
  console.log(person);
    res.send(person);
});

app.post('/api/persons', (req, res) => {
    const person = {
        id: persons.length + 1,
        nationality : req.body.nationality,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
    };
    persons.push(person);
    res.send(person);
});

app.put('/api/persons/:id', (req, res) => {
    const person = persons.find(c => c.id === parseInt(req.params.id));
    if (!person) return res.status(404).send('person with the given ID was not found.');
console.log("The change will be applied to : " + JSON.stringify(person) +  " with below infomation");
console.log(req.body);
    if(req.body.nationality) person.nationality = req.body.nationality;
    if(req.body.firstName) person.firstName = req.body.firstName;
    if(req.body.lastName) person.lastName = req.body.lastName;
    console.log(person);
    res.send(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const person = persons.find(c => c.id === parseInt(req.params.id));
    if (!person) return res.status(404).send('The course with the given ID was not found.');

    const index = persons.indexOf(person);
    persons.splice(index, 1);

    res.send(person);
});


const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;
app.listen(port, hostname, () => console.log(`Listening on port ${port}...`));
