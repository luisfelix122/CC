.PHONY: lint format typecheck test verify
lint:
	npm run lint
format:
	npm run format
typecheck:
	npm run typecheck
test:
	npm run test
verify: lint format typecheck test
