package handlers

import (
	"net/http"

	"github.com/Lausi95/Nexus-TD/model"
	"github.com/labstack/echo/v4"
)

func GetProfile(context echo.Context) error {
	username := context.(*AuthorizedContext).username

	profile, err := model.GetProfile(username)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return context.JSON(http.StatusOK, profile)
}
