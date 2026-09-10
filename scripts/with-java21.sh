#!/usr/bin/env bash
# The Firebase emulators require JDK 21+. macOS often defaults to an older JDK,
# so prefer a Homebrew openjdk@21+ if one is installed, otherwise fall back to
# whatever `java` is on PATH and let the emulator report the version itself.
set -euo pipefail

for candidate in /opt/homebrew/opt/openjdk@25 /opt/homebrew/opt/openjdk@21 /usr/local/opt/openjdk@21; do
  if [ -x "$candidate/bin/java" ]; then
    export JAVA_HOME="$candidate"
    export PATH="$JAVA_HOME/bin:$PATH"
    break
  fi
done

exec "$@"
