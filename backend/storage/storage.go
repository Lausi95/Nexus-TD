package storage

import (
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"log"
)

var db *sql.DB

func InitDB() error {
	dbConfig := mysql.Config{
		User:   "root",
		Passwd: "root",
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "nexus-td",
	}

	var err error
	db, err = sql.Open("mysql", dbConfig.FormatDSN())
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	log.Println("Database connection established")

	return nil
}

func GetDB() *sql.DB {
	return db
}
