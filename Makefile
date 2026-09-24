PORT ?= 3000
LOCKFILE := .next/dev/lock

.PHONY: help start stop install test lint build

help:
	@echo "make start         Start the local app (stops any previous next dev first)"
	@echo "make start PORT=N  Start on port N"
	@echo "make stop          Stop the app's next dev server"
	@echo "make install       Install npm dependencies"
	@echo "make test          Run Playwright tests"
	@echo "make lint          Run ESLint"
	@echo "make build         Production build"

install:
	npm install

# Next only allows one `next dev` per project. Always release that lock
# before starting, otherwise `make start PORT=...` fails on every port.
stop:
	@if [ -f $(LOCKFILE) ]; then \
	  pid=$$(python3 -c "import json; print(json.load(open('$(LOCKFILE)')).get('pid',''))" 2>/dev/null || true); \
	  if [ -n "$$pid" ] && kill -0 $$pid 2>/dev/null; then \
	    echo "Stopping existing next dev (PID $$pid)"; \
	    kill $$pid 2>/dev/null || true; \
	    i=0; \
	    while kill -0 $$pid 2>/dev/null && [ $$i -lt 25 ]; do sleep 0.2; i=$$((i+1)); done; \
	    if kill -0 $$pid 2>/dev/null; then kill -9 $$pid 2>/dev/null || true; fi; \
	  fi; \
	  rm -f $(LOCKFILE); \
	fi

start: stop
	@test -d node_modules || npm install
	@chosen="$(PORT)"; \
	if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:$$chosen -sTCP:LISTEN >/dev/null 2>&1; then \
	  for p in $$(seq $(PORT) $$(($(PORT)+20))); do \
	    if ! lsof -nP -iTCP:$$p -sTCP:LISTEN >/dev/null 2>&1; then chosen=$$p; break; fi; \
	  done; \
	  if [ "$$chosen" != "$(PORT)" ]; then \
	    echo "Port $(PORT) is in use — starting on $$chosen instead."; \
	  fi; \
	fi; \
	echo "App: http://localhost:$$chosen"; \
	npm run dev -- --port $$chosen

test:
	npm test

lint:
	npm run lint

build:
	npm run build
