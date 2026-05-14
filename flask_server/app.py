import time
import threading
import busio
import digitalio
import board
import adafruit_rfm9x
import sys

sys.path.append('/home/aparup/Documents/projects/agriculture-system')

from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
from rag.rag import stream_answer
from db.connection import curr, conn

app = Flask(__name__)
# enable CORS for all routes (fetch requests) and sockets
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

print("Initializing RA-02 (SX1278) LoRa receiver...")

# Define pins
CS = digitalio.DigitalInOut(board.D16)
RESET = digitalio.DigitalInOut(board.D13)

# SPI1
spi = busio.SPI(board.SCLK_1, MOSI=board.MOSI_1, MISO=board.MISO_1)

# Init LoRa
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)

# Configure
rfm9x.tx_power = 20
rfm9x.spreading_factor = 7
rfm9x.signal_bandwidth = 125000
rfm9x.coding_rate = 5
rfm9x.enable_crc = True
rfm9x.preamble_length = 8

print("RA-02 SX1278 Ready. Listening...")

# Transmit Queue
transmit_queue=[]


# =========================
# LoRa background thread
# =========================
def lora_listener():
    packet_count = 0

    while True:
        packet = rfm9x.receive(timeout=2.0)

        if packet:
            if len(transmit_queue)>0:
                time.sleep(0.2)
                while not rfm9x.send_with_ack(bytes(transmit_queue[0], "utf-8")):
                    time.sleep(0.1)
                transmit_queue.pop(0)
                print("send success")
            packet_count += 1
            print(f"\n📡 PACKET #{packet_count}")

            try:
                # decode safely
                text = packet.decode("utf-8", errors="replace")
                print("Message:", text)

                # Send to web UI
                socketio.emit("sensor_data", {"data": text})

                sensorValues = [s.strip() for s in text.split(",")]
                
                try:
                    
                    # Insert raw values (avoid raising on parsing); SQLite accepts flexible types
                    curr.execute(
                        "INSERT INTO sensor_data (soil_moisture,rain_status,humidity,temperature,temperature_from_bmp,altitude,air_pressure,battery) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",(float(sensorValues[0]), float(sensorValues[1]),float(sensorValues[2]),float(sensorValues[3]),float(sensorValues[4]),float(sensorValues[5]),float(sensorValues[6]),float(sensorValues[7])))
                    conn.commit()
                    print("Data inserted into database.")
                except Exception as e:
                    import traceback
                    print("DB insert error:", e)
                    traceback.print_exc()

            except Exception as e:
                import traceback
                print("Packet handling error:", e)
                traceback.print_exc()
                print("Raw:", packet)

            print("RSSI:", rfm9x.last_rssi)
            print("SNR:", rfm9x.last_snr)

        time.sleep(0.1)


# =========================
# Flask routes
# =========================
@app.route("/")
def index():
    return "LoRa Receiver Running"

@app.route("/rag")
def ragRoute():
    return stream_answer("What is food security?")



@app.route("/latest-sensor-data")
def latest_sensor_data():
    curr.execute("SELECT id, timestamp, soil_moisture, rain_status, humidity, temperature, temperature_from_bmp, altitude, air_pressure, battery FROM sensor_data ORDER BY timestamp DESC LIMIT 10")
    rows = curr.fetchall()
    data=[]
    if rows:
        for row in rows:
            data.append({
                "id": row[0],
                "timestamp": row[1],
                "soil_moisture": row[2],
                "rain_status": row[3],
                "humidity": row[4],
                "temperature": row[5],
                "temperature_from_bmp": row[6],
                "altitude": row[7],
                "air_pressure": row[8],
                "battery": row[9]
            })
    
    else:
        return {"error": "No data available"}, 404
    print("Fetched latest sensor data:", data)
    return {"data": data}

def transmit_data(message):
    """Transmit a message via LoRa"""
    try:
        # Convert message to bytes if it's a string
        if isinstance(message, str):
            data = bytes(message, "utf-8")
        else:
            data = message

        # Send the packet
        rfm9x.send(data)
        print(f"✓ Transmitted: {message}")
        return True
    except Exception as e:
        print(f"✗ Transmission failed: {e}")
        return False

@socketio.on("pump_state")
def pump_state(data):
    transmit_queue.append(data)
    # print("EVENT: pump_state\n data: {}".format(data))
    
    

    

# =========================
# Main
# =========================
if __name__ == "__main__":
    t = threading.Thread(target=lora_listener, daemon=True)
    t.start()

    socketio.run(app, host="0.0.0.0", port=5000)