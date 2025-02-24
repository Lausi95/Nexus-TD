package uuid

import (
	"github.com/Lausi95/Nexus-TD/domain"
	"github.com/google/uuid"
)

type uuidIdGenerator struct{}

func NewUuidIdGenerator() domain.IdGenerator {
	return &uuidIdGenerator{}
}

func (this *uuidIdGenerator) Generate() (string, error) {
	uuid, err := uuid.NewUUID()
	if err != nil {
		return "", err
	}

	return uuid.String(), nil
}
