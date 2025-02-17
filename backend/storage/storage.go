package storage

import (
	"database/sql"
	"log"

	"github.com/Lausi95/Nexus-TD/util"
	"github.com/go-sql-driver/mysql"
)

var db *sql.DB

func InitDB() error {
	dbConfig := mysql.Config{
		User:   util.GetEnv("NEXUS_TD_DB_USERNAME", "root", true),
		Passwd: util.GetEnv("NEXUS_TD_DB_PASSWORD", "root", true),
		Addr:   util.GetEnv("NEXUS_TD_DB_ADDR", "127.0.0.1:3306", false),
		DBName: util.GetEnv("NEXUS_TD_DB_DB_NAME", "nexus-td", false),
		Net:    "tcp",
	}

	log.Println("Opening DB Connection...")
	tmpDb, err := sql.Open("mysql", dbConfig.FormatDSN())
	if err != nil {
		return err
	}

	log.Println("Testing DB connection...")
	err = tmpDb.Ping()
	if err != nil {
		return err
	}

	log.Println("Database connection established")

	db = tmpDb
	return nil
}

func GetDB() *sql.DB {
	return db
}
