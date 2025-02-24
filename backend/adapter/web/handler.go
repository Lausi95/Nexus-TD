package web

import "github.com/labstack/echo/v4"

type Handler interface {
	Init(e *echo.Echo)
}
