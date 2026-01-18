import RPi.GPIO as GPIO
import spidev

class CustomBoard:
    # SPI pins
    SPI_BUS = 1
    SPI_CS = 0
    
    # LoRa pins
    DIO0 = 26  # GPIO26
    DIO1 = None
    DIO2 = None
    DIO3 = None
    DIO4 = None
    DIO5 = None
    RST = 13   # GPIO13
    LED = None
    
    # SPI device
    spi = None
    
    @staticmethod
    def setup():
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        
        # Setup RST as output
        GPIO.setup(CustomBoard.RST, GPIO.OUT, initial=GPIO.HIGH)
        
        # Setup DIO0 as input with pull-down
        GPIO.setup(CustomBoard.DIO0, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        
        # Setup SPI
        CustomBoard.spi = spidev.SpiDev()
        CustomBoard.spi.open(CustomBoard.SPI_BUS, CustomBoard.SPI_CS)
        CustomBoard.spi.max_speed_hz = 5000000
        
    @staticmethod
    def teardown():
        GPIO.cleanup()
        if CustomBoard.spi:
            CustomBoard.spi.close()
    
    @staticmethod
    def add_events(dio0_callback, dio1_callback=None, dio2_callback=None, 
                   dio3_callback=None, dio4_callback=None, dio5_callback=None):
        if dio0_callback and CustomBoard.DIO0:
            GPIO.add_event_detect(CustomBoard.DIO0, GPIO.RISING, callback=dio0_callback)

BOARD = CustomBoard()
