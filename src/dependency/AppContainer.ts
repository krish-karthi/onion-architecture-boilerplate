import { InversifyExpressServer } from 'inversify-express-utils';

import { errorHandler } from 'ui/config/errors/handlers/errorHandler';

import { ExpressApplication } from 'ui/config/application/ExpressApplication';
import { ApplicationAuthProvider } from 'ui/config/auth/middlewares/ApplicationAuthProvider';
import { UI_APPLICATION_IDENTIFIERS } from 'ui/UiModuleSymbols';

import { BaseContainer } from 'dependency/BaseContainer';
import { ApplicationModule } from 'dependency/common/ApplicationModule';
import { CommonModule } from 'dependency/common/CommonModule';
import { AuthenticationModule } from 'dependency/Authentication/AuthenticationModule';
import { UserModule } from 'dependency/User/UserModule';
import { RoleModule } from 'dependency/Role/RoleModule';
import { EquipmentModule } from 'dependency/Equipment/EquipmentModule';

export class AppContainer extends BaseContainer {
  constructor() {
    super({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true,
    });
  }

  /**
   * @description Order of initialization matters
   */
  init(): void {
    this.provideCommonModule();

    this.provideApplicationModule();

    this.provideRoleModule();
    this.provideUserModule();
    this.provideEquipmentModule();
    this.provideAuthenticationModule();

    this.provideInversifyExpressApplication();
  }

  private provideApplicationModule(): void {
    this.load(new ApplicationModule());
  }

  private provideCommonModule(): void {
    this.load(new CommonModule());
  }

  private provideAuthenticationModule(): void {
    this.load(new AuthenticationModule());
  }

  private provideUserModule(): void {
    this.load(new UserModule());
  }

  private provideRoleModule(): void {
    this.load(new RoleModule());
  }

  private provideEquipmentModule(): void {
    this.load(new EquipmentModule());
  }

  private provideInversifyExpressApplication(): void {
    this.bind<InversifyExpressServer>(
      UI_APPLICATION_IDENTIFIERS.INVERSIFY_APPLICATION
    ).toConstantValue(
      new InversifyExpressServer(
        this,
        null,
        { rootPath: '/' },
        this.get<ExpressApplication>(
          UI_APPLICATION_IDENTIFIERS.EXPRESS_APPLICATION
        ).getApplication(),
        ApplicationAuthProvider
      ).setErrorConfig(errorHandler)
    );
  }
}
