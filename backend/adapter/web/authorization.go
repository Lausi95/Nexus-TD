package web

import "github.com/labstack/echo/v4"

type AuthorizedContext struct {
	echo.Context
	username string
}

func getUsernameFromContext(context echo.Context) string {
	return context.(*AuthorizedContext).username
}
