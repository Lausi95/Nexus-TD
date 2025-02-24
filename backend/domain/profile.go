package domain

type Profile struct {
	Id           string
	Username     string
	PasswordHash string
	Gems         uint8
}

type ProfileFactory interface {
	Create(username, password, email string) (*Profile, error)
}

type ProfileRepository interface {
	ExistsByUsername(username string) (bool, error)
	FindByUsername(username string) (*Profile, error)
	Save(profile *Profile) error
}

type ProfileService interface {
	Register(username, password, passwordRepeat, email string) error
	Login(username, password string) (string, error)
	Verify(token string) (string, error)
	GetProfile(username string) (*Profile, error)
}
