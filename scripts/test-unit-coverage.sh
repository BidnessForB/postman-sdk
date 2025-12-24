#!/bin/bash

# Unit Test Coverage: Run unit tests with coverage report
# Unit tests don't require test-ids.json cleanup since they use mocks

echo "Running unit tests with coverage..."

# Run unit tests with coverage
jest --testPathPatterns=unit --coverage --coverageReporters=json-summary --coverageReporters=text --coverageReporters=lcov

