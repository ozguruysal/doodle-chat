/**
 * RUN: npx ts-node load-test.ts
 */

const API_URL = "http://localhost:3000/api/v1/messages";
const TOTAL_MESSAGES = 100;

const MIN_DELAY_MS = 3000; // 3 seconds
const MAX_DELAY_MS = 15000; // 15 seconds

const AUTHORS = ["Luka", "Maria", "John", "Sarah", "Alex"];

const PHRASES = [
  // Short
  "Hey!",
  "Yep.",
  "Nope.",
  "On it.",
  "Thanks!",
  "Okay 👍",
  "Got it.",
  "Sounds good.",

  // Medium
  "I'll check it and get back to you.",
  "That feature is almost ready for testing.",
  "Can you send me the latest update?",
  "We should probably review this together.",
  "I think this might be related to the bug we saw earlier.",
  "Let’s sync up before the deployment.",
  "I’ve pushed the changes to the repo.",
  "Do you have time for a quick call?",
  "The API response looks inconsistent.",
  "We may need to refactor this part.",

  // Long
  "I reviewed the logs and found a potential race condition that happens when multiple users update the same record simultaneously. We should probably introduce locking or a queue to prevent conflicts.",
  "The system is mostly stable now, but under heavy load we still see latency spikes. I’ll run profiling tomorrow to identify bottlenecks and optimize database queries.",
  "The notification system sometimes fails when users reconnect after being offline. We may need a retry mechanism or persistent queue to guarantee delivery.",
  "We should reconsider the architecture as we scale. The current design might not handle high concurrency well, especially with real-time updates and ordering guarantees.",
  "User feedback shows confusion in the chat creation flow. We should simplify onboarding and make primary actions more visible in the UI.",
];

// ⏱️ Random delay
function getRandomDelay() {
  return (
    Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS
  );
}

// ⏱️ Sleep helper
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMessage(i: number) {
  const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  const baseMessage = PHRASES[Math.floor(Math.random() * PHRASES.length)];

  // 🔢 Add order number prefix
  const message = `${i} - ${baseMessage}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer super-secret-doodle-token",
    },
    body: JSON.stringify({ author, message }),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body: text,
    author,
    message,
  };
}

async function runLoadTest() {
  console.log("\n🚀 STARTING CHAT SIMULATION");
  console.log(`📡 Target: ${API_URL}`);
  console.log(`💬 Messages: ${TOTAL_MESSAGES}`);
  console.log(`⏱️ Delay: 3s → 15s between messages\n`);

  let success = 0;
  let failed = 0;

  for (let i = 1; i <= TOTAL_MESSAGES; i++) {
    try {
      const result = await sendMessage(i);

      if (result.ok) {
        success++;
        console.log(
          `✅ [${i}/${TOTAL_MESSAGES}] ${result.author}: "${result.message}"`,
        );
      } else {
        failed++;
        console.log(
          `❌ [${i}/${TOTAL_MESSAGES}] HTTP ${result.status} → ${result.body}`,
        );
      }
    } catch (err: any) {
      failed++;
      console.log(`❌ [${i}/${TOTAL_MESSAGES}] ERROR → ${err.message}`);
    }

    // ⏳ Wait before next message
    if (i < TOTAL_MESSAGES) {
      const delay = getRandomDelay();
      console.log(`⏳ Waiting ${(delay / 1000).toFixed(1)}s...\n`);
      await sleep(delay);
    }
  }

  console.log("\n==============================");
  console.log("        FINAL SUMMARY");
  console.log("==============================");
  console.log(`Total:    ${TOTAL_MESSAGES}`);
  console.log(`Success:  ${success}`);
  console.log(`Failed:   ${failed}`);
  console.log("==============================\n");
}

runLoadTest().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
