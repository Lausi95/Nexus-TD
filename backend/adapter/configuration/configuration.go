package configuration

import (
	"log"
	"os"

	"github.com/Lausi95/Nexus-TD/adapter/repository/mysql"
)

type Configuration struct {
	Mysql     mysql.Configuration
	JwtSecret string
}

func LoadConfiguration() Configuration {
	return Configuration{
		Mysql: mysql.Configuration{
			User:     getEnv("NEXUS_TD_DB_USERNAME", "root", true),
			Password: getEnv("NEXUS_TD_DB_PASSWORD", "root", true),
			Address:  getEnv("NEXUS_TD_DB_ADDR", "127.0.0.1:3306", false),
			DbName:   getEnv("NEXUS_TD_DB_DB_NAME", "nexus-td", false),
		},
		JwtSecret: getEnv("NEXUS_JWT_SECRET", "CHANGE_ME_PLS", true),
	}
}

func getEnv(envName, defaultValue string, sensitive bool) string {
	value, exists := os.LookupEnv(envName)
	if exists {
		return value
	}

	if sensitive {
		log.Printf("Using Default value for env var %s. DO NOT USE DEFAULT VALUE IN PRODUCTION MODE", envName)
	}

	return defaultValue
}
