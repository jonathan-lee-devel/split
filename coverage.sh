#! /bin/bash

set -e

rm -rf coverage
mkdir -p coverage/workspaces
for project in 'packages/split-auth-config' 'packages/split-constants' 'packages/split-observability' 'services/split-micro-users'
do
  if [ -f "$project/coverage/coverage-final.json" ]; then
    cp "$project"/coverage/coverage-final.json "$PWD"/coverage/workspaces/"$(basename $project)"-coverage-final.json
  fi
done
yarn run nyc merge coverage/workspaces coverage/monorepo-coverage.json
yarn run nyc report -t coverage --report-dir coverage/lcov --reporter=lcov
