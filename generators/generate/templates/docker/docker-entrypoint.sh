#!/bin/bash -e

export JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom \
-Dspring.profiles.active=${ACTIVE_PROFILES}"

# shellcheck disable=SC2093
exec java "${JAVA_OPTS}" -jar "/app/bin/<%= jarFileName %>.jar"

exec "$@"
