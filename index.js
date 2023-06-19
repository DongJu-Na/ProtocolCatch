const express = require("express");
const bonjour = require('bonjour')();
const wifi = require('node-wifi');
const app = express();
const PORT = 3000;

wifi.init({ iface: null });

// node-ssdp 라이브러리 추가
const SSDPClient = require('node-ssdp').Client;
const ssdpClient = new SSDPClient();

// Nmap(Network Mapper) Node.js 환경에서 Nmap을 실행하여 클라이언트 또는 서버의 IP 대역에서 포트나 서비스 등에 대한 정보를 스캔
const nmap = require('node-nmap');
      nmap.nmapLocation = 'nmap'; //default
const opts = {
    range: ["192.168.100.0/100"], // 기본적으로 localhost (127.0.0.1)에 대해서 스캔을 수행
    ports: "1-1000", // 기본적으로 1부터 1000까지의 포트를 스캔
  };

// 정적 파일 불러오기
app.use(express.static(__dirname + "/public"));

// 라우팅 정의
app.get("/", (req, res) => {
  // browse for all http services using bonjour
  bonjour.find({ type: 'http' }, function (service) {
    // console.log('Found an HTTP server:', service);
  });

  // node-ssdp 클라이언트 설정 및 디바이스 검색
  ssdpClient.on('response', (headers, statusCode, rinfo) => {
    console.log("======================================================");
    console.log("test");
    console.log('디바이스 응답:');
    console.log('Headers:', headers);
    console.log('Status Code:', statusCode);
    console.log('From:', rinfo.address, 'Port:', rinfo.port);
    console.log("======================================================");
  });

  ssdpClient.on('error', (err) => {
    console.log('에러 발생:', err);
  });

  ssdpClient.start();
  ssdpClient.search('ssdp:all');
  /*
  var quickscan = new nmap.QuickScan('127.0.0.1 google.com');
 
    quickscan.on('complete', function(data){
    console.log(data);
    });
    
    quickscan.on('error', function(error){
    console.log(error);
    });
    
    quickscan.startScan();
*/

// Wi-Fi 정보 가져오기
wifi.getCurrentConnections((error, currentConnections) => {
    if (error) {
      console.log('Wi-Fi 정보 가져오기 실패:', error);
      return;
    }
  
    // 현재 연결된 Wi-Fi 네트워크 정보 출력
    console.log('현재 Wi-Fi 네트워크 정보:',currentConnections);
    currentConnections.forEach(connection => {
      console.log('SSID:', connection.ssid);
      console.log('BSSID:', connection.bssid);
      console.log('SIGNAL:', connection.signal_level);
      console.log('FREQUENCY:', connection.frequency);
    });
  });

  res.sendFile(__dirname + "/index.html");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});

// 서버 종료 시 bonjour 및 node-ssdp 클라이언트 중지
process.on('SIGINT', function () {
  bonjour.destroy();
  ssdpClient.stop();
  process.exit();
});
