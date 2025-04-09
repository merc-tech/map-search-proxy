import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface LongdoMapModuleOptions {
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<LongdoMapModuleOptions>().setClassMethodName('forRoot').setExtras(
        {
            isGlobal: true,
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    ).build();
