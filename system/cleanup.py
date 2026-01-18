import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Cleanup GPIO 26
try:
    GPIO.remove_event_detect(26)
    print("Removed event detection from GPIO26")
except:
    print("No event detection to remove")

GPIO.cleanup(26)
print("GPIO26 cleaned up")

GPIO.cleanup()
print("All GPIO cleaned up")
