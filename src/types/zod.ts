
import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
//@ts-ignore
import translation from "zod-i18n-map/locales/es/zod.json";

// lng and resources key depend on your locale.
i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

// export configured zod instance

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema):any {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, undefined];
    })
  );
}
export { z };
