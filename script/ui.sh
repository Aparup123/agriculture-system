
#!/bin/bash

# URL to open
URL="http://localhost:3000"

# Set display (usually :0 for the primary display)
export DISPLAY=:0

# Kill any existing Chromium processes
pkill chromium

# Wait a moment for processes to close
sleep 2

# Launch Chromium in kiosk mode (fullscreen)
chromium \
  --kiosk \
  --start-fullscreen \
  --start-maximized \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --noerrdialogs \
  --disable-translate \
  --disable-features=TranslateUI \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-features=PrivacySandboxSettings4 \
  --touch-events=enabled \
  "$URL" &
