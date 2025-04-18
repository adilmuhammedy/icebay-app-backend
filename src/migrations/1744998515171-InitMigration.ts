import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1744998515171 implements MigrationInterface {
    name = 'InitMigration1744998515171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "franchises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "company_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "owner_id" character varying NOT NULL, "owner_name" character varying, "address" text NOT NULL, "phone" character varying(20) NOT NULL, "qr_code" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "registration_id" SERIAL NOT NULL, "location" character varying(255) NOT NULL, CONSTRAINT "UQ_7db53abe050a27f927ab5ffb406" UNIQUE ("phone"), CONSTRAINT "UQ_4c8c7c0824e07135dc47d3a14af" UNIQUE ("qr_code"), CONSTRAINT "UQ_8b35ec38a0d0df6bf1b5413ead2" UNIQUE ("registration_id"), CONSTRAINT "PK_5ff74e1ad0637c499c4ed139e2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "franchise_stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "franchise_id" uuid NOT NULL, "product_id" uuid NOT NULL, "stock_quantity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_75230238e17412a5856e61c561a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "franchises" ADD CONSTRAINT "FK_df7a383601b34b217017cd61ff5" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "franchise_stock" ADD CONSTRAINT "FK_963c1ab170960aa0017e5110951" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "franchise_stock" ADD CONSTRAINT "FK_6faf065264d28c6841b10e1e382" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "franchise_stock" DROP CONSTRAINT "FK_6faf065264d28c6841b10e1e382"`);
        await queryRunner.query(`ALTER TABLE "franchise_stock" DROP CONSTRAINT "FK_963c1ab170960aa0017e5110951"`);
        await queryRunner.query(`ALTER TABLE "franchises" DROP CONSTRAINT "FK_df7a383601b34b217017cd61ff5"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "franchise_stock"`);
        await queryRunner.query(`DROP TABLE "franchises"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
