import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roastIssues, roasts } from "@/db/schema";

// --- Static data ---

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"java",
	"c",
	"cpp",
	"csharp",
	"go",
	"rust",
	"ruby",
	"php",
	"swift",
	"kotlin",
	"xml",
	"css",
	"sql",
	"bash",
	"json",
	"yaml",
	"markdown",
];

const AI_MODELS = ["gpt-4o", "gpt-4o-mini", "claude-sonnet-4-20250514"];

const CODE_SNIPPETS = [
	`function add(a, b) {
  var result = a + b;
  return result;
  console.log("done"); // unreachable
}`,
	`eval(prompt("enter code"));
document.write(response);
// trust the user lol`,
	`if (x == true) {
  return true;
} else if (x == false) {
  return false;
} else {
  return null;
}`,
	`SELECT * FROM users WHERE 1=1
-- TODO: add authentication
-- TODO: add input sanitization`,
	`def fibonacci(n):
    if n == 1:
        return 1
    if n == 2:
        return 1
    if n == 3:
        return 2
    if n == 4:
        return 3
    if n == 5:
        return 5
    if n == 6:
        return 8
    # TODO: finish this`,
	`try {
  doSomething();
} catch (e) {
  // ignore
}`,
	`const sleep = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // busy wait baby
  }
};`,
	`class God {
  constructor() {
    this.everything = {};
    this.handleAuth();
    this.handleDB();
    this.handleUI();
    this.handlePayments();
    this.handleEmails();
    this.handleAnalytics();
    this.handleNotifications();
  }
}`,
	`let data = JSON.parse(JSON.stringify(data));
let copy = JSON.parse(JSON.stringify(data));
let backup = JSON.parse(JSON.stringify(copy));`,
	`password = "admin123"
db_host = "production-db.company.com"
api_key = "sk-1234567890abcdef"
# deploy to github public repo`,
	`for i in range(len(my_list)):
    for j in range(len(my_list)):
        for k in range(len(my_list)):
            if my_list[i] + my_list[j] == my_list[k]:
                print("found it")`,
	`function isEven(n) {
  if (n === 0) return true;
  if (n === 1) return false;
  return isEven(n - 2);
}`,
	`public class StringUtils {
  public static boolean isEmpty(String s) {
    if (s.length() == 0) return true;
    if (s.length() == 1 && s.charAt(0) == ' ') return true;
    if (s.length() == 2 && s.charAt(0) == ' ' && s.charAt(1) == ' ') return true;
    return false;
  }
}`,
	`import React from "react";

export default function App() {
  let count = 0;
  function increment() {
    count = count + 1;
    document.getElementById("count").innerHTML = count;
  }
  return <div><span id="count">{count}</span><button onClick={increment}>+</button></div>;
}`,
	`// todo: refactor this
// todo: fix this
// todo: remove this
// todo: why does this work?
// todo: ask someone about this
Math.random() > 0.5 ? doA() : doB();`,
	`func main() {
	err := doSomething()
	err = doAnotherThing()
	err = doYetAnotherThing()
	if err != nil {
		panic(err)
	}
}`,
	`async function getData() {
  const res1 = await fetch("/api/users");
  const users = await res1.json();
  const res2 = await fetch("/api/posts");
  const posts = await res2.json();
  const res3 = await fetch("/api/comments");
  const comments = await res3.json();
  // could have used Promise.all but who cares
  return { users, posts, comments };
}`,
	`.container {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
}`,
	`fn main() {
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    let s: String = String::from("hello");
    let s2: String = s.clone();
    let s3: String = s2.clone();
    println!("{} {} {}", s, s2, s3);
}`,
	`const express = require("express");
const app = express();

app.get("*", (req, res) => {
  const output = eval(req.query.code);
  res.send(output);
});

app.listen(3000);`,
];

const ROAST_QUOTES = [
	"Your code called. It wants its dignity back.",
	"I've seen spaghetti with better structure than this.",
	"This code violates the Geneva Convention.",
	"Even Stack Overflow would refuse this question.",
	"If code could cry, yours would be sobbing.",
	"Your code is the reason seniors quit.",
	"I've seen better logic in a fortune cookie.",
	"This is not code, it's a cry for help.",
	"Did you write this blindfolded? Respect if so.",
	"Somewhere a CS professor just felt a disturbance in the force.",
	"This code should be classified as a biohazard.",
	"Your variable names haunt me in my sleep.",
	"Pretty sure this violates at least 3 laws of thermodynamics.",
	"If debugging is the process of removing bugs, programming must be the process of putting them in. You're a natural.",
	"This code belongs in a museum — the horror section.",
	"I need therapy after reading this.",
	"Even ChatGPT would hallucinate something better.",
	"You didn't just miss best practices, you fled the country.",
	"Clean code weeps in the corner after seeing this.",
	"The only thing worse than this code is the person who approved it.",
];

const ISSUE_POOL = [
	{
		title: "Using var instead of const/let",
		description:
			"Variables declared with 'var' are function-scoped and hoisted, leading to confusing bugs. Use 'const' for values that don't change and 'let' for those that do.",
	},
	{
		title: "No error handling",
		description:
			"Empty catch blocks silently swallow errors, making debugging nearly impossible. Always handle or re-throw errors meaningfully.",
	},
	{
		title: "Hardcoded credentials",
		description:
			"Passwords and API keys should never be hardcoded in source files. Use environment variables or a secrets manager.",
	},
	{
		title: "God class detected",
		description:
			"This class handles too many responsibilities. Break it into smaller, focused classes following the Single Responsibility Principle.",
	},
	{
		title: "O(n^3) time complexity",
		description:
			"Triple nested loops over the same collection is extremely inefficient. Consider using hash maps or sorting to reduce complexity.",
	},
	{
		title: "Unreachable code",
		description:
			"Code after a return statement will never execute. This indicates a logic error or dead code that should be removed.",
	},
	{
		title: "Using eval()",
		description:
			"eval() executes arbitrary code and is a massive security vulnerability. Never use it, especially with user input.",
	},
	{
		title: "Busy-wait loop",
		description:
			"Blocking the event loop with a while loop to simulate sleep is terrible for performance. Use setTimeout or async/await.",
	},
	{
		title: "Recursive without base case limit",
		description:
			"This recursive function will cause a stack overflow for large inputs. Add proper base cases or use iteration instead.",
	},
	{
		title: "Sequential awaits instead of Promise.all",
		description:
			"Independent async operations should run in parallel using Promise.all() instead of being awaited sequentially.",
	},
	{
		title: "Redundant boolean comparison",
		description:
			"Comparing a boolean to true/false is redundant. Just use the boolean value directly in the condition.",
	},
	{
		title: "Deep cloning via JSON.parse/stringify",
		description:
			"This approach fails with dates, functions, undefined, and circular references. Use structuredClone() instead.",
	},
	{
		title: "CSS redundancy overload",
		description:
			"Multiple properties are set to their default values or are redundant. Use shorthand properties and remove unnecessary declarations.",
	},
	{
		title: "Mutating state directly in React",
		description:
			"Directly mutating variables instead of using useState causes React to skip re-renders. Your UI will be permanently stale.",
	},
	{
		title: "SQL injection vulnerability",
		description:
			"Building SQL queries with string concatenation or no parameterization exposes your database to injection attacks.",
	},
	{
		title: "Ignoring Go error returns",
		description:
			"Reassigning error variables without checking them means you only catch the last error. Handle each error as it occurs.",
	},
	{
		title: "Unnecessary cloning in Rust",
		description:
			"Excessive .clone() calls defeat the purpose of Rust's ownership system. Use references and borrowing instead.",
	},
	{
		title: "Magic numbers everywhere",
		description:
			"Raw numbers without explanation make the code unreadable. Extract them into named constants with meaningful names.",
	},
];

// --- Helpers ---

type Verdict =
	| "excellent"
	| "good"
	| "needs_improvement"
	| "needs_serious_help"
	| "disaster";

type IssueSeverity = "critical" | "warning" | "good";

function scoreToVerdict(score: number): Verdict {
	if (score >= 9) return "excellent";
	if (score >= 7) return "good";
	if (score >= 5) return "needs_improvement";
	if (score >= 3) return "needs_serious_help";
	return "disaster";
}

function scoreToPrimarySeverity(score: number): IssueSeverity {
	if (score >= 7) return "good";
	if (score >= 4) return "warning";
	return "critical";
}

// --- Seed ---

async function seed() {
	console.log("Truncating tables...");
	await db.execute(sql`TRUNCATE TABLE roast_issues, roasts CASCADE`);

	console.log("Seeding 100 roasts...");

	const roastValues = Array.from({ length: 100 }, () => {
		const code = faker.helpers.arrayElement(CODE_SNIPPETS);
		const score = faker.number.float({
			min: 0,
			max: 10,
			fractionDigits: 1,
		});

		return {
			shareId: faker.string.nanoid(8),
			code,
			language: faker.helpers.arrayElement(LANGUAGES),
			lineCount: code.split("\n").length,
			roastMode: faker.datatype.boolean({ probability: 0.8 }),
			score,
			verdict: scoreToVerdict(score),
			roastQuote: faker.helpers.arrayElement(ROAST_QUOTES),
			suggestedCode: faker.datatype.boolean()
				? `// improved version\n${code}`
				: null,
			aiModel: faker.helpers.arrayElement(AI_MODELS),
			createdAt: faker.date.recent({ days: 30 }),
		};
	});

	const insertedRoasts = await db
		.insert(roasts)
		.values(roastValues)
		.returning({ id: roasts.id, score: roasts.score });

	console.log(`Inserted ${insertedRoasts.length} roasts.`);

	console.log("Seeding issues...");

	const issueValues = insertedRoasts.flatMap((roast) => {
		const count = faker.number.int({ min: 1, max: 5 });
		const primarySeverity = scoreToPrimarySeverity(roast.score);

		return Array.from({ length: count }, (_, idx) => {
			const issue = faker.helpers.arrayElement(ISSUE_POOL);
			const severity: IssueSeverity =
				idx === 0
					? primarySeverity
					: faker.helpers.arrayElement(["critical", "warning", "good"]);

			return {
				roastId: roast.id,
				severity,
				title: issue.title,
				description: issue.description,
				order: idx,
			};
		});
	});

	await db.insert(roastIssues).values(issueValues);

	console.log(`Inserted ${issueValues.length} issues.`);
	console.log("Seed complete.");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
