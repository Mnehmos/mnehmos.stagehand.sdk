#!/usr/bin/env bash
set -euo pipefail
specify init --here --force --non-interactive --integration claude
# Seed the generated constitution from ../00_CONSTITUTION.md using /speckit.constitution in the coding agent.
# Then follow spec-kit-seed/SPEC_KIT_COMMAND_QUEUE.md in rebuild order.
