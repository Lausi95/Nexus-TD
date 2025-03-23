package web

import (
	"net/http"
	"strings"

	"github.com/Lausi95/Nexus-TD/domain"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	echo           *echo.Echo
	profileService domain.ProfileService
}

func NewAuthHandler(profileService domain.ProfileService) *AuthHandler {
	return &AuthHandler{
		profileService: profileService,
	}
}

type RegisterRequest struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	PasswordRepeat string `json:"passwordRepeat"`
	Email          string `json:"email"`
}

type RegisterResponse struct{}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (this *AuthHandler) Init(e *echo.Echo) {
	e.POST("/register", func(context echo.Context) error {
		request := new(RegisterRequest)
		if err := context.Bind(request); err != nil {
			return err
		}

		if err := this.profileService.Register(request.Username, request.Password, request.PasswordRepeat, request.Email); err != nil {
			return err
		}

		return context.JSON(http.StatusCreated, &RegisterResponse{})
	})

	e.POST("/login", func(context echo.Context) error {
		request := new(LoginRequest)
		if err := context.Bind(request); err != nil {
			return err
		}

		token, err := this.profileService.Login(request.Username, request.Password)
		if err != nil {
			return err
		}

		return context.JSON(http.StatusOK, &LoginResponse{
			Token: token,
		})
	})

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
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

			sub, err := this.profileService.Verify(tokenString)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
			}

			authorizedContext := &AuthorizedContext{
				Context:  context,
				username: sub,
			}

			return next(authorizedContext)
		}
	})
}
