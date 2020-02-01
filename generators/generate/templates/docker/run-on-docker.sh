#!/bin/bash

set -e

IMAGE_NAME=<%= appName %>-image
ADDITIONAL_EXEC_PARAM=$1

build_application() {
    mvn clean install -Dmaven.test.skip=true -Dfindbugs.skip=true
}

build_docker_image() {
    docker build -t "${IMAGE_NAME}" .
}

execute_docker_compose() {
  # shellcheck disable=SC2046
  docker-compose run --service-ports -e ACTIVE_VERSION=$(git rev-parse HEAD) app "${ADDITIONAL_EXEC_PARAM}"
}

main() {
  build_application
  build_docker_image
  execute_docker_compose
}

main
