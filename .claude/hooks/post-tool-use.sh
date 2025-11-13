#!/bin/bash

# BooksTrack Backend Post-Tool-Use Hook
# Automatically triggers relevant agents based on tool usage patterns

set -e

# Get the tool name from environment variable set by Claude Code
TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_PATH="${CLAUDE_TOOL_PATH:-}"

# Exit early if no tool name provided
if [ -z "$TOOL_NAME" ]; then
  exit 0
fi

# Track if we should invoke an agent
INVOKE_AGENT=""
AGENT_CONTEXT=""

# Deployment-related tools → cf-ops-monitor
if [[ "$TOOL_NAME" == "Bash" ]] && echo "$TOOL_PATH" | grep -qE "wrangler (deploy|publish)"; then
  INVOKE_AGENT="cf-ops-monitor"
  AGENT_CONTEXT="Deployment detected. Monitoring health and metrics..."

# Wrangler rollback → cf-ops-monitor
elif [[ "$TOOL_NAME" == "Bash" ]] && echo "$TOOL_PATH" | grep -q "wrangler rollback"; then
  INVOKE_AGENT="cf-ops-monitor"
  AGENT_CONTEXT="Rollback executed. Verifying system stability..."

# Code changes to handlers/services → cf-code-reviewer
elif [[ "$TOOL_NAME" =~ ^(Write|Edit)$ ]] && echo "$TOOL_PATH" | grep -qE "src/(handlers|services|providers)/"; then
  INVOKE_AGENT="cf-code-reviewer"
  AGENT_CONTEXT="Code changes in $TOOL_PATH detected. Running quality review..."

# wrangler.toml changes → both agents
elif [[ "$TOOL_NAME" =~ ^(Write|Edit)$ ]] && echo "$TOOL_PATH" | grep -q "wrangler.toml"; then
  INVOKE_AGENT="cf-ops-monitor,cf-code-reviewer"
  AGENT_CONTEXT="wrangler.toml modified. Validating configuration and deployment impact..."

# Log streaming → cf-ops-monitor
elif [[ "$TOOL_NAME" == "Bash" ]] && echo "$TOOL_PATH" | grep -q "wrangler tail"; then
  INVOKE_AGENT="cf-ops-monitor"
  AGENT_CONTEXT="Log streaming active. Analyzing patterns..."
fi

# If an agent should be invoked, notify the user
if [ -n "$INVOKE_AGENT" ]; then
  echo ""
  echo "🤖 Agent Trigger: $AGENT_CONTEXT"
  echo "   Relevant Skills: $INVOKE_AGENT"
  echo ""
  echo "   To invoke manually, use:"
  for agent in $(echo "$INVOKE_AGENT" | tr ',' ' '); do
    echo "   /skill $agent"
  done
  echo ""
fi

exit 0
