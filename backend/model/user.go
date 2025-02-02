package model

import (
	"fmt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"nexus-td.com/storage"
)

type User struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type CreateUserParams struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
	Email          string `json:"email"`
}

func CreateUser(params *CreateUserParams) error {
	if params.PasswordRepeat != params.PasswordRepeat {
		return fmt.Errorf("password and password repeat is not equal")
	}

	newId, err := uuid.NewRandom()
	if err != nil {
		return err
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(params.Password), 14)
	if err != nil {
		return err
	}
	passwordHash := string(bytes)

	_, err = storage.GetDB().Exec("INSERT INTO user(id, username, email, passwordHash) VALUES (?, ?, ?, ?)", newId.String(), params.Username, params.Email, passwordHash)
	if err != nil {
		return err
	}

	return nil
}

func FindAllUsers() ([]*User, error) {
	users := []*User{}

	rows, err := storage.GetDB().Query("SELECT `id`, `username` FROM user")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user = new(User)
		err = rows.Scan(&user.Id, &user.Name)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	err = rows.Err()
	if err != nil {
		return nil, err
	}

	return users, nil
}

func CheckPassword(username string, password string) bool {
	var passwordHash string
	row := storage.GetDB().QueryRow("SELECT passwordHash FROM user WHERE username = ?", username)
	if err := row.Scan(&passwordHash); err != nil {
		return false
	}

	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	return err == nil
}
