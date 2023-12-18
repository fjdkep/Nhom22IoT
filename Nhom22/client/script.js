document.addEventListener("DOMContentLoaded", () => {
  showPanel(0);
  defaultPage(
    "sensor",
    rowSensorTable,
    columnSensorTable,
    inputSDTSensor,
    inputEDTSensor,
    selectPageSensor
  );
  defaultPage(
    "action",
    rowActionTable,
    columnActionTable,
    inputSDTAction,
    inputEDTAction,
    selectPageAction
  );
  btnSUSensor.style.background = "#3dffae";
  btnSDSensor.style.background = "#f8f8f8";

  callAPI("http://localhost:3000/api/action/count", (data) => {
    document.getElementById("bat1").textContent = "Bật: " + data[0].bat;
    document.getElementById("tat1").textContent = "Tắt: " + data[0].tat;
    document.getElementById("bat2").textContent = "Bật: " + data[1].bat;
    document.getElementById("tat2").textContent = "Tắt: " + data[1].tat;
  });
});

// BUTTON_START
function buttonONOFF(button_id) {
  var times = new Date().toLocaleString();
  const [time, date] = times.split(" ");
  const [hour, minute, second] = time.split(":");
  const [day, month, year] = date.split("/");
  formattedTimeString = `${year}-${month}-${day < 10 ? "0" + day : day
    } ${hour}:${minute}:${second}`;

  var toggleBtn = document.getElementById(button_id);
  toggleBtn.classList.toggle("active");
  if (toggleBtn.classList.contains("active")) {
    toggleBtn.textContent = "ON";
  } else {
    toggleBtn.textContent = "OFF";
  }
  webSocket.send(
    JSON.stringify({
      device_id: button_id,
      status: toggleBtn.textContent.toLowerCase(),
      time: formattedTimeString,
    })
  );
}
var imageLed1 = document.getElementById("led1IMG");
var toggleBtn1 = document.getElementById("led1");
var toggleBtn2 = document.getElementById("led2");
var imageLed2 = document.getElementById("led2IMG");

function stateAction(imageLedID, status) {
  var imageLed = document.getElementById(imageLedID);
  if (status === "on") {
    if (imageLedID.includes("led")) {
      imageLed.src = "images/led_on.png";
      if (imageLedID == "led1IMG") {
        toggleBtn1.style.background = "#4caf50";
        toggleBtn1.textContent = "ON";
      }
      if (imageLedID == "led2IMG") {
        toggleBtn2.style.background = "#4caf50";
        toggleBtn2.textContent = "ON";
      }
    } else imageLed.src = "images/fan_on.gif";
  } else {
    if (imageLedID.includes("led")) {
      imageLed.src = "images/led_off.png";
      if (imageLedID == "led1IMG") {
        toggleBtn1.textContent = "OFF";
        toggleBtn1.style.background = "#ccc";
      }
      if (imageLedID == "led2IMG") {
        toggleBtn2.textContent = "OFF";
        toggleBtn2.style.background = "#ccc";
      }
    } else imageLed.src = "images/fan_off.png";
  }
}
// BUTTON_END

// TAB_DISPLAY_START
const tabButtons = document.querySelectorAll(" .button");
const tabPanelId = [
  ".dashboard",
  ".introduce_tab",
  ".sensor_tab",
  ".action_tab",
];

function showPanel(panelIndex) {
  tabButtons.forEach(function (node) {
    node.style.paddingLeft = "";
    node.style.backgroundColor = "";
  });
  for (var idx = 0; idx < tabPanelId.length; idx++) {
    document.querySelector(tabPanelId[idx]).style.display = "none";
  }
  var tabPanel = document.querySelector(tabPanelId[panelIndex]);
  tabPanel.style.display = "block";
  // tabButtons[panelIndex].style.paddingLeft = "40px";
  tabButtons[panelIndex].style.backgroundColor = "greenyellow";
}
// TAB_DISPLAY_END

// CHART_START
const colorTemp = [
  "#FFE6E6",
  "#FFCDCD",
  "#FFB3B3",
  "#FF9A9A",
  "#FF8080",
  "#FF6666",
  "#FF4D4D",
  "#FF3333",
  "#FF1A1A",
  "#FF0000",
];
const colorHumi = [
  "#E3F2FD",
  "#BBDEFB",
  "#90CAF9",
  "#64B5F6",
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
];
const colorBright = [
  "#FFFDE7",
  "#FFF9C4",
  "#FFF59D",
  "#FFF176",
  "#FFEE58",
  "#FFEB3B",
  "#FDD835",
  "#FBC02D",
  "#F9A825",
  "#F57F17",
];
const chart = new Chart("mychart", {
  type: "line",
  data: {
    datasets: [
      {
        label: "Nhiệt độ",
        data: [],
        yAxisID: "y",
        cubicInterpolationMode: "monotone",
        borderColor: "#FF0000",
        borderWidth: 0.4,
      },
      {
        label: "Độ ẩm",
        cubicInterpolationMode: "monotone",
        data: [],
        yAxisID: "y",
        borderColor: "#0D47A1",
        borderWidth: 0.4,
      },
      {
        label: "Ánh sáng",
        cubicInterpolationMode: "monotone",
        data: [],
        yAxisID: "y1",
        borderColor: "#F57F17",
        borderWidth: 0.4,
      },
    ],
    labels: [],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        position: "left",
        max: 100,
        min: 0,
      },
      y1: {
        display: true,
        position: "right",
        max: 1000,
        min: 0,
      },
    },
  },
});

function addDataChart(humidity, temp, light, time) {
  if (chart.data.datasets[0].data.length >= 10) {
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
    chart.data.datasets[2].data.shift();
    chart.data.labels.shift();
  }
  chart.data.datasets[0].data.push(temp);
  chart.data.datasets[1].data.push(humidity);
  chart.data.datasets[2].data.push(light);
  chart.data.labels.push(time);
  chart.update();
}

function changeColor(humiData, tempData, brightData) {
  document.getElementById("temperature").style.background =
    colorTemp[9 - parseInt(tempData / 10)];
  document.getElementById("humidity").style.background =
    colorHumi[9 - parseInt(humiData / 10)];
  document.getElementById("brightness").style.background =
    colorBright[9 - parseInt(brightData / 100)];
}

function changeData(humiData, tempData, brightData) {
  document.getElementById("humi").textContent = `${parseInt(humiData).toFixed(
    1
  )} %`;
  document.getElementById("temp").textContent = `${parseInt(tempData).toFixed(
    1
  )} độ`;
  document.getElementById("bright").textContent = `${parseInt(
    brightData
  ).toFixed(0)} LUX`;
}
// CHART_END

// WEBSOCKET_START
const webSocket = new WebSocket("ws://localhost:3000");

webSocket.onopen = () => {
  console.log("WebSocket Connected");
};

webSocket.onclose = () => {
  console.log("WebSocket Disconnected");
};

webSocket.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.device_id === "DHT11") {
    var leng = 1000 / 1024;
    var time = data.time.split(" ")[1];
    var light = Math.round(data.light * leng);
    addDataChart(data.humidity, data.temperature, light, time);
    changeData(data.humidity, data.temperature, light);
    changeColor(data.humidity, data.temperature, light);
  }
  stateAction(data.state1.device_id + "IMG", data.state1.status);
  stateAction(data.state2.device_id + "IMG", data.state2.status);
};
// WEBSOCKET_END

// TABLE_START
const defaultRow = 30;
const rowSensorTable = document
  .getElementById("sensor_table")
  .getElementsByTagName("tbody")[0];
const columnSensorTable = document
  .getElementById("sensor_table")
  .getElementsByTagName("thead")[0]
  .getElementsByTagName("th");
const rowActionTable = document
  .getElementById("action_table")
  .getElementsByTagName("tbody")[0];
const columnActionTable = document
  .getElementById("action_table")
  .getElementsByTagName("thead")[0]
  .getElementsByTagName("th");

function addRowTable(table, data) {
  const newRow = table.insertRow();
  data.forEach((e) => {
    newRow.insertCell().textContent = e;
  });
}

function clearRowTable(table) {
  for (let i = 0; i < table.children.length; i) {
    table.deleteRow(i);
  }
}

function blankRowTable(table, column, lengthRow) {
  const lengthColumn = column.length;
  if (lengthRow <= defaultRow) {
    for (let i = 0; i < defaultRow - lengthRow; i++) {
      addRowTable(table, Array(lengthColumn).fill(""));
    }
  }
}

function drawTable(table, column, data) {
  clearRowTable(table);
  if (data) {
    data.forEach((e) => {
      addRowTable(table, Object.values(e));
    });
  }
  blankRowTable(table, column, data ? data.length : 0);
}
// TABLE_END

// MENU_TABLE_START
const inputSDTSensor = document.getElementById("inputSDTSensor");
const inputSDTAction = document.getElementById("inputSDTAction");
const inputEDTSensor = document.getElementById("inputEDTSensor");
const inputEDTAction = document.getElementById("inputEDTAction");
const btnDTSensor = document.getElementById("btnDTSensor");
const btnDTAction = document.getElementById("btnDTAction");
const selectSensor = document.getElementById("selectSensor");
const btnSUSensor = document.getElementById("btnSUSensor");
const btnSDSensor = document.getElementById("btnSDSensor");
const btnSSensor = document.getElementById("btnSSensor");
const selectSearch = document.getElementById("selectSearch");
const inputSSensor = document.getElementById("inputSSensor");

let timeSensor = { timeStart: "", timeEnd: "" };
btnDTSensor.addEventListener("click", (e) => {
  const timeStart = inputSDTSensor.value;
  const timeEnd = inputEDTSensor.value;
  if (
    inputSDTSensor.value != timeSensor.timeStart ||
    inputEDTSensor.value != timeSensor.timeEnd
  ) {
    if (inputSDTSensor.value <= inputEDTSensor.value) {
      timeSensor.timeStart = timeStart;
      timeSensor.timeEnd = timeEnd;
      callAPI(
        `http://localhost:3000/api/sensor/gettime/${timeStart}&${timeEnd}`,
        (data) => {
          drawTable(rowSensorTable, columnSensorTable, data.getPage);
          pageSelect(selectPageSensor, data.getInfo.numPage);
        }
      );
    }
  }
});

let sortType = "ASC";
btnSUSensor.addEventListener("click", (e) => {
  btnSUSensor.style.background = "#3dffae";
  btnSDSensor.style.background = "#f8f8f8";
  sortType = "ASC";
  sortDataSensor(selectSensor.value, sortType, 1);
});

btnSDSensor.addEventListener("click", (e) => {
  btnSUSensor.style.background = "#f8f8f8";
  btnSDSensor.style.background = "#3dffae";
  sortType = "DESC";
  sortDataSensor(selectSensor.value, sortType, 1);
});

function sortDataSensor(value, type, page) {
  let urlSort = `http://localhost:3000/api/sensor/sort/value=${value}&type=${type}&page=${page}`;
  callAPI(urlSort, (data) => {
    drawTable(rowSensorTable, columnSensorTable, data);
  });
}

let preInputSensor = "";
let preSelectSearchSensor = selectSearch.value;
let search = false;
let firstSearch = true;
btnSSensor.addEventListener("click", (e) => {
  if (selectSearch.value != preSelectSearchSensor) {
    preInputSensor = "";
    preSelectSearchSensor = selectSearch.value;
  }
  if (inputSSensor.value && inputSSensor.value != preInputSensor) {
    search = true;
    firstSearch = false;
    searchSensorData(1, "ASC");
    preInputSensor = inputSSensor.value;
  } else if (!firstSearch) {
    defaultPage(
      "sensor",
      rowSensorTable,
      columnSensorTable,
      inputSDTSensor,
      inputEDTSensor,
      selectPageSensor
    );
    firstSearch = true;
  }
});

function searchSensorData(page, sort) {
  let urlSearch = `http://localhost:3000/api/sensor/search/type=${selectSearch.value}&search=${inputSSensor.value}&page=${page}&sort=${sort}`;
  callAPI(urlSearch, (data) => {
    drawTable(rowSensorTable, columnSensorTable, data.getPage);
    if (search) {
      pageSelect(selectPageSensor, data.length.numPage);
      search = false;
    }
  });
}

// Button Action Events
let timeActionCheck = { timeStart: "", timeEnd: "" };
btnDTAction.addEventListener("click", (e) => {
  btnBackPageAction.disabled = false;
  btnNextPageAction.disabled = false;
  if (
    inputSDTAction.value != timeActionCheck.timeStart ||
    inputEDTAction.value != timeActionCheck.timeEnd
  ) {
    if (inputSDTAction.value < inputEDTAction.value) {
      const data1 = inputSDTAction.value
        .replace(":", "%3A")
        .replace("-", "%2D")
        .replace("-", "%2D")
        .replace(" ", "%20");
      const data2 = inputEDTAction.value
        .replace(":", "%3A")
        .replace("-", "%2D")
        .replace("-", "%2D")
        .replace(" ", "%20");
      timeActionCheck.timeStart = inputSDTAction.value;
      timeActionCheck.timeEnd = inputEDTAction.value;
      callAPI(
        `http://localhost:3000/api/action/gettime/${data1}&${data2}`,
        (data) => {
          //drawTable(data);
        }
      );
      callAPI(
        `http://localhost:3000/api/action/gettimeinfo/${data1}&${data2}`,
        (data) => {
          selectPageAction.textContent = 1;
        }
      );
    }
  }
});

function datetimePicker(element, defaultDateValue) {
  flatpickr(element, {
    enableTime: true,
    dateFormat: "d-m-Y H:i",
    defaultDate: defaultDateValue,
    time_24hr: true,
  });
}
const convert = (data) => {
  return data < 10 ? "0" + data : data;
};
function formatTimeTable(timeTable) {
  if (timeTable) {
    [date, time] = timeTable.split(" ");
    [year, month, day] = date.split("-");
    [hour, minute] = time.split(":");
    return day + "-" + month + "-" + year + " " + hour + ":" + minute;
  }
  return new Date().toLocaleTimeString();
}

// MENU_TABLE_END

// MENU_PAGE_START
const btnBackPageSensor = document.getElementById("btnBSensor");
const btnBackPageAction = document.getElementById("btnBAction");
const btnNextPageSensor = document.getElementById("btnNSensor");
const btnNextPageAction = document.getElementById("btnNAction");
const selectPageSensor = document.getElementById("pageSensor");
const selectPageAction = document.getElementById("pageAction");

btnBackPageSensor.addEventListener("click", (e) => {
  btnGetPage(selectPageSensor, -1, btnBackPageSensor, btnNextPageSensor);
});
btnBackPageAction.addEventListener("click", (e) => {
  btnGetPage(selectPageAction, -1, btnBackPageAction, btnNextPageAction);
});
selectPageSensor.addEventListener("change", (e) => {
  btnGetPage(selectPageSensor, 0, btnBackPageSensor, btnNextPageSensor);
});
selectPageAction.addEventListener("change", (e) => {
  btnGetPage(selectPageAction, 0, btnBackPageAction, btnNextPageAction);
});
btnNextPageSensor.addEventListener("click", (e) => {
  btnGetPage(selectPageSensor, 1, btnBackPageSensor, btnNextPageSensor);
});
btnNextPageAction.addEventListener("click", (e) => {
  btnGetPage(selectPageAction, 1, btnBackPageAction, btnNextPageAction);
});

function defaultPage(
  type,
  table,
  column,
  inputSDTElement,
  inputEDTElement,
  pageElement
) {
  callAPI(`http://localhost:3000/api/${type}/data/page=1`, (data) => {
    drawTable(table, column, data.getPage);
    datetimePicker(inputSDTElement, formatTimeTable(data.getInfo.startTime));
    datetimePicker(inputEDTElement, formatTimeTable(data.getInfo.endTime));
    pageSelect(pageElement, data.getInfo.numPage);
  });
  if (type === "action") {
    btnBackPageAction.disabled = true;
  } else if (type === "sensor") {
    btnBackPageSensor.disabled = true;
  }
}

function btnGetPage(pageType, action, btnBack, btnNext) {
  let currentPage = parseInt(pageType.value.trim());
  if (action == 0) {
    btnBack.disabled = currentPage == 1 ? true : false;
    btnNext.disabled = currentPage == pageType.options.length ? true : false;
  } else {
    currentPage = action == -1 ? currentPage - 1 : currentPage + 1;
    if (currentPage == (action == -1 ? 1 : pageType.options.length)) {
      action == -1 ? (btnBack.disabled = true) : (btnNext.disabled = true);
    }
    pageType.selectedIndex = currentPage - 1;
    action == -1 ? (btnNext.disabled = false) : (btnBack.disabled = false);
  }
  if (pageType.id.includes("Sensor")) {
    if (inputSSensor.value) {
      searchSensorData(currentPage, "ASC");
    } else {
      if (sortType == "ASC") {
        sortDataSensor(selectSensor.value, sortType, currentPage);
      } else if (sortType == "DESC") {
        sortDataSensor(selectSensor.value, sortType, currentPage);
      } else {
        getPage("sensor", rowSensorTable, columnSensorTable, currentPage);
      }
    }
  } else if (pageType.id.includes("Action")) {
    getPage("action", rowActionTable, columnActionTable, currentPage);
  }
}

function pageSelect(page, numPage) {
  while (page.firstChild) {
    page.removeChild(page.firstChild);
  }
  for (let i = 1; i <= numPage; i++) {
    var option = document.createElement("option");
    option.value = i.toString();
    option.text = i;
    page.add(option);
  }
  if (numPage == 1) {
    if (page.id.includes("Action")) {
      btnBackPageAction.disabled = true;
      btnNextPageAction.disabled = true;
    }
    if (page.id.includes("Sensor")) {
      btnBackPageSensor.disabled = true;
      btnNextPageSensor.disabled = true;
    }
  } else {
    btnNextPageSensor.disabled = false;
    btnNextPageAction.disabled = false;
  }
}
// MENU_PAGE_END

// FETCH_API
function getPage(type, table, column, page) {
  callAPI(`http://localhost:3000/api/${type}/data/page=${page}`, (data) => {
    drawTable(table, column, data.getPage);
  });
}

async function callAPI(url, result) {
  try {
    let getData = await fetch(url);
    result(await getData.json());
  } catch (error) {
    result(error);
  }
}
