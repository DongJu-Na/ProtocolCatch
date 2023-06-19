const express = require("express");
const app = express();
const PORT = 3000;

// node-ssdp 라이브러리 추가
const SSDPClient = require('node-ssdp').Client;
const ssdpClient = new SSDPClient();

// 정적 파일 불러오기
app.use(express.static(__dirname + "/public"));

// 라우팅 정의
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});

// node-ssdp 클라이언트 설정 및 디바이스 검색
ssdpClient.on('response', (headers, statusCode, rinfo) => {
  try{
    console.log("======================================================");
    console.log("test");
    console.log('디바이스 응답:');
    console.log('Headers:', headers);
    console.log('Status Code:', statusCode);
    console.log('From:', rinfo.address, 'Port:', rinfo.port);
    console.log("======================================================");
  }catch(err){
    console.error(err);
  }

});

ssdpClient.on('error', (err) => {
  console.log('에러 발생:', err);
});

ssdpClient.start();
ssdpClient.search('ssdp:all');

// 서버 종료 시 node-ssdp 클라이언트 중지
process.on('SIGINT', function () {
  ssdpClient.stop();
  process.exit();
});
