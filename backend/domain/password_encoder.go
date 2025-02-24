package domain

type PasswordEncoder interface {
	Encode(password string) (string, error)
	Check(password, encodedPassword string) bool
}
