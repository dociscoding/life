import { NativeModules, Platform } from "react-native";

// Hook for using multiple language scheme

export const defaultLanguage = "en";
export const supportedLanguages = ["en", "it"];

const useLanguage = (props: string | Array<string>) => {
  // Check languages for Android: https://stackoverflow.com/questions/7973023/what-is-the-list-of-supported-languages-locales-on-android
  // Check languages for iOS: https://www.ibabbleon.com/iOS-Language-Codes-ISO-639.html
  const system_lang_pref = systemLanguage();

  const lang = system_lang_pref || defaultLanguage;
  let data;

  switch (lang) {
    case "en":
      data = require("../i18n/en.json");
      break;
    case "it":
      data = require("../i18n/it.json");
      break;
    default:
      data = require("../i18n/en.json");
  }

  if (Array.isArray(props)) {
    let cache = {};
    for (let i = 0; i < props.length; i++) {
      //@ts-ignore
      cache[props[i]] = data[props[i]] || props[i];
    }
    return cache as {};
  }

  return (data[props as string] || props) as string;
};

export const systemLanguage = () => {
  if (Platform.OS === "ios") {
    const module =
      NativeModules?.SettingsManager?.settings?.AppleLocale ||
      NativeModules?.SettingsManager?.settings?.AppleLanguages[0];
    const module_one = module?.split("-")[0];
    const module_two = module?.split("_")[0];
    if (module_one && module_two) {
      if (supportedLanguages.includes(module_one)) {
        return module_one;
      } else if (supportedLanguages.includes(module_two)) {
        return module_two;
      } else {
        return defaultLanguage;
      }
    }
  } else if (Platform.OS === "android") {
    const module = NativeModules?.I18nManager?.localeIdentifier?.split("_")[0];
    if (module && supportedLanguages.includes(module)) {
      return module;
    } else {
      return defaultLanguage;
    }
  } else {
    return defaultLanguage;
  }
};

export default useLanguage;
