package domain

type IdGenerator interface {
	Generate() (string, error)
}
