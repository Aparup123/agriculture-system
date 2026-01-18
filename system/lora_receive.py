from SX127x.LoRa import *
from SX127x.board_config import BOARD
import time

# Configure for SPI1
BOARD.setup()
BOARD.SPI_BUS = 1  # Use SPI1 instead of SPI0
BOARD.SPI_CS = 0   # CE0 on SPI1

class LoRaReceiver(LoRa):
    def __init__(self, verbose=False):
        super(LoRaReceiver, self).__init__(verbose)
        self.set_mode(MODE.SLEEP)
        self.set_dio_mapping([0] * 6)

    def on_rx_done(self):
        print("\nReceived: ")
        self.clear_irq_flags(RxDone=1)
        payload = self.read_payload(nocheck=True)
        print("".join(chr(c) for c in payload))
        self.set_mode(MODE.SLEEP)
        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT)

    def start(self):
        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT)
        while True:
            sleep(1)

# Initialize
lora = LoRaReceiver(verbose=False)

# Configure LoRa parameters
lora.set_freq(915.0)  # Set your frequency (433, 868, 915 MHz)
lora.set_pa_config(pa_select=1)
lora.set_spreading_factor(7)
lora.set_bw(BW.BW125)
lora.set_coding_rate(CODING_RATE.CR4_5)

print("LoRa Receiver Ready")
lora.start()
