package application

import (
	"github.com/Lausi95/Nexus-TD/domain"
)

type upgradeFactoryImpl struct {
	idGenerator domain.IdGenerator
}

func NewUpgradeFactory(idGenerator domain.IdGenerator) domain.UpgradeFactory {
	return &upgradeFactoryImpl{idGenerator: idGenerator}
}

func (this *upgradeFactoryImpl) Create(name domain.UpgradeName, cost domain.UpgradeCost) (*domain.Upgrade, error) {
	id, err := this.idGenerator.Generate()
	if err != nil {
		return nil, err
	}

	upgrade := &domain.Upgrade{
		Id:   domain.UpgradeId(id),
		Name: name,
		Cost: cost,
	}

	return upgrade, nil
}
