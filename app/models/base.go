package models

import (
	"crypto/sha1"
	"database/sql"
	"fmt"
	"log"
	"montask/config"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

var Db *sql.DB

var err error

const (
	tableNameUser     = "users"
	tableNameTask     = "tasks"
	tableNameCategory = "categories"
	tableNameColor    = "colors"
	tableNameSession  = "sessions"
)

func InitDB() {
	Db, err = sql.Open(config.Config.SQLDriver, config.Config.DbName)
	if err != nil {
		log.Fatalln(err)
	}

	cmdU := fmt.Sprintf(`create table if not exists %s(
		id INTEGER PRIMARY KEY,
		uuid string not null unique,
		email string,
		password string,
		created_at datetime)`, tableNameUser)

	Db.Exec(cmdU)

	cmdT := fmt.Sprintf(`create table if not exists %s(
		id INTEGER PRIMARY KEY,
		title string,
		user_id INTEGER,
		category_id INTEGER,
		status boolean,
		start_time datetime,
		end_time datetime,
		created_at datetime)`, tableNameTask)

	Db.Exec(cmdT)

	cmdC := fmt.Sprintf(`create table if not exists %s(
		id INTEGER PRIMARY KEY,
		name string,
		color_id INTEGER,
		user_id INTEGER,
		created_at datetime)`, tableNameCategory)

	Db.Exec(cmdC)

	cmdS := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		uuid STRING NOT NULL,
		email STRING,
		user_id INTEGER,
		created_at DATETIME)`, tableNameSession)

	Db.Exec(cmdS)
}

func createUUID() (uuidobj uuid.UUID) {
	uuidobj, _ = uuid.NewUUID()
	return uuidobj
}

func Encrypt(plaintext string) (cryptext string) {
	cryptext = fmt.Sprintf("%x", sha1.Sum([]byte(plaintext)))
	return cryptext
}
