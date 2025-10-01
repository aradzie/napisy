#!/usr/bin/env bash

systemd-inhibit uv run python -u lemmatize.py corpus1.txt 2>&1 | tee lemmatize1.log
systemd-inhibit uv run python -u lemmatize.py corpus2.txt 2>&1 | tee lemmatize2.log
systemd-inhibit uv run python -u lemmatize.py corpus3.txt 2>&1 | tee lemmatize3.log

notify-send "lemmatize.py" "The lemmatize script has finished."

echo "The system will shutdown in five minutes."
echo "Run 'shutdown -c' to cancel."

shutdown +5
