#!/usr/bin/env bash

systemd-inhibit uv run python -u lemmatize.py 2>&1 | tee lemmatize.log

notify-send "lemmatize.py" "The lemmatize script has finished."

echo "The system will shutdown in five minutes."
echo "Run 'shutdown -c' to cancel."

shutdown +5
