ALTER TABLE "invoice" DROP CONSTRAINT "invoice_stripe_customer_id_stripe_customer_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_stripe_customer_id_stripe_customer_id_fk" FOREIGN KEY ("stripe_customer_id") REFERENCES "public"."stripe_customer"("id") ON DELETE cascade ON UPDATE no action;