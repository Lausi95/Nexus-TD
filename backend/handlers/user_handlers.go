package handlers

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"nexus-td.com/model"
	"strings"
	"time"
)

type AuthorizedContext struct {
	echo.Context
	username string
}

var secret = []byte("changeMElaterPLEASEuwu")

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func LoginHandler(context echo.Context) error {
	request := new(LoginRequest)
	if err := context.Bind(request); err != nil {
		return err
	}

	if !model.CheckPassword(request.Username, request.Password) {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid username or password")
	}

	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Issuer:    "Nexus-TD",
		Subject:   request.Username,
		ID:        "1",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(secret)
	if err != nil {
		return err
	}

	return context.JSON(http.StatusOK, LoginResponse{
		Token: tokenString,
	})
}

func RegisterHandler(context echo.Context) error {
	requestBody := new(model.CreateUserParams)
	if err := context.Bind(requestBody); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	err := model.CreateUser(requestBody)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return context.String(http.StatusCreated, "Registered.")
}

func GetUsersHandler(context echo.Context) error {
	username := context.(*AuthorizedContext).username
	log.Println(username)

	users, err := model.FindAllUsers()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return context.JSON(http.StatusOK, users)
}

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(context echo.Context) error {
		path := context.Request().URL.Path
		if path == "/login" || path == "/register" {
			return next(context)
		}

		tokenHeaderValue := context.Request().Header.Get("Authorization")
		if tokenHeaderValue == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "Missing Authorization header")
		}

		tokenString := strings.Split(tokenHeaderValue, " ")[1]
		if tokenString == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "No token provided")
		}

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return secret, nil
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
		}

		if !token.Valid {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
		}

		sub, err := token.Claims.GetSubject()
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
		}

		authorizedContext := &AuthorizedContext{
			Context:  context,
			username: sub,
		}

		return next(authorizedContext)
	}
}
