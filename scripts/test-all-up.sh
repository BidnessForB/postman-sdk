#!/bin/bash

# Test All-Up: Run the complete functional test suite
# This script deletes test-ids.json if it exists, then runs the all-up functional tests

TEST_IDS_FILE="src/__tests__/test-ids.json"

# Remove test-ids.json if it exists
if [ -f "$TEST_IDS_FILE" ]; then
  echo "Removing existing test-ids.json..."
  rm "$TEST_IDS_FILE"
fi

# Run the all-up functional test
jest src/__tests__/all-up-functional.test.js

