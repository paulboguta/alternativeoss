CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "emails_email_unique" UNIQUE("email")
);
