/**
 * Deterministic Security Lifecycle Hook for Antigravity
 * 
 * Enforces safety guardrails on tool execution (specifically run_command).
 * Blocks dangerous operations and flags high-blast-radius actions for confirmation.
 */

const fs = require('fs');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => { resolve(data); });
    process.stdin.on('error', () => { resolve(''); });
  });
}

const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+-rf\s+[\/\\]/i, reason: 'Root directory deletion blocked' },
  { pattern: /format\s+[a-z]:/i, reason: 'Disk format command blocked' },
  { pattern: /drop\s+database/i, reason: 'Database drop command blocked' },
  { pattern: /git\s+push.*--force/i, reason: 'Force push to remote repository blocked' },
  { pattern: /git\s+clean\s+-fdx/i, reason: 'Untracked file deletion without review blocked' },
  { pattern: /(?:cat|type|more|Get-Content)\s+[^\n]*\.env\b/i, reason: 'Direct display of .env secret file blocked' }
];

const RISKY_PATTERNS = [
  { pattern: /git\s+reset\s+--hard/i, reason: 'Hard git reset discards working changes' },
  { pattern: /npm\s+publish/i, reason: 'Package publish requires explicit confirmation' },
  { pattern: /docker\s+system\s+prune/i, reason: 'Docker system prune removes local images and containers' }
];

async function main() {
  let commandLine = process.argv.slice(2).join(' ').trim();
  
  if (!commandLine) {
    if (process.stdin.isTTY) {
      console.log(JSON.stringify({ decision: 'allow' }));
      return;
    }
    const input = await readStdin();
    if (!input.trim()) {
      console.log(JSON.stringify({ decision: 'allow' }));
      return;
    }

    try {
      const payload = JSON.parse(input);
      const toolCall = payload.toolCall || {};
      const toolName = toolCall.name || '';
      const args = toolCall.args || {};
      commandLine = args.CommandLine || '';
    } catch (err) {
      console.log(JSON.stringify({ decision: 'allow' }));
      return;
    }
  }

  if (commandLine) {
    for (const item of DANGEROUS_PATTERNS) {
      if (item.pattern.test(commandLine)) {
        console.log(JSON.stringify({
          decision: 'deny',
          reason: `[SECURITY GUARD] Blocked dangerous command: ${item.reason}`
        }));
        return;
      }
    }

    for (const item of RISKY_PATTERNS) {
      if (item.pattern.test(commandLine)) {
        console.log(JSON.stringify({
          decision: 'ask',
          reason: `[SECURITY GUARD] High-blast-radius command: ${item.reason}`
        }));
        return;
      }
    }
  }

  console.log(JSON.stringify({ decision: 'allow' }));
}

main();
