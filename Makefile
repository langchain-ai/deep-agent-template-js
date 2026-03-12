.PHONY: help install dev run test integration-tests lint format build

help:
	@echo 'Targets:'
	@echo '  install             Install runtime dependencies with npm'
	@echo '  dev                 Start the LangGraph local dev server'
	@echo '  run                 Run the deployed graph once'
	@echo '  build               Build the LangGraph bundle'
	@echo '  test                Run unit tests'
	@echo '  integration-tests   Run integration tests'
	@echo '  lint                Run Prettier in check mode'
	@echo '  format              Format source + tests with Prettier'

install:
	npm install

dev:
	npm run dev

run:
	npm run start

build:
	npm run build

test:
	npm test

integration-tests:
	npm run test:integration

lint:
	npm run lint

format:
	npm run format
