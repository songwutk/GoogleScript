var SCRIPT_PROP = PropertiesService.getScriptProperties();
function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();

    SCRIPT_PROP.setProperty("//ใส ID ของชีต", doc.getId());
}
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html').setTitle("ฟอร์มรับสมัครนักเรียน");
}

function uploadFileToGoogleDrive(data, file, name, nickname, email, tel, gender,age,blood) {

  try {
   
    var folder=DriveApp.getFolderById('// ใส่ ID folder ที่ใช้เก็บรูป');
   
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file),
        file = folder.createFolder([name]).createFile(blob),
        filelink=file.getUrl(),
        filelid =file.getId() ;
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);    
   
    var doc = SpreadsheetApp.openById("//ใส ID ของชีต");
    var sheet = doc.getSheetByName("แผ่น1");

    var headRow =  1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; 
    var row = [];

    for (i in headers){
      if (headers[i] == "วันที่สมัคร"){ 
        row.push(new Date());
      } else if (headers[i] == "ชื่อ สกุล"){
        row.push(name);
      } else if (headers[i] == "ชื่อเล่น"){
        row.push(nickname);
      } else if (headers[i] == "อีเมล"){
        row.push(email);
      } else if (headers[i] == "เบอร์โทร"){
        row.push(tel);
      } else if (headers[i] == "เพศ"){
        row.push(gender);
      } else if (headers[i] == "อายุ"){
        row.push(age);
      } else if (headers[i] == "กรุ๊ปเลือด"){
        row.push(blood);
      } else if (headers[i] == "รูปภาพ"){
        row.push(filelink);
      } else if (headers[i] == "idรูปภาพ"){
        row.push(filelid);
      }
       
    }

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    return "OK";
   } catch (f) {
    return f.toString();
  } finally {
    lock.releaseLock();
  }

}
