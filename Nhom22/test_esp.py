import paho.mqtt.client as mqtt


def on_connect(client, userdata, flags, rc):
    print("Kết nối thành công MQTT")
    client.subscribe("actionSub")


def on_message(client, userdata, msg):
    topic = str(msg.topic)
    message = str(msg.payload.decode())
    client.publish("sensorPub", message)


client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

client.loop_forever()