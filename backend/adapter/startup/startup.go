package startup

import "github.com/Lausi95/Nexus-TD/domain"

type startupRoutine struct {
	upgradeService domain.UpgradeService
}

func NewStartupRoutine(upgradeService domain.UpgradeService) *startupRoutine {
	return &startupRoutine{upgradeService: upgradeService}
}

func (this *startupRoutine) Run() error {
	if err := this.upgradeService.SyncUpgrade("START_HEALTH_1", 1); err != nil {
		return err
	}
	if err := this.upgradeService.SyncUpgrade("START_HEALTH_2", 2); err != nil {
		return err
	}
	if err := this.upgradeService.SyncUpgrade("START_HEALTH_3", 5); err != nil {
		return err
	}

	return nil
}
