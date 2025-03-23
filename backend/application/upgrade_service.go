package application

import (
	"log"

	"github.com/Lausi95/Nexus-TD/domain"
)

type upgradeServiceImpl struct {
	upgradeFactory    domain.UpgradeFactory
	upgradeRepository domain.UpgradeRepository
}

func NewUpgradeService(upgradeFactory domain.UpgradeFactory, upgradeRepository domain.UpgradeRepository) domain.UpgradeService {
	return &upgradeServiceImpl{
		upgradeFactory:    upgradeFactory,
		upgradeRepository: upgradeRepository,
	}
}

func (this *upgradeServiceImpl) SyncUpgrade(name domain.UpgradeName, cost domain.UpgradeCost) error {
	log.Printf("Synchronizing upgrade %v with cost %v", name, cost)

	exists, err := this.upgradeRepository.ExistsByName(name)
	if err != nil {
		return nil
	}

	if !exists {
		upgrade, err := this.upgradeFactory.Create(name, cost)
		if err != nil {
			return err
		}

		if err := this.upgradeRepository.Save(upgrade); err != nil {
			return err
		}
	}

	upgrade, err := this.upgradeRepository.FindByName(name)
	if err != nil {
		return err
	}

	if upgrade.Cost != cost {
		upgrade.Cost = cost
		if err := this.upgradeRepository.Save(upgrade); err != nil {
			return err
		}
	}

	return nil
}
