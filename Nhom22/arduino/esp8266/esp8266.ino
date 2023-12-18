#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ctime>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>

#define SSID "TP-LINK_9E8D"
#define PASSWORD "12341234"
#define MQTT_SERVER "192.129.41.103"
#define MQTT_PORT 1883
#define FANPIN D3
#define LEDPIN1 D1
#define LEDPIN2 D2
#define DHTPIN D5
#define DHT_DELAY 2000

WiFiUDP ntpUDP;
WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(DHTPIN, DHT11);
NTPClient timeClient(ntpUDP, "vn.pool.ntp.org");

int ledState1 = LOW;
int ledState2 = LOW;
int fanState = LOW;
int preLedState1 = LOW;
int preLedState2 = LOW;
int preFanState = LOW;

unsigned long startDhtTime = 0;

void setup()
{
  Serial.begin(115200);
  setup_esp();
  randomSeed(micros());
  setup_wifi();
  setup_mqtt();
  setup_time();
}
void setup_esp()
{
  dht.begin();
  pinMode(LEDPIN1, OUTPUT);
  pinMode(LEDPIN2, OUTPUT);
  pinMode(FANPIN, OUTPUT);
}
void setup_wifi()
{
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  Serial.print("WIFI          : ");
  Serial.println(SSID);
  Serial.print("ESP IP        : ");
  Serial.println(WiFi.localIP());
  Serial.print("MQTT SERVER IP: ");
  Serial.println(MQTT_SERVER);
}
void setup_time()
{
  timeClient.begin();
  timeClient.setTimeOffset(7 * 3600);
}

String get_time()
{
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  time_t t = static_cast<time_t>(epochTime);
  struct tm *tm = localtime(&t);

  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", tm);
  return String(buffer);
}

String pubJsonSensorString(float humi, float temp, int light)
{
  char buffer[10];
  DynamicJsonDocument sensor(1024);
  sensor["device_id"] = "DHT11";
  dtostrf(humi, 2, 0, buffer);
  sensor["humidity"] = atof(buffer);
  dtostrf(temp, 4, 1, buffer);
  sensor["temperature"] = atof(buffer);
  sensor["light"] = light;
  sensor["time"] = get_time();
  String sensorString;
  serializeJson(sensor, sensorString);
  return sensorString;
}

String pubJsonActionString(String device_id, String status)
{
  DynamicJsonDocument actionDoc(1024);
  actionDoc["device_id"] = device_id;
  actionDoc["status"] = status;
  String actionString;
  serializeJson(actionDoc, actionString);
  return actionString;
}

DynamicJsonDocument subJsonAction(String data)
{
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, data.c_str());
  return doc.as<JsonVariant>();
}

void setup_mqtt()
{
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.connect("esp8266");
  mqttClient.setCallback(data_sub);
}

void data_sub(char *topic, byte *payload, unsigned int length)
{
  if (strcmp(topic, "actionSub") == 0)
  {
    String data = "";
    for (int i = 0; i < length; i++)
    {
      data += (char)payload[i];
    }
    action_sub(String(data));
  }
}

void setState(String data, int &state)
{
  if (data == "on")
  {
    state = HIGH;
  }
  if (data == "off")
  {
    state = LOW;
  }
}

void setAction(String data, int pin, int state, int &preState)
{
  if (state != preState)
  {
    digitalWrite(pin, state);
    preState = state;
    mqttClient.publish("actionPub", data.c_str());
  }
}

void action_sub(String data)
{
  DynamicJsonDocument actionJson = subJsonAction(data);
  if (actionJson["device_id"] == "led1")
  {
    setState(actionJson["status"], ledState1);
    setAction(data, LEDPIN1, ledState1, preLedState1);
  }
  if (actionJson["device_id"] == "led2")
  {
    setState(actionJson["status"], ledState2);
    setAction(data, LEDPIN2, ledState2, preLedState2);
  }
  if (actionJson["device_id"] == "fan")
  {
    setState(actionJson["status"], fanState);
    setAction(data, FANPIN, fanState, preFanState);
  }
}

void sensor_pub()
{
  float humi = dht.readHumidity();
  float temp = dht.readTemperature();
  int light = analogRead(A0);
  String sensor = pubJsonSensorString(humi, temp, light);
  Serial.println(sensor);
  mqttClient.publish("sensorPub", sensor.c_str());
}

void loop()
{
  unsigned long currentMillis = millis();
  if (mqttClient.connected())
  {
    mqttClient.loop();
    mqttClient.subscribe("actionSub");
    if (currentMillis - startDhtTime >= DHT_DELAY)
    {
      startDhtTime = currentMillis;
      sensor_pub();
    }
  }
  else
  {
    setup_wifi();
    setup_mqtt();
    delay(1000);
  }
}