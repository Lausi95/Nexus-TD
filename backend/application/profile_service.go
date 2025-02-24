package application

import (
	"fmt"

	"github.com/Lausi95/Nexus-TD/domain"
)

type profileServiceImpl struct {
	profileFactory    domain.ProfileFactory
	profileRepository domain.ProfileRepository
	tokenHandler      domain.TokenHandler
	passwordEncoder   domain.PasswordEncoder
}

func NewProfileService(profileFactory domain.ProfileFactory, profileRepository domain.ProfileRepository, tokenHandler domain.TokenHandler, passwordEncoder domain.PasswordEncoder) domain.ProfileService {
	return &profileServiceImpl{
		profileFactory:    profileFactory,
		profileRepository: profileRepository,
		tokenHandler:      tokenHandler,
		passwordEncoder:   passwordEncoder,
	}
}

func (this *profileServiceImpl) Register(username, password, passwordRepeat, email string) error {
	// TODO validation

	exists, err := this.profileRepository.ExistsByUsername(username)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("User already exists.")
	}

	profile, err := this.profileFactory.Create(username, password, email)
	if err != nil {
		return err
	}

	if err := this.profileRepository.Save(profile); err != nil {
		return err
	}

	return nil
}

func (this *profileServiceImpl) Login(username, password string) (string, error) {
	exists, err := this.profileRepository.ExistsByUsername(username)
	if err != nil || !exists {
		return "", err
	}

	profile, err := this.profileRepository.FindByUsername(username)
	if err != nil {
		return "", err
	}

	if !this.passwordEncoder.Check(password, profile.PasswordHash) {
		return "", fmt.Errorf("Password Incorrect")
	}

	token, err := this.tokenHandler.CreateToken(username)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (this *profileServiceImpl) Verify(token string) (string, error) {
	username, err := this.tokenHandler.VerifyToken(token)
	if err != nil {
		return "", err
	}

	return username, nil
}

func (this *profileServiceImpl) GetProfile(username string) (*domain.Profile, error) {
	return this.profileRepository.FindByUsername(username)
}
