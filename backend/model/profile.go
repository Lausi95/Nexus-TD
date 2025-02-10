package model

import (
	"fmt"

	"github.com/Lausi95/Nexus-TD/storage"
	"github.com/Lausi95/Nexus-TD/util"
	"github.com/labstack/gommon/log"
	"golang.org/x/crypto/bcrypt"
)

type Profile struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Gems     int    `json:"gems"`
}

type CreateProfileParams struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
	Email          string `json:"email"`
}

func CreateProfile(params *CreateProfileParams) (string, error) {
	if len(params.Password) < 6 {
		return "", fmt.Errorf("password needs to have at least 6 symbols")
	}

	if params.Password != params.PasswordRepeat {
		return "", fmt.Errorf("password and password repeat is not equal")
	}

	newId, err := util.GenerateId()
	if err != nil {
		return "", err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(params.Password), 10)
	if err != nil {
		return "", err
	}

	query := "INSERT INTO user(id, username, email, passwordHash) VALUES (?, ?, ?, ?)"
	_, err = storage.GetDB().Exec(query, newId, params.Username, params.Email, string(passwordHash))
	if err != nil {
		return "", err
	}

	return newId, nil
}

func GetProfile(username string) (*Profile, error) {
	query := "SELECT id, username, gems FROM user WHERE username = ?"
	row := storage.GetDB().QueryRow(query, username)

	var profile = new(Profile)
	if err := row.Scan(&profile.Id, &profile.Username, &profile.Gems); err != nil {
		return nil, err
	}

	return profile, nil
}

func CheckPassword(username string, password string) bool {
	sql := "SELECT passwordHash FROM user WHERE username = ?"
	row := storage.GetDB().QueryRow(sql, username)

	var passwordHash string
	if err := row.Scan(&passwordHash); err != nil {
		log.Errorf("Something went wrong when checking password: %v", err)
		return false
	}

	pwCompRes := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	return pwCompRes != nil
}
