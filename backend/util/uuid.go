package util

import (
	"github.com/google/uuid"
)

func GenerateId() (string, error) {
	newId, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	return newId.String(), nil
}
