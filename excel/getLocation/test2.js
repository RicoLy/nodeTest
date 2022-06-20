const jsonFile = require('jsonfile')

jsonFile.readFile("./info.json", function(err, jsonData) {
  console.log("err", err)
  console.log("jsonData=======", jsonData)
})
