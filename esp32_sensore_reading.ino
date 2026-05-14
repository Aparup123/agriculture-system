#include <SPI.h>              // include libraries
#include <LoRa.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>

#ifdef ARDUINO_SAMD_MKRWAN1300
#error "This example is not compatible with the Arduino MKR WAN 1300 board!"
#endif

#define SS 5
#define RST 32
#define DIO0 12
#define SOIL_MOISTURE 25 
#define RAINDROP_SENSOR 35
#define DHT_PIN 26
#define DHTTYPE DHT11
#define PUMP 27
Adafruit_BMP085 bmp;

DHT dht(DHT_PIN, DHTTYPE);

String outgoing;              // outgoing message
byte msgCount = 0;            // count of outgoing messages
byte localAddress = 0xBB;     // address of this device
byte destination = 0xFF;      // destination to send to
long lastSendTime = 0;        // last send time
int interval=2000;

class SensorData{
  public:
  float soilMoisture;
  float rainDrop;
  float h;
  float t;
  float tempFromBmp;
  float altitude;
  float airPressure;
};

SensorData sensorData;

void setup() {
  
  Serial.begin(9600);  
  analogSetAttenuation(ADC_11db);
  pinMode(SOIL_MOISTURE, INPUT);
  pinMode(PUMP, OUTPUT);
  dht.begin();
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP085/BMP180 sensor, check wiring!");
    while (1) {}
  }
  while (!Serial);
  Serial.println("LoRa Duplex with callback");

  // override the default CS, reset, and IRQ pins (optional)
  LoRa.setPins(SS, RST, DIO0);// set CS, reset, IRQ pin

  if (!LoRa.begin(433E6)) {             // initialize ratio at 915 MHz
    Serial.println("LoRa init failed. Check your connections.");
    while (true);                       // if failed, do nothing
  }

  LoRa.onReceive(onReceive);
  LoRa.receive();
  Serial.println("LoRa init succeeded.");
}

void loop() {
  if (millis() - lastSendTime > interval) {
    // Read Sensor Values
    sensorData=getSensorData();
    transmitSensorData(sensorData);
    // Print all values
    printSensorData(sensorData); 
    lastSendTime = millis();            // timestamp the message
    interval = 3000;     // 2-3 seconds
    LoRa.receive();                     // go back into receive mode
  }
}

void printSensorData(SensorData sensorData){
  Serial.printf("Soil Moisture: %f\n", sensorData.soilMoisture);
  Serial.printf("Rain Drop: %f\n", sensorData.rainDrop);
  Serial.printf("Humidity: %f\%\n", sensorData.h);
  Serial.printf("Temperature: %f°C\n", sensorData.t);
  Serial.printf("Bmp Temp: %f°C\n", sensorData.tempFromBmp);
  Serial.printf("Air Pressure: %fPa\n", sensorData.airPressure);
  Serial.printf("Altitude: %fm\n", sensorData.altitude);
}

SensorData getSensorData(){
  sensorData.soilMoisture=analogRead(SOIL_MOISTURE);
  sensorData.rainDrop=analogRead(RAINDROP_SENSOR);
  sensorData.h=dht.readHumidity();
  sensorData.t=dht.readTemperature();
  sensorData.tempFromBmp=bmp.readTemperature();
  sensorData.altitude=bmp.readAltitude();
  sensorData.airPressure=bmp.readPressure();
  return sensorData;
}

void transmitSensorData(SensorData sensorData){
  String data=String(sensorData.soilMoisture)+","+String(sensorData.rainDrop)+","+String(sensorData.h)+","+String(sensorData.t);
  sendMessage(data);
}

void turnPumpOn(){
  digitalWrite(PUMP, HIGH);
  Serial.println("turned pump on");
}

void turnPumpOff(){
  digitalWrite(PUMP, LOW);
  Serial.println("turned pump off");
}

void sendMessage(String outgoing) {
  LoRa.beginPacket();                   // start packet
  LoRa.write(destination);              // add destination address
  LoRa.write(localAddress);             // add sender address
  LoRa.write(msgCount);                 // add message ID
  LoRa.write(outgoing.length());        // add payload length
  LoRa.print(outgoing);                 // add payload
  LoRa.endPacket();                     // finish packet and send it
  msgCount++;                           // increment message ID
}

void onReceive(int packetSize) {
  if (packetSize == 0) return;          // if there's no packet, return

  // read packet header bytes:
  int recipient = LoRa.read();          // recipient address
  byte sender = LoRa.read();            // sender address
  byte incomingMsgId = LoRa.read();     // incoming msg ID
  byte incomingLength = LoRa.read();    // incoming msg length

  String incoming = "";                 // payload of packet

  while (LoRa.available()) {            // can't use readString() in callback, so
    incoming += (char)LoRa.read();      // add bytes one by one
  }
 

  // if (incomingLength != incoming.length()) {   // check length for error
  //   Serial.println("error: message length does not match length");
  //   return;                             // skip rest of function
  // }

  // // if the recipient isn't this device or broadcast,
  // if (recipient != localAddress && recipient != 0xFF) {
  //   Serial.println("This message is not for me.");
  //   return;                             // skip rest of function
  // }

  // if message is for this device, or broadcast, print details:
  // Serial.println("Received from: 0x" + String(sender, HEX));
  // Serial.println("Sent to: 0x" + String(recipient, HEX));
  // Serial.println("Message ID: " + String(incomingMsgId));
  // Serial.println("Message length: " + String(incomingLength));
  Serial.println("Message: " + incoming);
  // Serial.println("RSSI: " + String(LoRa.packetRssi()));
  // Serial.println("Snr: " + String(LoRa.packetSnr()));
  // Serial.println();
  if(incoming.equals("on")){
    Serial.println("Inside on if");
    turnPumpOn();
  }else if(incoming.equals("off")){
    Serial.println("Inside off if");
    turnPumpOff();
  }

}