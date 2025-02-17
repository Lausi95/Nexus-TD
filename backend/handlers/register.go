package handlers

import (
	"net/http"

	"github.com/Lausi95/Nexus-TD/model"
	"github.com/labstack/echo/v4"
)

type RegisterRequest struct {
	model.CreateProfileParams
}

type RegisterResponse struct {
	Id string `json:"id"`
}

func RegisterHandler(context echo.Context) error {
	requestBody := new(RegisterRequest)
	if err := context.Bind(requestBody); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	userId, err := model.CreateProfile(&requestBody.CreateProfileParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	context.Response().Header().Add("location", "/profile")
	return context.JSON(http.StatusCreated, RegisterResponse{
		Id: userId,
	})
}
