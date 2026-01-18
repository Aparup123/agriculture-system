import spidev
import time

spi = spidev.SpiDev()
spi.open(1,0)
spi.max_speed_hz = 5000000

# Read version register (0x42)
version = spi.xfer2([0x42 & 0x7F, 0x00])[1]

print("LoRa Version Register:", hex(version))

if version == 0x12:
    print("✅ SX1276/78 detected! LoRa module is working.")
else:
    print("❌ No LoRa detected. Check wiring.")

