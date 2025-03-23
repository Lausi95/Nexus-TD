package main

import (
	"log"

	"github.com/Lausi95/Nexus-TD/adapter/configuration"
	"github.com/Lausi95/Nexus-TD/adapter/encryption"
	"github.com/Lausi95/Nexus-TD/adapter/jwt"
	"github.com/Lausi95/Nexus-TD/adapter/repository/mysql"
	"github.com/Lausi95/Nexus-TD/adapter/startup"
	"github.com/Lausi95/Nexus-TD/adapter/uuid"
	"github.com/Lausi95/Nexus-TD/adapter/web"
	"github.com/Lausi95/Nexus-TD/application"
	"github.com/labstack/echo/v4"
)

func main() {
	// configuration
	configuration := configuration.LoadConfiguration()

	// driven adapters
	idGenerator := uuid.NewUuidIdGenerator()
	passwordEncoder := encryption.NewBcryptPasswordEncoder()
	tokenHandler := jwt.NewJwtTokenHandler(configuration.JwtSecret)
	mysqlContext := mysql.NewContext(configuration.Mysql)

	// domain dependencies
	upgradeRepository := mysql.NewMysqlUpgradeRepository(mysqlContext.DB)
	profileRepository := mysql.NewMysqlProfileRepository(mysqlContext.DB)

	profileFactory := application.NewProfileFactory(idGenerator, passwordEncoder)
	upgradeFactory := application.NewUpgradeFactory(idGenerator)

	profileService := application.NewProfileService(profileFactory, profileRepository, tokenHandler, passwordEncoder)
	upgradeService := application.NewUpgradeService(upgradeFactory, upgradeRepository)

	// driving ports
	startupRoutine := startup.NewStartupRoutine(upgradeService)
	handlers := []web.Handler{
		web.NewAuthHandler(profileService),
		web.NewProfileController(profileService),
	}

	// main
	if err := startupRoutine.Run(); err != nil {
		log.Fatal(err)
	}

	e := echo.New()
	e.Debug = true

	for _, handler := range handlers {
		handler.Init(e)
	}

	log.Fatal(e.Start(":8080"))
}
