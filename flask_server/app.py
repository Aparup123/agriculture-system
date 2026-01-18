import time
import threading
import busio
import digitalio
import board
import adafruit_rfm9x

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
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
                text = str(packet, "utf-8")
                print("Message:", text)

                # Send to web UI
                socketio.emit("sensor_data", {"data": text})
                
            except:
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