/**
 * Localization strings used in top menu and user tools
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const headerText = createDictionary({
  skipToContent: {
    comment: 'For accessibility purposes. Allows jumping to page content',
    'en-us': 'Skip to Content',
    'ru-ru': 'Перейти к содержанию',
    'es-es': 'Saltar al contenido',
    'fr-fr': 'Aller au contenu',
    'uk-ua': 'Перейти до вмісту',
    'de-ch': 'Weiter zum Inhalt',
  },
  main: {
    comment: 'As in "main menu"',
    'en-us': 'Main',
    'es-es': 'Inicio',
    'fr-fr': 'Principal',
    'ru-ru': 'Основной',
    'uk-ua': 'Головна',
    'de-ch': 'Allgemein',
  },
  currentCollection: {
    comment: 'Example: Current Collection',
    'en-us': 'Current {collectionTable:string}',
    'ru-ru': 'Текущая {collectionTable:string}',
    'es-es': 'Colección actual',
    'fr-fr': 'Courant {collectionTable:string}',
    'uk-ua': 'Поточна {collectionTable:string}',
    'de-ch': 'Derzeitige {collectionTable:string}',
  },
  dataEntry: {
    'en-us': 'Data Entry',
    'ru-ru': 'Ввод данных',
    'es-es': 'Entrada de Datos',
    'fr-fr': 'La saisie des données',
    'uk-ua': 'Введення даних',
    'de-ch': 'Datenerfassung',
  },
  makeDwca: {
    'en-us': 'Create DwC Archive',
    'ru-ru': 'Создать архив DwC',
    'es-es': 'Hacer DwCA',
    'fr-fr': 'Créer une archive DwC',
    'uk-ua': 'Створити архів DwC',
    'de-ch': 'DwC-Archiv erstellen',
  },
  updateExportFeed: {
    'en-us': 'Update RSS Feed',
    'ru-ru': 'Обновить RSS-канал',
    'es-es': 'Actualizar Fuente de Datos Ahora',
    'fr-fr': 'Mettre à jour le flux RSS',
    'uk-ua': 'Оновити RSS-канал',
    'de-ch': 'RSS-Feed aktualisieren',
  },
  updateExportFeedConfirmation: {
    'en-us': 'Update export feed?',
    'ru-ru': 'Обновить фид экспорта?',
    'es-es': '¿Actualizar el canal de exportación?',
    'fr-fr': "Mettre à jour le flux d'exportation ?",
    'uk-ua': 'Оновити канал експорту?',
    'de-ch': 'Export-Feed aktualisieren?',
  },
  updateExportFeedConfirmationDescription: {
    'en-us': 'Update all RSS export feed items now?',
    'ru-ru': 'Обновить все элементы RSS-канала экспорта сейчас?',
    'es-es':
      '¿Actualizar todos los elementos de la fuente de exportación RSS ahora?',
    'fr-fr': "Mettre à jour tous les éléments du flux d'export RSS maintenant?",
    'uk-ua': 'Оновити всі елементи RSS-експорту?',
    'de-ch': 'Jetzt alle RSS-Export-Feed-Elemente aktualisieren?',
  },
  feedExportStarted: {
    'en-us': 'Export feed update started',
    'ru-ru': 'Начато обновление фида экспорта',
    'es-es': 'Se inició la actualización del canal de exportación',
    'fr-fr': "La mise à jour du flux d'exportation a commencé",
    'uk-ua': 'Оновлення каналу експорту розпочато',
    'de-ch': 'Aktualisierung des Export-Feeds gestartet',
  },
  feedExportStartedDescription: {
    'en-us': `
      Update started. You will receive a notification for each feed item
      updated.
    `,
    'ru-ru': `
      Обновление запущено. Вы будете получать уведомление о каждом обновлении
      элемента фида.
    `,
    'es-es': `
      Actualización iniciada. Recibirás una notificación cada vez que se
      actualice un elemento del canal.
    `,
    'fr-fr': `
      La mise à jour a commencé. Vous recevrez une notification pour chaque
      élément de flux mis à jour.
    `,
    'uk-ua': `
      Оновлення розпочато. Ви отримаєте сповіщення про кожен оновлений елемент
      каналу.
    `,
    'de-ch': `
      Aktualisierung gestartet. Sie erhalten eine Benachrichtigung für jedes
      aktualisierte Feed-Element.
    `,
  },
  dwcaExportStarted: {
    'en-us': 'DwCA export started',
    'ru-ru': 'Начат экспорт DwCA',
    'es-es': 'Exportación de DwCA iniciada',
    'fr-fr': "L'exportation DwCA a commencé",
    'uk-ua': 'Розпочато експорт DwCA',
    'de-ch': 'DwCA-Export gestartet',
  },
  dwcaExportStartedDescription: {
    'en-us': `
      Export started. You will receive a notification when the export is
      complete.
    `,
    'ru-ru': `
      Экспорт запущен. Вы получите уведомление, когда экспорт будет завершен.
    `,
    'es-es': `
      Exportación iniciada. Recibirá una notificación cuando se complete la
      exportación.
    `,
    'fr-fr': `
      L'exportation a commencé. Vous recevrez une notification lorsque
      l'exportation sera terminée.
    `,
    'uk-ua':
      'Експорт розпочато. Коли експорт завершиться, ви отримаєте сповіщення.',
    'de-ch': `
      Export gestartet. Sie erhalten eine Benachrichtigung, sobald der Export
      abgeschlossen ist.
    `,
  },
  labelName: {
    'en-us': 'Label Name',
    'ru-ru': 'Название ярлыка',
    'es-es': 'Nombre de la etiqueta',
    'fr-fr': "Nom de l'étiquette",
    'uk-ua': 'Назва бірки',
    'de-ch': 'Etikett Name',
  },
  reportName: {
    'en-us': 'Report Name',
    'ru-ru': 'Название отчета',
    'es-es': 'Nombre del Informe',
    'fr-fr': 'Nom du rapport',
    'uk-ua': 'Назва звіту',
    'de-ch': 'Name des Berichts',
  },
  createLabel: {
    'en-us': 'Create new label',
    'ru-ru': 'Создать новый ярлык',
    'es-es': 'Crear una nueva etiqueta',
    'fr-fr': 'Créer une nouvelle étiquette',
    'uk-ua': 'Створити нову бірку',
    'de-ch': 'Neues Label erstellen',
  },
  createReport: {
    'en-us': 'Create new report',
    'ru-ru': 'Создать новый отчет',
    'es-es': 'Crear un nuevo informe',
    'fr-fr': 'Créer un nouveau rapport',
    'uk-ua': 'Створити новий звіт',
    'de-ch': 'Neuen Bericht erstellen',
  },
  repairTree: {
    'en-us': 'Repair Tree',
    'ru-ru': 'Ремонтное дерево',
    'es-es': 'Reparar Árbol',
    'fr-fr': 'Arbre de réparation',
    'uk-ua': 'Ремонтувати дерево',
    'de-ch': 'Baum reparieren',
  },
  treeRepairComplete: {
    'en-us': 'Tree repair is complete.',
    'ru-ru': 'Ремонт дерева завершен.',
    'es-es': 'La reparación del árbol está completa.',
    'fr-fr': "La réparation de l'arbre est terminée.",
    'uk-ua': 'Ремонт дерева завершено.',
    'de-ch': 'Die Baumreparatur ist abgeschlossen.',
  },
  chooseDwca: {
    'en-us': 'Choose DwCA',
    'ru-ru': 'Выберите ДвКА',
    'es-es': 'Elija un DwCA',
    'fr-fr': 'Choisissez DwCA',
    'uk-ua': 'Виберіть DwCA',
    'de-ch': 'DwCA wählen',
  },
  chooseMetadataResource: {
    'en-us': 'Choose Metadata resource',
    'ru-ru': 'Выберите ресурс метаданных',
    'es-es': 'Seleccione un recurso de los metadatos',
    'fr-fr': 'Choisissez la ressource de métadonnées',
    'uk-ua': 'Виберіть ресурс метаданих',
    'de-ch': 'Metadaten-Ressource auswählen',
  },
  simpleSearch: {
    'en-us': 'Simple Search',
    'ru-ru': 'Экспресс-поиск',
    'es-es': 'Búsqueda rápida',
    'fr-fr': 'Recherche express',
    'uk-ua': 'Експрес-пошук',
    'de-ch': 'Express-Suche',
  },
  primarySearch: {
    'en-us': 'Primary Search',
    'ru-ru': 'Основной поиск',
    'es-es': 'Búsqueda principal',
    'fr-fr': 'Recherche principale',
    'uk-ua': 'Первинний пошук',
    'de-ch': 'Primäre Suche',
  },
  secondarySearch: {
    'en-us': 'Secondary Search',
    'ru-ru': 'Вторичный поиск',
    'es-es': 'Búsqueda secundaria',
    'fr-fr': 'Recherche secondaire',
    'uk-ua': 'Вторинний пошук',
    'de-ch': 'Sekundäre Suche',
  },
  menuItems: {
    'en-us': 'Menu Items',
    'ru-ru': 'Элементы меню',
    'es-es': 'Elementos de menú',
    'fr-fr': 'Éléments de menu',
    'uk-ua': 'Елементи меню',
    'de-ch': 'Menü-Einträge',
  },
  userTools: {
    'en-us': 'User Tools',
    'ru-ru': 'Инструменты',
    'es-es': 'Herramientas',
    'fr-fr': 'Outils utilisateur',
    'uk-ua': 'Інструменти',
    'de-ch': 'Benutzerwerkzeuge',
  },
  userToolsForUser: {
    'en-us': 'User Tools ({userName:string})',
    'ru-ru': 'Инструменты ({userName:string})',
    'es-es': 'Herramientas ({userName:string})',
    'fr-fr': 'Outils utilisateur ({userName:string})',
    'uk-ua': 'Інструменти ({userName:string})',
    'de-ch': 'Benutzerwerkzeuge ({userName:string})',
  },
  helpLocalizeSpecify: {
    'en-us': 'Help Localize Specify 7',
    'ru-ru': 'Помогите локализовать Укажите 7',
    'es-es': 'Ayuda a personalizar geográficamente Specify 7',
    'fr-fr': 'Aide Localiser Spécifier 7',
    'uk-ua': 'Допоможіть перекласти Specify 7',
    'de-ch': 'Hilf beim übersetzen von Specify 7',
  },
  helpLocalizeSpecifyDescription: {
    'en-us': `
      We would be very grateful for your support localizing Specify 7 User
      Interface. If you are interested, please <link>see the
      instructions</link>.
    `,
    'ru-ru': `
      Мы будем очень признательны за вашу поддержку в локализации
      пользовательского интерфейса Specify 7. Если вы заинтересованы, отправьте
      электронное письмо по адресу <link>см. Инструкции</link>.
    `,
    'es-es': `
      Estaríamos muy agradecidos por su apoyo para localizar la interfaz de
      usuario de Specific 7. Si está interesado, por favor <link> consulte las
      instrucciones </link>.
    `,
    'fr-fr': `
      Nous vous serions très reconnaissants de votre aide pour la localisation
      de l'interface utilisateur Spécifiez 7. Si vous êtes intéressé, veuillez
      <link>voir les instructions</link>.
    `,
    'uk-ua': `
      Ми будемо дуже вдячні за вашу підтримку в перекладі інтерфейсу Specify 7.
      Якщо ви зацікавлені, <link>перегляньте інструкції</link>.
    `,
    'de-ch': `
      Wir wären sehr dankbar für Ihre Unterstützung bei der Übersetzung der
      Specify 7 Benutzeroberfläche. Wenn Sie daran interessiert sind, lesen Sie
      bitte <link>die Anleitung</link>.
    `,
  },
  incompleteInline: {
    'en-us': '(incomplete)',
    'es-es': '(incompleto)',
    'fr-fr': '(incomplet)',
    'ru-ru': '(неполный)',
    'uk-ua': '(не закінчено)',
    'de-ch': '(unvollständig)',
  },
  incompleteLocalization: {
    'en-us': 'Incomplete localization',
    'es-es': 'Localización incompleta',
    'fr-fr': 'Localisation incomplète',
    'ru-ru': 'Неполная локализация',
    'uk-ua': 'Неповна локалізація',
    'de-ch': 'Unvollständige Übersetzung',
  },
  incompleteLocalizationDescription: {
    'en-us': `
      Translation to this language is not yet complete. Some elements may be
      missing localization, or have incorrect localization. If you are
      interested in helping us complete localization, please <link>follow the
      instructions.</link>
    `,
    'es-es': `
      La traducción a este idioma aún no está completa. Es posible que a algunos
      elementos les falte la localización o tengan una localización
      incorrecta. Si está interesado en ayudarnos a completar la
      localización, <link>siga las instrucciones.</link>
    `,
    'fr-fr': `
      La traduction dans cette langue n'est pas encore terminée. Certains
      éléments peuvent manquer de localisation ou avoir une localisation
      incorrecte. Si vous souhaitez nous aider à terminer la localisation,
      veuillez <link>suivre les instructions.</link>
    `,
    'ru-ru': `
      Перевод на этот язык еще не завершен. У некоторых элементов может
      отсутствовать локализация или они имеют неправильную локализацию. Если вы
      хотите помочь нам завершить локализацию, <link>следуйте
      инструкциям.</link>
    `,
    'uk-ua': `
      Переклад цією мовою ще не завершено. Деякі елементи можуть не мати
      локалізації або мати неправильну локалізацію. Якщо ви зацікавлені в тому,
      щоб допомогти нам завершити локалізацію, будь ласка, <link>прочитайте
      інструкцій.</link>
    `,
    'de-ch': `
      Die Übersetzung in diese Sprache ist noch nicht abgeschlossen. Bei einigen
      Elementen fehlt möglicherweise die Lokalisierung oder sie sind nicht
      korrekt lokalisiert. Wenn Sie daran interessiert sind, uns bei der
      Vervollständigung der Übersetzung zu helfen, <link>befolgen Sie bitte die
      Anweisungen.</link>
    `,
  },
  tableApi: {
    'en-us': 'Tables API',
    'ru-ru': 'API таблиц',
    'es-es': 'API de las tablas',
    'fr-fr': 'API Tableaux',
    'uk-ua': 'API таблиць',
    'de-ch': 'Tabellen-API',
  },
  operationsApi: {
    'en-us': 'Operations API',
    'ru-ru': 'Операционный API',
    'es-es': 'API para las operaciones',
    'fr-fr': 'API des opérations',
    'uk-ua': 'API операцій',
    'de-ch': 'Operations-API',
  },
  documentation: {
    'en-us': 'Documentation',
    'ru-ru': 'Документация',
    'es-es': 'Documentación',
    'fr-fr': 'Documentation',
    'uk-ua': 'Документація',
    'de-ch': 'Dokumentation',
  },
  administration: {
    'en-us': 'Administrative Tools',
    'ru-ru': 'Инструменты управления',
    'es-es': 'Herramientas administrativas',
    'fr-fr': 'Outils administratifs',
    'uk-ua': 'Адміністрування',
    'de-ch': 'Administrative Werkzeuge',
  },
  developers: {
    'en-us': 'Developer Resources',
    'ru-ru': 'Ресурсы для разработчиков',
    'es-es': 'Recursos para desarrolladores',
    'fr-fr': 'Ressources pour les développeurs',
    'uk-ua': 'Для розробників',
    'de-ch': 'Ressourcen für Entwickler',
  },
  forum: {
    'en-us': 'Community Forum',
    'ru-ru': 'форум сообщества',
    'es-es': 'Foro de la Comunidad',
    'fr-fr': 'Forum de la communauté',
    'uk-ua': 'Форум',
    'de-ch': 'Community-Forum',
  },
  clearCache: {
    'en-us': 'Clear Browser Cache',
    'ru-ru': 'Очистить кеш браузера',
    'es-es': 'Borrar la caché del navegador',
    'fr-fr': 'Effacer le cache du navigateur',
    'uk-ua': 'Очистити кеш браузера',
    'de-ch': 'Browser-Cache leeren',
  },
  cacheCleared: {
    'en-us': 'Cache has been cleared. Please reload the page.',
    'ru-ru': 'Кэш очищен. Пожалуйста, перезагрузите страницу.',
    'es-es': 'Se ha borrado la memoria caché. Por favor actualiza la página.',
    'fr-fr': 'Le cache a été vidé. Veuillez recharger la page.',
    'uk-ua': 'Кеш очищено. Перезавантажте сторінку.',
    'de-ch': 'Der Cache wurde geleert. Bitte laden Sie die Seite neu.',
  },
  technicalDocumentation: {
    'en-us': 'Technical Docs',
    'ru-ru': 'Технические документы',
    'es-es': 'Documentos técnicos',
    'fr-fr': 'Documents techniques',
    'uk-ua': 'Технічні документи',
    'de-ch': 'Technische Dokumentation',
  },
} as const);
