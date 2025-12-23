#!/bin/bash

# Test Coverage: Run functional tests with coverage report
# This script deletes test-ids.json if it exists, then runs coverage

TEST_IDS_FILE="src/__tests__/test-ids.json"

# Remove test-ids.json if it exists
if [ -f "$TEST_IDS_FILE" ]; then
  echo "Removing existing test-ids.json..."
  rm "$TEST_IDS_FILE"
fi

# Run coverage
jest src/__tests__/all-up-functional.test.js --coverage --coverageReporters=json-summary --coverageReporters=text --coverageReporters=lcov

