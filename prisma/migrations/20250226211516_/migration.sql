-- AlterTable
CREATE SEQUENCE message_index_seq;
ALTER TABLE "Message" ALTER COLUMN "index" SET DEFAULT nextval('message_index_seq');
ALTER SEQUENCE message_index_seq OWNED BY "Message"."index";
