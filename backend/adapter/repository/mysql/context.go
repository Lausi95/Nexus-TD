package mysql

import (
	"database/sql"
	"log"

	"github.com/go-sql-driver/mysql"
)

type Configuration struct {
	User     string
	Password string
	Address  string
	DbName   string
}

type Context struct {
	DB *sql.DB
}

func NewContext(configuration Configuration) *Context {
	dbConfig := mysql.Config{
		User:   configuration.User,
		Passwd: configuration.Password,
		Addr:   configuration.Address,
		DBName: configuration.DbName,
		Net:    "tcp",
	}

	log.Println("Opening DB Connection...")
	db, err := sql.Open("mysql", dbConfig.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Testing DB connection...")
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database connection established")

	return &Context{
		DB: db,
	}
}
