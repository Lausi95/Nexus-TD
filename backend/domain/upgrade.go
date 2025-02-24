package domain

type UpgradeId string
type UpgradeName string
type UpgradeCost uint8

type Upgrade struct {
	Id   UpgradeId
	Name UpgradeName
	Cost UpgradeCost
}

type UpgradeRepository interface {
	ExistsByName(name UpgradeName) (bool, error)
	FindByName(name UpgradeName) (*Upgrade, error)
	Save(upgrade *Upgrade) error
}

type UpgradeFactory interface {
	Create(name UpgradeName, cost UpgradeCost) (*Upgrade, error)
}

type UpgradeService interface {
	SyncUpgrade(name UpgradeName, cost UpgradeCost) error
}
