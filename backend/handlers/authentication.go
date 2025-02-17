package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/Lausi95/Nexus-TD/model"
	"github.com/Lausi95/Nexus-TD/util"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

var secret = []byte(util.GetEnv("NEXUS_TD_JWT_SECRET", "changeMElaterPLEASEuwu", true))

type AuthorizedContext struct {
	echo.Context
	username string
}

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
		Issuer:    "Nexus-TD",
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Subject:   request.Username,
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

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(context echo.Context) error {
		path := context.Request().URL.Path
		if path == "/login" || path == "/register" {
			return next(context)
		}

		tokenHeaderValue := context.Request().Header.Get("Authorization")
		if tokenHeaderValue == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
		}

		tokenHeaderParts := strings.Split(tokenHeaderValue, "")
		if len(tokenHeaderParts) != 2 {
			return echo.NewHTTPError(http.StatusUnauthorized, "malformed authorization header")
		}

		tokenString := tokenHeaderParts[1]
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(_ *jwt.Token) (interface{}, error) {
			return secret, nil
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
		}

		if !token.Valid {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
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
