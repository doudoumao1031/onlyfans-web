#!/bin/bash

# Run the crypto test using ts-node
echo "Running crypto module tests..."
npx ts-node test/test-crypto.ts

# Exit with the status of the test
exit $?
