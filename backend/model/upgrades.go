package model

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/Lausi95/Nexus-TD/storage"
	"github.com/Lausi95/Nexus-TD/util"
)

type upgradeDefinition struct {
	name string
	cost int
}

var upgrades []upgradeDefinition = []upgradeDefinition{
	{
		name: "START_LIFES_1",
		cost: 1,
	},
	{
		name: "START_LIFES_2",
		cost: 3,
	},
	{
		name: "START_LIFES_3",
		cost: 5,
	},
}

func InitUpgrades() error {
	for _, upgrade := range upgrades {
		if err := initUpgrade(&upgrade); err != nil {
			return err
		}
	}

	return nil
}

func initUpgrade(upgrade *upgradeDefinition) error {
	tx, err := storage.GetDB().Begin()
	if err != nil {
		log.Fatal(err)
		return err
	}

	if err := initUpgradeTx(upgrade, tx); err != nil {
		log.Fatal(err)
		if err := tx.Rollback(); err != nil {
			return err
		}
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func initUpgradeTx(upgrade *upgradeDefinition, tx *sql.Tx) error {
	// check if upgrade is in db
	sql := "SELECT count(*) FROM upgrade WHERE name = ?"
	row := tx.QueryRow(sql, upgrade.name)

	count := 0
	if err := row.Scan(&count); err != nil {
		return err
	}
	if count >= 2 {
		return fmt.Errorf(":/")
	}
	upgradeExists := count == 1

	// if it does not exist, create it
	if !upgradeExists {
		upgradeId, err := util.GenerateId()
		if err != nil {
			return err
		}

		sql = "INSERT INTO upgrade(id, name, cost) VALUES (?, ?, ?)"
		if _, err := tx.Exec(sql, upgradeId, upgrade.name, upgrade.cost); err != nil {
			return err
		}
	}

	// check if upgrade has the desired cost
	sql = "SELECT cost FROM upgrade WHERE name = ?"
	row = tx.QueryRow(sql, upgrade.name)
	currentCost := 0
	if err := row.Scan(&currentCost); err != nil {
		return err
	}

	// if it does not, update the cost
	if currentCost != upgrade.cost {
		sql = "UPDATE upgrade SET cost = ? WHERE name = ?"
		if _, err := tx.Exec(sql, upgrade.cost, upgrade.name); err != nil {
			return err
		}
	}

	return nil
}
