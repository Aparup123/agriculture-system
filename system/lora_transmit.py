import time
import busio
import digitalio
import board
import adafruit_rfm9x
import keyboard

print("Initializing RA-02 (SX1278) LoRa transmitter...")

# Define pins
CS = digitalio.DigitalInOut(board.D16)  # GPIO16
RESET = digitalio.DigitalInOut(board.D13)  # GPIO13

# Initialize SPI1
spi = busio.SPI(board.SCLK_1, MOSI=board.MOSI_1, MISO=board.MISO_1)

# Initialize RA-02 module
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)  # Set your frequency

# Configure LoRa parameters (must match receiver)
rfm9x.tx_power = 20  # 5-20 dBm for RA-02
rfm9x.spreading_factor = 7
rfm9x.signal_bandwidth = 125000
rfm9x.coding_rate = 5
rfm9x.enable_crc = True

print("="*50)
print("RA-02 Transmitter Ready")
print(f"Frequency: 433.0 MHz")
print(f"TX Power: {rfm9x.tx_power} dBm")
print("="*50)
print()

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

# Example: Send messages
try:
    counter = 0
    while True:
        key = input("Enter command: ").strip()
        if key == "a":
            transmit_data("pump_on")
        elif key== "b":
            transmit_data("pump_off")
        #message = f"Hello{counter}"
        #transmit_data(message)
        #counter += 1
        time.sleep(2)  # Send every 2 seconds

except KeyboardInterrupt:
    print("\n✓ Transmitter stopped")
