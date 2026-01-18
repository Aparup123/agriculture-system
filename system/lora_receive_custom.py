import time
import busio
import digitalio
import board
import adafruit_rfm9x

print("Initializing RA-02 (SX1278) LoRa receiver...")

# Define pins
CS = digitalio.DigitalInOut(board.D16)  # GPIO16
RESET = digitalio.DigitalInOut(board.D13)  # GPIO13

# Initialize SPI1
spi = busio.SPI(board.SCLK_1, MOSI=board.MOSI_1, MISO=board.MISO_1)

# Initialize RA-02 module
try:
    rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, 433.0)  # RA-02 typically uses 433 MHz

    # Configure LoRa parameters for RA-02
    rfm9x.tx_power = 20  # RA-02 supports up to 20 dBm
    rfm9x.spreading_factor = 7  # SF7-SF12
    rfm9x.signal_bandwidth = 125000  # 125 kHz
    rfm9x.coding_rate = 5  # 4/5
    rfm9x.enable_crc = True
    rfm9x.preamble_length = 8

    print("="*50)
    print("RA-02 SX1278 LoRa Receiver Ready")
    print(f"Module: RA-02 (SX1278)")
    print(f"Frequency: 433.0 MHz")
    print(f"Spreading Factor: SF{rfm9x.spreading_factor}")
    print(f"Bandwidth: {rfm9x.signal_bandwidth/1000} kHz")
    print(f"Coding Rate: 4/{rfm9x.coding_rate}")
    print(f"TX Power: {rfm9x.tx_power} dBm")
    print(f"Pins: CS=GPIO16, RST=GPIO13, DIO0=GPIO26")
    print("="*50)
    print("\nListening for LoRa packets...\n")

    # Receive loop
    packet_count = 0
    while True:
        packet = rfm9x.receive(timeout=5.0)

        if packet is not None:
            packet_count += 1
            print("="*50)
            print(f"📡 PACKET #{packet_count} RECEIVED")
            print("="*50)

            try:
                # Try to decode as text
                packet_text = str(packet, "utf-8")
                print(f"Message: {packet_text}")
            except:
                # If not text, show raw bytes
                print(f"Data (hex): {packet.hex()}")
                print(f"Data (raw): {packet}")

            print(f"Signal Strength (RSSI): {rfm9x.last_rssi} dBm")
            print(f"Signal-to-Noise (SNR): {rfm9x.last_snr} dB")
            print(f"Packet Length: {len(packet)} bytes")
            print("="*50)
            print()
        else:
            # Still listening
            print(".", end="", flush=True)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("\n\n✓ Receiver stopped by user")
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
