package jwt

import (
	"fmt"
	"time"

	"github.com/Lausi95/Nexus-TD/domain"
	"github.com/golang-jwt/jwt/v5"
)

type jwtTokenHandler struct {
	tokenSecret string
}

func NewJwtTokenHandler(tokenSecret string) domain.TokenHandler {
	return &jwtTokenHandler{
		tokenSecret: tokenSecret,
	}
}

func (this *jwtTokenHandler) CreateToken(username string) (string, error) {
	claims := jwt.RegisteredClaims{
		Issuer:    "Nexus-TD",
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Subject:   username,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(this.tokenSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (this *jwtTokenHandler) VerifyToken(tokenString string) (string, error) {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(_ *jwt.Token) (interface{}, error) {
		return this.tokenSecret, nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", fmt.Errorf("Invalid Token")
	}

	sub, err := token.Claims.GetSubject()
	if err != nil {
		return "", err
	}

	return sub, nil
}
