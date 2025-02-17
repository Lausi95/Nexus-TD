package util

import (
	"log"
	"os"
)

func GetEnv(envName, defaultValue string, sensitive bool) string {
	value, exists := os.LookupEnv(envName)
	if exists {
		return value
	}

	if sensitive {
		log.Printf("Using Default value for env var %s. DO NOT USE DEFAULT VALUE IN PRODUCTION MODE", envName)
	}

	return defaultValue
}
