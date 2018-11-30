import RNLanguages from 'react-native-languages';
import I18n from 'i18n-js';

import de from './de';
import nl from './nl';

I18n.locale = RNLanguages.language.split('-')[0];
I18n.fallbacks = true;
I18n.missingTranslation = scope => scope;

I18n.translations = {
  de,
  nl
};

export default I18n;
