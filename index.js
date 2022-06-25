const express = require('express');
const cors = require('cors')
const bodyparse = require("body-parser")
const port = process.env.PORT || 5000;
const app = express();
const https = require('https');
app.use(cors())
app.use(bodyparse.json())
app.use(bodyparse.urlencoded({extended:false}))


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});




const ytSearchResult = (song) =>{

    // return promised result
    return new Promise((resolve, reject) =>{
  
      // Send get request to the youtube
      https.get(`https://www.youtube.com/results?search_query=${song}+song`, (res) => {
  
        // Init data string
        let data = '';
  
        // Append data
        res.on('data', (chunk) => {
            data += chunk;
        });
  
        // Event fired on stream finish
        res.on('end', () => {
  
          // Our exporting id list 
          let idlist = [];
  
          // Match all results
          const ids = data.match(/{"url":"\/watch\?v=(.{11})"/g);
  
          // Parse trough them and get id
          ids.forEach((string, index) =>{
  
            // Data is not well formated so we need to split returned string
            idlist.push(string.split('=')[1]);
            
            // Check if we have reached end of array
            if((index + 1) === ids.length){
              
              // If yes resolve with id array list
              resolve(idlist);
            }
  
          });
  
        });
  
      }).on("error", (err) => {
          reject(err);
      }); 
    });
  }



app.post('/add', (req, res,next) => {
    ytSearchResult(req.body['room-changer']).then(data => {

        return data[0]

       })
           .then((data) => res.json(data))
}
);









