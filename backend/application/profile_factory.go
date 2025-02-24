package application

import (
	"github.com/Lausi95/Nexus-TD/domain"
)

type profileFactoryImpl struct {
	idGenerator     domain.IdGenerator
	passwordEncoder domain.PasswordEncoder
}

func NewProfileFactory(idGenerator domain.IdGenerator, passwordEncoder domain.PasswordEncoder) domain.ProfileFactory {
	return &profileFactoryImpl{
		idGenerator:     idGenerator,
		passwordEncoder: passwordEncoder,
	}
}

func (this *profileFactoryImpl) Create(username, password, email string) (*domain.Profile, error) {
	id, err := this.idGenerator.Generate()
	if err != nil {
		return nil, err
	}

	passwordHash, err := this.passwordEncoder.Encode(password)
	if err != nil {
		return nil, err
	}

	profile := &domain.Profile{
		Id:           id,
		Username:     username,
		PasswordHash: passwordHash,
		Gems:         0,
	}

	return profile, nil
}
