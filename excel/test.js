const XLSX = require('xlsx');

const getData = (file = 'inputs/inputs.xlsx', sheetIdx = 0) => {
  const workbook = XLSX.readFile(file);

  const sheets = workbook.SheetNames.map(name => workbook.Sheets[name]);

  return XLSX.utils.sheet_to_json(sheets[sheetIdx]);
};

const exportData = (data, sheetName = 'data', file = 'sheet.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);

  /* 新建空workbook，然后加入worksheet */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  /* 生成xlsx文件 */
  XLSX.writeFile(wb, file);
};

const data = getData('./proto_info.xlsx');
const outPutData = [];
data.map(item => {
  outPutData.push({
      'namespace': item.namespace,
      'servicename': item['servicename'],
      'protoname': item['protoname'],
      '是否废弃': item['是否废弃'],
      'server_name': item['servicename'],
  });
})
// const outPutExcel = [
//   {
//     name: 'protoInfo',
//     data: outPutData,
//   }
// ];

exportData(outPutData, 'data', './output.xlsx')



console.log('=========', data, '=========');
