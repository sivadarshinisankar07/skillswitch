// require('dotenv').config();
// const express = require('express');

// const app = express();

// app.get('/api/hello', (req, res) => {
//   res.send('Hello World');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// async function getUsers() {
//   try {
//     const response = await fetch('https://jsonplaceholder.typicode.com/users');
//     const data = await response.json();
//     console.log('Fetched data:', data);
//   } catch (error) {
//     console.error('Error fetching:', error);
//   }
// }

// getUsers(); 


const f =async()=>{
    try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    console.log('Fetched data:', data);
  } catch (error) {
    console.error('Error fetching:', error);
  }
}
f();



function getUsersWrong() {
  const response = fetch('https://jsonplaceholder.typicode.com/users');
  console.log(response);            
  const data = response;     
  console.log(data);
}

getUsersWrong();
