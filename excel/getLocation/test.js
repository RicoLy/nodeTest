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

// const res = getLocation("龙华区景龙中环路大信花园3栋龙发路217号")
//
// res.then((response) => {
//   let res = response.data.geocodes;
//     console.log(response)
//     console.log(response.data.geocodes);
// })

const getInfo = async (file) => {
  const data = getData(file);
  const outPutData = [];
  for (const item of data) {
    console.log(item)
    // const res = getLocation(item.location)
    if (item.name !== "" && item.location) {
      const res = await getLocation(item.location)
      if (item.name && res.data.geocodes) {
        const info = res.data.geocodes[0];
        outPutData.push({
          city: info.city,
          district: info.district,
          name: item.name,
          location: item.location,
          phone: item.phone,
          intro: item.intro,
          privateRoom: item.privateRoom,
          businessHours: item.businessHours,
          traffic: item.traffic,
          coordinate: info.location,
          formattedAddress: info.formatted_address,
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
//         const res = response.data.geocodes[0];
//         console.log("res====",res);
//         outPutData.push({
//           city: res.city,
//           district: res.district,
//           name: item.name,
//           location: item.location,
//           phone: item.phone,
//           intro: item.intro,
//           coordinate: res.location,
//           formattedAddress: res.formatted_address,
//         })
//       }
//     })
//   }
// })



const res = getInfo("./test2.xlsx")
res.then((response) => {
  console.log("res====",response);
  fs.writeFile('./info2.json', JSON.stringify({infos: response}), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
})
