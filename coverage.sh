#! /bin/bash

set -e

rm -rf coverage
mkdir -p coverage/workspaces
for project in 'packages/split-auth' 'packages/split-constants' 'packages/split-env' 'packages/split-http' 'packages/split-mail' 'packages/split-observability' 'packages/split-service-config' 'services/split-micro-users' 'services/split-micro-properties' 'services/split-micro-expenses' 'services/split-micro-mail'
do
  if [ -f "$project/coverage/coverage-final.json" ]; then
    cp "$project"/coverage/coverage-final.json "$PWD"/coverage/workspaces/"$(basename $project)"-coverage-final.json
  fi
done
yarn run nyc merge coverage/workspaces coverage/monorepo-coverage.json
yarn run nyc report -t coverage --report-dir coverage/lcov --reporter=lcov
