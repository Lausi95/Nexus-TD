package web

import (
	"net/http"

	"github.com/Lausi95/Nexus-TD/domain"
	"github.com/labstack/echo/v4"
)

type ProfileHandler struct {
	profileService domain.ProfileService
}

func NewProfileController(profileService domain.ProfileService) *ProfileHandler {
	return &ProfileHandler{
		profileService: profileService,
	}
}

type ProfileResponse struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Gems     uint8  `json:"gems"`
}

func (this *ProfileHandler) Init(e *echo.Echo) {
	e.GET("/profile", func(context echo.Context) error {
		username := getUsernameFromContext(context)

		profile, err := this.profileService.GetProfile(username)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err)
		}

		return context.JSON(http.StatusOK, &ProfileResponse{
			Id:       profile.Id,
			Username: profile.Username,
			Gems:     profile.Gems,
		})
	})
}
