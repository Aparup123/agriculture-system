import time
import spidev
import RPi.GPIO as GPIO

# ---------------- CONFIG ----------------
SPI_BUS = 1
SPI_CS = 0

NSS = 18
RST = 13
DIO0 = 25   # not used in polling mode

FREQ = 433E6
# ---------------------------------------

# SX127x registers
REG_VERSION = 0x42
REG_OP_MODE = 0x01
REG_FIFO = 0x00
REG_IRQ_FLAGS = 0x12
REG_RX_NB_BYTES = 0x13
REG_FIFO_RX_CURRENT_ADDR = 0x10
REG_FIFO_ADDR_PTR = 0x0D

LONG_RANGE_MODE = 0x80
MODE_SLEEP = 0x00
MODE_STDBY = 0x01
MODE_RX_CONTINUOUS = 0x05

IRQ_RX_DONE = 0x40

# Setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(RST, GPIO.OUT)

# Setup SPI
spi = spidev.SpiDev()
spi.open(SPI_BUS, SPI_CS)
spi.max_speed_hz = 5000000

def read_reg(addr):
    return spi.xfer2([addr & 0x7F, 0x00])[1]

def write_reg(addr, val):
    spi.xfer2([addr | 0x80, val])

def reset():
    GPIO.output(RST, 0)
    time.sleep(0.1)
    GPIO.output(RST, 1)
    time.sleep(0.1)

def lora_init():
    reset()

    version = read_reg(REG_VERSION)
    print("SX1278 Version:", hex(version))
    if version != 0x12:
        print("❌ SX1278 not detected")
        exit(1)

    # Sleep
    write_reg(REG_OP_MODE, LONG_RANGE_MODE | MODE_SLEEP)
    time.sleep(0.1)

    # Standby
    write_reg(REG_OP_MODE, LONG_RANGE_MODE | MODE_STDBY)

    # Frequency = 433 MHz
    frf = int((FREQ / 32000000) * (1 << 19))
    write_reg(0x06, (frf >> 16) & 0xFF)
    write_reg(0x07, (frf >> 8) & 0xFF)
    write_reg(0x08, frf & 0xFF)

    # RX continuous
    write_reg(REG_OP_MODE, LONG_RANGE_MODE | MODE_RX_CONTINUOUS)

    print("📡 LoRa Receiver started (polling mode)...")

def read_packet():
    irq = read_reg(REG_IRQ_FLAGS)
    if irq & IRQ_RX_DONE:
        # Clear IRQ
        write_reg(REG_IRQ_FLAGS, 0xFF)

        # Read length
        length = read_reg(REG_RX_NB_BYTES)

        # Set FIFO pointer
        fifo_addr = read_reg(REG_FIFO_RX_CURRENT_ADDR)
        write_reg(REG_FIFO_ADDR_PTR, fifo_addr)

        data = []
        for _ in range(length):
            data.append(read_reg(REG_FIFO))

        try:
            msg = bytes(data).decode("utf-8")
        except:
            msg = str(data)

        print("📩 Received:", msg)

# ---------------- MAIN ----------------

lora_init()

while True:
    read_packet()
    time.sleep(0.1)

