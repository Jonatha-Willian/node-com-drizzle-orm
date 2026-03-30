CREATE TABLE "pets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"ownerId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;