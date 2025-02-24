package mysql

import (
	"database/sql"

	"github.com/Lausi95/Nexus-TD/domain"
)

type mysqlUpgradeRepository struct {
	db *sql.DB
}

func NewMysqlUpgradeRepository(db *sql.DB) domain.UpgradeRepository {
	return &mysqlUpgradeRepository{db: db}
}

func (this *mysqlUpgradeRepository) ExistsById(id domain.UpgradeId) (bool, error) {
	query := this.db.QueryRow("SELECT COUNT(*) FROM upgrade WHERE id = ?", id)

	count := 0
	if err := query.Scan(&count); err != nil {
		return false, err
	}

	return count > 0, nil
}

func (this *mysqlUpgradeRepository) ExistsByName(name domain.UpgradeName) (bool, error) {
	query := this.db.QueryRow("SELECT COUNT(*) FROM upgrade WHERE name = ?", name)

	count := 0
	if err := query.Scan(&count); err != nil {
		return false, err
	}

	return count > 0, nil
}

func (this *mysqlUpgradeRepository) FindByName(name domain.UpgradeName) (*domain.Upgrade, error) {
	query := this.db.QueryRow("SELECT id, name, cost FROM upgrade WHERE name = ?", name)

	upgrade := new(domain.Upgrade)
	if err := query.Scan(&upgrade.Id, &upgrade.Name, &upgrade.Cost); err != nil {
		return nil, err
	}

	return upgrade, nil
}

func (this *mysqlUpgradeRepository) Save(upgrade *domain.Upgrade) error {
	exists, err := this.ExistsById(upgrade.Id)
	if err != nil {
		return err
	}

	if exists {
		_, err := this.db.Exec("UPDATE upgrade SET name = ?, cost = ? WHERE id = ?", upgrade.Name, upgrade.Cost, upgrade.Id)
		if err != nil {
			return err
		}
	} else {
		_, err := this.db.Exec("INSERT INTO upgrade(id, name, cost) VALUES(?, ?, ?)", upgrade.Id, upgrade.Name, upgrade.Cost)
		if err != nil {
			return err
		}
	}

	return nil
}
