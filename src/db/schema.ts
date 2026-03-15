import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// --- Enums ---

export const issueSeverityEnum = pgEnum("issue_severity", [
	"critical",
	"warning",
	"good",
]);

export const verdictEnum = pgEnum("verdict", [
	"excellent",
	"good",
	"needs_improvement",
	"needs_serious_help",
	"disaster",
]);

// --- Tables ---

export const roasts = pgTable("roasts", {
	id: uuid().primaryKey().defaultRandom(),
	shareId: text().unique().notNull(),
	code: text().notNull(),
	language: text().notNull(),
	lineCount: integer().notNull(),
	roastMode: boolean().notNull().default(true),
	score: real().notNull(),
	verdict: verdictEnum().notNull(),
	roastQuote: text().notNull(),
	suggestedCode: text(),
	aiModel: text(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const roastIssues = pgTable(
	"roast_issues",
	{
		id: uuid().primaryKey().defaultRandom(),
		roastId: uuid()
			.notNull()
			.references(() => roasts.id, { onDelete: "cascade" }),
		severity: issueSeverityEnum().notNull(),
		title: text().notNull(),
		description: text().notNull(),
		order: integer().notNull().default(0),
	},
	(table) => [index("roast_issues_roast_id_idx").on(table.roastId)],
);
