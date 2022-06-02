const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');


const getData = (file = 'inputs/inputs.xlsx', sheetIdx = 0) => {
  const workbook = XLSX.readFile(file);

  const sheets = workbook.SheetNames.map(name => workbook.Sheets[name]);

  return XLSX.utils.sheet_to_json(sheets[sheetIdx]);
};

// const getLocation = (locate, ak = "TKdhuVV9rhxez70WrFylPqXn9fnj2AXN") => {
//   let url = `http://api.map.baidu.com/geocoder/v2/?address=${locate}&output=json&ak=${ak}`
//  http://api.map.baidu.com/geocoder/v2/?address=南极路与春风路交汇处向西大厦北侧前行50米&output=json&ak=TKdhuVV9rhxez70WrFylPqXn9fnj2AXN
// https://restapi.amap.com/v3/geocode/geo?address=南极路与春风路交汇处向西大厦北侧前行50米&key=ebec68b8babdf0e0e66ecd377f82fc4b
//   fetch(url)
//     .then(res => res.json())
//     .then(json => console.log(json));
// }

const getLocation = async (locate, key = 'ebec68b8babdf0e0e66ecd377f82fc4b') => {
  return axios({
    method: 'get',
    url: `https://restapi.amap.com/v3/geocode/geo?address=${encodeURI(locate)}&key=${key}`,
  });
    // .then(function (response) {
    //   let res = response.data.geocodes
    //   console.log(response.data.geocodes);
    //   return res
    // })
    // .catch(function (error) {
    //   console.log(error);
    //   return error
    // });
}


const data = getData('./test2.xlsx');
const outPutData = [];
data.forEach(item => {
  console.log(item)
  // const res = getLocation(item.location)
  if (item.name) {
    const res = getLocation(item.location)
    res.then((response) => {
      if (response.data.geocodes[0]) {
        console.log("res====",response.data.geocodes[0]);
        outPutData.push({
          district: item.district,
          name: item.name,
          location: item.location,
          phone: item.phone,
          intro: item.intro,
          coordinate: response.data.geocodes[0].location,
        })
      }

    })
    // outPutData.push({
    //   district: item.district,
    //   name: item.name,
    //   location: item.location,
    //   phone: item.phone,
    //   intro: item.intro,
    //   coordinate: ""
    // })
  }
})

fs.writeFile('./info.json', JSON.stringify({infos: outPutData}), (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved.");
});

// const res = getLocation("南极路与春风路交汇处向西大厦北侧前行50米")
// res.then((response) => {
//   let res = response.data.geocodes
//   console.log("res====",response.data.geocodes);
//   return res
// })
