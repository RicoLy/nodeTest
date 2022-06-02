const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');


const getData = (file = 'inputs/inputs.xlsx', sheetIdx = 0) => {
  const workbook = XLSX.readFile(file);

  const sheets = workbook.SheetNames.map(name => workbook.Sheets[name]);

  return XLSX.utils.sheet_to_json(sheets[sheetIdx]);
};

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

const getInfo = async (file) => {
  const data = getData(file = './test2.xlsx');
  const outPutData = [];
  for (const item of data) {
    console.log(item)
    // const res = getLocation(item.location)
    if (item.name) {
      const res = await getLocation(item.location)
      if (item.name) {
        outPutData.push({
          district: item.district,
          name: item.name,
          location: item.location,
          phone: item.phone,
          intro: item.intro,
          coordinate: res.data.geocodes[0].location,
        })
      }
    }
  }
  return outPutData
}

// const data = getData('./test2.xlsx');
// const outPutData = [];
// data.map(item => {
//   console.log(item)
//   // const res = getLocation(item.location)
//   if (item.name) {
//     const res = getLocation(item.location)
//     res.then((response) => {
//       if (response.data.geocodes[0]) {
//         console.log("res====",response.data.geocodes[0]);
//         outPutData.push({
//           district: item.district,
//           name: item.name,
//           location: item.location,
//           phone: item.phone,
//           intro: item.intro,
//           coordinate: response.data.geocodes[0].location,
//         })
//       }
//
//     })
//   }
// })



const res = getInfo("./test2.xlsx")
res.then((response) => {
  console.log("res====",response);
  fs.writeFile('./info.json', JSON.stringify({infos: response}), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
})
