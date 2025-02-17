package main

import (
	"log"

	"github.com/Lausi95/Nexus-TD/handlers"
	"github.com/Lausi95/Nexus-TD/model"
	"github.com/Lausi95/Nexus-TD/storage"
	"github.com/labstack/echo/v4"
)

func main() {
	if err := storage.InitDB(); err != nil {
		log.Fatal(err)
		return
	}

	if err := model.InitUpgrades(); err != nil {
		log.Fatal(err)
		return
	}

	e := echo.New()
	e.Debug = true
	e.Use(handlers.AuthMiddleware)
	e.POST("/register", handlers.RegisterHandler)
	e.POST("/login", handlers.LoginHandler)
	e.GET("/profile", handlers.GetProfile)

	log.Fatal(e.Start(":8080"))
}
