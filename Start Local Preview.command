#!/bin/zsh
cd -- "${0:A:h}"
python3 scripts/serve.py --open
if [ $? -ne 0 ]; then
  echo "Press Return to close this window."
  read
fi
