set client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS todos (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY ("id")
)