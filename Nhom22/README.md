Một số thư viện dùng trong btl:
  + Adruino (C/C++)
    - #include <ESP8266WiFi.h>
    - #include <PubSubClient.h>
    - #include <DHT.h>
    - #include <ctime>
    - #include <NTPClient.h>
    - #include <WiFiUdp.h>
    - #include <ArduinoJson.h>
  + Frontend Client (html, css, javascript)
    - chart.js
    - flatpickr
    - WebSocket
    - JSON
    - fetch
  + Backend Server (Nodejs)
    - express
    - cors
    - http
    - ws
    - mqtt
    - JSON
    - mysql2

Chạy Code
B1: Cắm đúng chân linh kiện đã được định nghĩa trong code rồi sau đó nạp code vào ESP đúng mạng wifi, ip máy tính

B2: Chạy code tạo Database (Lưu ý nó xóa database 'demo' đấy)
  DROP SCHEMA demo;
  CREATE SCHEMA demo;
  use demo;
  CREATE TABLE action (
  id int NOT NULL AUTO_INCREMENT,
  device_id varchar(45) DEFAULT NULL,
  action varchar(45) DEFAULT NULL,
  time datetime DEFAULT NULL,
  PRIMARY KEY (id)
  ) ;
  CREATE TABLE sensor (
  id INT NOT NULL AUTO_INCREMENT,
  device_id VARCHAR(45) DEFAULT NULL,
  humidity DOUBLE DEFAULT NULL,
  temperature DOUBLE DEFAULT NULL,
  light DOUBLE DEFAULT NULL,
  time DATETIME DEFAULT NULL,
  PRIMARY KEY (id)
  );

B3: Yêu cầu có nodejs rồi mở CMD trong thư mục server và chạy lệnh:
  npm i
  npm start

B4: Mở index.html trong client và tận hưởng thành quả


<!-- 
Giải thích luồng chạy:
- Dữ liệu sensor: Từ cảm biến DHT ESP (dòng 177 ở arduino) qua mqtt vào server (dòng 41 file index.js) rồi lưu vào database, đồng thời thông qua websocket đẩy lên client (dòng 46 file index.js) và đổ vào chart (dòng 250 file script.js)
- Dữ liệu nút ấn bật tắt: Nhấn nút ở Client thông qua Websocket gửi dữ liệu vào server (dòng 46 file script.js), server lưu dữ liệu vào database đồng thời gửi dữ liệu tới esp qua mqtt (dòng 29 file index.js), esp nhận dữ liệu (dòng 157 arduino) rồi gửi lại dữ liệu qua mqtt tới server (dòng 147 arduino), server thông qua websocket đẩy lên client (dòng 60 file index.js) và hiển thị trạng thái đèn (dòng 260 file script.js)
- Dữ liệu đếm số lần bật tắt: gọi api get_count (dòng 5 file action.route.js) <- get_count lấy dữ liệu từ getCountA gửi dữ liệu lên server (dòng 15 file action.controller.js) <- kết nối đến db lấy dữ liệu getCountA từ bảng action (dòng 24 file action.model.js) <- getCountA truy vấn đếm số lần đèn 1 hoặc đèn 2 có trạng thái on hoặc off (dòng 43 file mysql.common.js) 
 -->  
