package domain

type TokenHandler interface {
	CreateToken(username string) (string, error)
	VerifyToken(token string) (string, error)
}
