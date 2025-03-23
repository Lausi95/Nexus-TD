package mysql

import (
	"database/sql"

	"github.com/Lausi95/Nexus-TD/domain"
)

type mysqlProfileRepository struct {
	db *sql.DB
}

func NewMysqlProfileRepository(db *sql.DB) domain.ProfileRepository {
	return &mysqlProfileRepository{db: db}
}

func (this *mysqlProfileRepository) ExistsById(id string) (bool, error) {
	query := this.db.QueryRow("SELECT COUNT(*) FROM profile WHERE id = ?", id)

	count := 0
	if err := query.Scan(&count); err != nil {
		return false, err
	}

	return count > 0, nil
}

func (this *mysqlProfileRepository) ExistsByUsername(username string) (bool, error) {
	query := this.db.QueryRow("SELECT COUNT(*) FROM profile WHERE username = ?", username)

	count := 0
	if err := query.Scan(&count); err != nil {
		return false, err
	}

	return count > 0, nil
}

func (this *mysqlProfileRepository) FindByUsername(username string) (*domain.Profile, error) {
	query := this.db.QueryRow("SELECT * FROM profile WHERE username = ?", username)

	profile := new(domain.Profile)
	if err := query.Scan(&profile.Id, &profile.Username, &profile.PasswordHash, &profile.Gems); err != nil {
		return nil, err
	}

	return profile, nil
}

func (this *mysqlProfileRepository) Save(profile *domain.Profile) error {
	exists, err := this.ExistsById(profile.Id)
	if err != nil {
		return err
	}

	if exists {
		_, err := this.db.Exec("UPDATE profile SET username = ?, passwordHash = ?, gems = ? WHERE id = ?",
			profile.Username,
			profile.PasswordHash,
			profile.Gems,
			profile.Id)
		if err != nil {
			return err
		}
	} else {
		_, err := this.db.Exec("INSERT INTO profile(id, username, passwordHash, gems) VALUES (?, ?, ?, ?)",
			profile.Id,
			profile.Username,
			profile.PasswordHash,
			profile.Gems)
		if err != nil {
			return err
		}
	}

	return nil
}
