CREATE TABLE "purchase_order_items" (
	"guid" text PRIMARY KEY NOT NULL,
	"purchase_order_guid" text NOT NULL,
	"product_guid" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"guid" text PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"delivery_date" timestamp,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"total_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "purchase_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_guid_purchase_orders_guid_fk" FOREIGN KEY ("purchase_order_guid") REFERENCES "public"."purchase_orders"("guid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_guid_products_guid_fk" FOREIGN KEY ("product_guid") REFERENCES "public"."products"("guid") ON DELETE no action ON UPDATE no action;