package encryption

import (
	"github.com/Lausi95/Nexus-TD/domain"
	"golang.org/x/crypto/bcrypt"
)

type bcryptPasswordEncoder struct{}

func NewBcryptPasswordEncoder() domain.PasswordEncoder {
	return &bcryptPasswordEncoder{}
}

func (this *bcryptPasswordEncoder) Encode(password string) (string, error) {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return "", err
	}

	return string(passwordHash), nil
}

func (this *bcryptPasswordEncoder) Check(password, passwordHash string) bool {
	pwCompRes := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	return pwCompRes != nil
}
