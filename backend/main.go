package main

import (
	"github.com/labstack/echo/v4"
	"log"
	"nexus-td.com/handlers"
	"nexus-td.com/storage"
)

func main() {
	err := storage.InitDB()
	if err != nil {
		log.Fatal(err)
		return
	}

	e := echo.New()
	e.Debug = true
	e.Use(handlers.AuthMiddleware)
	e.POST("/register", handlers.RegisterHandler)
	e.POST("/login", handlers.LoginHandler)
	e.GET("/users", handlers.GetUsersHandler)

	log.Fatal(e.Start(":8080"))
}
